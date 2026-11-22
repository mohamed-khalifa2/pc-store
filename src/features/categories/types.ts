export type CategoryCardData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string;
};

export type CategoryDetailData = CategoryCardData & {
  parentId: string | null;
  sortOrder: number;
};
