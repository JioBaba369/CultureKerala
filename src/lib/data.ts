
import type { Item, ModerationItem } from "@/types";

export const locations = ["Mumbai", "Delhi", "Bangalore", "Kolkata", "Chennai", "Sydney", "Melbourne"];

export const moderationItems: ModerationItem[] = [
    { type: "Business", title: "Mumbai Delights", user: "user@example.com", time: "36m ago", status: "Pending" },
    { type: "Event", title: "Late Night Party", user: "reporter@example.com", time: "2h ago", status: "Reported", reason: "Spam" },
    { type: "Community", title: "Delhi Bikers Group", user: "newuser@example.com", time: "1d ago", status: "Pending" },
    { type: "Deal", title: "Free Coffee", user: "bizowner@example.com", time: "2d ago", status: "Pending" },
    { type: "Business", title: "Sydney Sari Palace", user: "owner@example.com", time: "3d ago", status: "Pending" },
    { type: "Community", title: "Chennai Coders", user: "dev@example.com", time: "4d ago", status: "Approved" },
    { type: "Event", title: "Beach Cleanup", user: "volunteer@example.com", time: "5d ago", status: "Approved" },
    { type: "Deal", title: "Invalid Deal", user: "reporter2@example.com", time: "6d ago", status: "Rejected", reason: "Expired" },
];
