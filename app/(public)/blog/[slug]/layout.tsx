// app/blog/[slug]/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Replace with your data fetching logic if available
  const postTitle = `Blog Post - ${slug}`;
  const postDescription = `Detailed insights and analysis in the blog post ${slug}.`;

  return {
    title: postTitle,
    description: postDescription,
    keywords: ["Blog", "Post", "Shifaul Islam", slug],
    openGraph: {
      title: postTitle,
      description: postDescription,
      url: `${process.env.NEXT_PUBLIC_URL}/blog/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: postTitle,
      description: postDescription,
    },
  };
}
export default function BlogpostLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
