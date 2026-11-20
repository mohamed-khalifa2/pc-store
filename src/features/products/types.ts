export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  priceEgp: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
};
