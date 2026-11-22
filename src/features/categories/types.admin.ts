export type AdminCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imagePath: string | null;
  parentId: string | null;
  sortOrder: number;
  isPublished: boolean;
  publishedAt: string | null;
};
