import prisma from "@AmaZon-Clone/db";

export const createOrder = async (userId: string, explicitItems?: { productId: string; quantity: number }[]): Promise<any> => {
  return prisma.$transaction(async (tx) => {
    let cartItems: any[] = [];
    
    if (explicitItems && explicitItems.length > 0) {
      // Build cartItems structure from explicit items manually by fetching product data
      for (const item of explicitItems) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw Object.assign(new Error(`Product ${item.productId} not found`), { statusCode: 404 });
        cartItems.push({ productId: product.id, quantity: item.quantity, product });
      }
    } else {
      cartItems = await tx.cartItem.findMany({
        where: { userId },
        include: { product: true },
      });
    }

    if (cartItems.length === 0) {
      throw Object.assign(new Error("Cart is empty"), { statusCode: 400 });
    }

    let totalAmount = 0;

    // 2. Validate stock and calculate total amount
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        throw Object.assign(
          new Error(`Insufficient stock for product ${item.product.name}`),
          { statusCode: 400 }
        );
      }
      // totalAmount requires Number(price) because Prisma Decimal typing can be strict
      totalAmount += Number(item.product.price) * item.quantity;
    }

    // 3. Create the order with order items
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: "PENDING",
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price, // Save a snapshot of the price
          })),
        },
      },
      include: {
        orderItems: true,
      },
    });

    // 4. Deduct stock from products
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    // 5. Clear the cart
    await tx.cartItem.deleteMany({
      where: { userId },
    });

    return order;
  });
};

export const getOrders = async (userId: string): Promise<any> => {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
};

export const getOrderById = async (orderId: string, userId: string): Promise<any> => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order) {
    throw Object.assign(new Error("Order not found or unauthorized"), { statusCode: 404 });
  }

  return order;
};
