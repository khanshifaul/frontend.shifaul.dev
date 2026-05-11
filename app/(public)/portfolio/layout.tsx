// PublicLayout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Innovative Projects by Shifaul Islam",
  description:
    "Explore the portfolio of Shifaul Islam featuring projects in AI, machine learning, brain-computer interfaces, and software engineering. See how technology meets creativity.",
  keywords: [
    "Portfolio",
    "Shifaul Islam",
    "projects",
    "AI",
    "BCI",
    "software engineering",
    "innovation",
  ],
  openGraph: {
    title: "Portfolio - Innovative Projects by Shifaul Islam",
    description:
      "Explore the portfolio of Shifaul Islam featuring projects in AI, machine learning, brain-computer interfaces, and software engineering.",
    url: `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio - Innovative Projects by Shifaul Islam",
    description:
      "Explore the portfolio of Shifaul Islam featuring projects in AI, machine learning, BCI, and software engineering.",
  },
};

export default function PortfolioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
