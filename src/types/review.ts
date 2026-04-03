
type Photo = {
  id: string;
  filename: string;
};

export type Review = {
  _id: string;
  serviceSlug: string;
  customerName: string;
  rating: number;
  opinion: string;
  photoUrls: Photo[];
  createdAtISO: string;
};
