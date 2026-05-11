// app/portfolio/[slug]/layout.tsx
import type { Metadata } from "next";
import { ReactNode } from "react";
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // Replace with your data fetching logic if available
  const projectTitle = `Project - ${slug}`;
  const projectDescription = `Detailed description and insights about project ${slug}.`;

  return {
    title: projectTitle,
    description: projectDescription,
    keywords: ["Portfolio", "Project", "Shifaul Islam", slug],
    openGraph: {
      title: projectTitle,
      description: projectDescription,
      url: `${process.env.NEXT_PUBLIC_URL}/portfolio/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: projectTitle,
      description: projectDescription,
    },
  };
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
