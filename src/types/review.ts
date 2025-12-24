import type { ObjectId } from "mongodb";

export type Review = {
  _id?: ObjectId;

  serviceSlug: string;
  customerName: string;
  rating: number; // 1..5
  opinion: string;

  photoUrls: string[];
  createdAtISO: string; // ISO string stored in DB
};
