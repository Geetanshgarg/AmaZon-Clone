import prisma from "@AmaZon-Clone/db";

export const getCart = async (userId: string) => {
  return prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: true,
    },
  });
};

export const addToCart = async (userId: string, productId: string, quantity: number = 1) => {
  // Check stock
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  if (product.stock < quantity) throw Object.assign(new Error("Not enough stock"), { statusCode: 400 });

  // Add or update cart item
  return prisma.cartItem.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {
      quantity: {
        increment: quantity,
      },
    },
    create: {
      userId,
      productId,
      quantity,
    },
  });
};

export const updateCartItem = async (cartItemId: string, userId: string, quantity: number) => {
  if (quantity <= 0) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  // Ensure cart item belongs to user before updating
  const existing = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });

  if (!existing) throw Object.assign(new Error("Cart item not found"), { statusCode: 404 });

  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });
};

export const removeFromCart = async (cartItemId: string, userId: string) => {
  const existing = await prisma.cartItem.findFirst({
    where: { id: cartItemId, userId },
  });

  if (!existing) throw Object.assign(new Error("Cart item not found"), { statusCode: 404 });

  return prisma.cartItem.delete({
    where: { id: cartItemId },
  });
};
