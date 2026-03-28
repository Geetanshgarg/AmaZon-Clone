import prisma from "@AmaZon-Clone/db";

export const getProducts = async (
  page: number = 1,
  limit: number = 10,
  search?: string,
  categoryId?: string,
  sortBy?: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const skip = (page - 1) * limit;

  // Build the where clause for filtering and searching
  const where: any = {};
  
  if (categoryId) {
    where.categoryId = categoryId;
  }
  
  if (search) {
    where.name = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  // Build sort order
  let orderBy: any = { createdAt: "desc" };
  if (sortBy === "price_asc") orderBy = { price: "asc" };
  else if (sortBy === "price_desc") orderBy = { price: "desc" };
  else if (sortBy === "name_asc") orderBy = { name: "asc" };
  else if (sortBy === "name_desc") orderBy = { name: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: true,
      },
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    metadata: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  if (!product) {
    throw Object.assign(new Error("Product not found"), { statusCode: 404 });
  }

  return product;
};
