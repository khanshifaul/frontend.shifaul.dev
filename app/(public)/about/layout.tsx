// PublicLayout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Shifaul Islam - Software Engineer & Innovator in AI and BCI",
  description:
    "Discover the journey of Shifaul Islam, a dedicated software engineer with a focus on AI and BCI technologies. Learn about his background, education, and vision for the future of technology.",
  keywords: [
    "About Shifaul Islam",
    "Software Engineer",
    "AI",
    "BCI",
    "background",
    "education",
    "innovation",
  ],
  openGraph: {
    title: "About Shifaul Islam - Software Engineer & Innovator in AI and BCI",
    description:
      "Discover the journey of Shifaul Islam, a dedicated software engineer with a focus on AI and BCI technologies. Learn about his background, education, and vision for the future of technology.",
    url: `${process.env.NEXT_PUBLIC_API_URL}/about`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Shifaul Islam - Software Engineer & Innovator in AI and BCI",
    description:
      "Discover the journey of Shifaul Islam, a dedicated software engineer with a focus on AI and BCI technologies.",
  },
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
