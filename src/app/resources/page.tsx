import { Metadata } from "next";
import ResourcesPageClient from "./client";

export const metadata: Metadata = {
  title: "Health Resources | Vijay Hospital",
  description: "Download health guides, patient education materials, wellness resources, and insurance information from Vijay Hospital. Free educational guides from expert doctors.",
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}
