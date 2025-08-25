
import { Timestamp } from "firebase/firestore";

export type Category = "Event" | "Community" | "Business" | "Deal" | "Movie";

export type Item = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: Category;
  location: string;
  image: string;
  date?: Timestamp | Date | string;
  director?: string;
  cast?: string[];
  genre?: string;
};

export type ModerationStatus = "Pending" | "Approved" | "Rejected" | "Reported";

export type ModerationItem = {
    type: Category;
    title: string;
    user: string;
    time: string;
    status: ModerationStatus;
    reason?: string;
}

export type Country = {
    code: string;
    name: string;
};

export type IndiaState = {
    code: string;
    name: string;
};
