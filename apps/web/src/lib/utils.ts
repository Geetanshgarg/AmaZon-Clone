export const formatPrice = (price: number | string) => {
  return "₹" + Number(price).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
