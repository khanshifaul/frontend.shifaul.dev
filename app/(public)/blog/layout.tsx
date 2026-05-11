// PublicLayout.tsx
import { AnimatePresence } from "motion/react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Insights & Innovations in AI, BCI, and Software Engineering",
  description:
    "Stay updated with the latest trends and insights on AI, brain-computer interfaces, and software engineering through the blog of Shifaul Islam. Read articles, tutorials, and case studies.",
  keywords: [
    "Blog",
    "Shifaul Islam",
    "AI",
    "BCI",
    "software engineering",
    "tutorials",
    "technology insights",
  ],
  openGraph: {
    title: "Blog - Insights & Innovations in AI, BCI, and Software Engineering",
    description:
      "Stay updated with the latest trends and insights on AI, brain-computer interfaces, and software engineering through the blog of Shifaul Islam.",
    url: `${process.env.NEXT_PUBLIC_API_URL}/blog`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog - Insights & Innovations in AI, BCI, and Software Engineering",
    description:
      "Stay updated with the latest trends and insights on AI, BCI, and software engineering. Read articles, tutorials, and case studies.",
  },
};

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AnimatePresence>{children}</AnimatePresence>;
}
