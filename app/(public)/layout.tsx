// PublicLayout.tsx
import DevFooter from "@/components/common/DevFooter";
import FloatingWidget from "@/components/common/FloatingWidget";
import NavBar from "@/components/common/NavBar";
import HireBanner from "@/components/common/HireBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shifaul Islam - Aspiring Software Engineer | AI & BCI Enthusiast",
  description:
    "Welcome to the portfolio of Shifaul Islam, an aspiring software engineer passionate about AI and brain-computer interfaces. Explore projects, skills, and insights on technology and innovation.",
  keywords: [
    "Shifaul Islam",
    "Software Engineer",
    "AI",
    "BCI",
    "portfolio",
    "technology",
    "projects",
    "blog",
  ],
  openGraph: {
    title: "Shifaul Islam - Aspiring Software Engineer | AI & BCI Enthusiast",
    description:
      "Welcome to the portfolio of Shifaul Islam, an aspiring software engineer passionate about AI and brain-computer interfaces. Explore projects, skills, and insights on technology and innovation.",
    url: `${process.env.NEXT_PUBLIC_API_URL}`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shifaul Islam - Aspiring Software Engineer | AI & BCI Enthusiast",
    description:
      "Welcome to the portfolio of Shifaul Islam, an aspiring software engineer passionate about AI and brain-computer interfaces. Explore projects, skills, and insights on technology and innovation.",
  },
};

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col w-full h-screen overflow-hidden">
      {/* Persistent Sticky Header */}
      <div className="sticky top-0 z-50 w-full">
        <HireBanner />
        <NavBar className="backdrop-blur-md" />
      </div>

      <main className="flex-1 overflow-y-auto snap-y snap-mandatory scroll-smooth scrollbar-none">
        {children}
      </main>
      <DevFooter className="sticky bottom-0 z-50" />
      {/* Floating Widget */}
      <FloatingWidget />
    </div>
  );
}
