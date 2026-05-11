import { MetadataRoute } from 'next'
import { getPublicBlogPosts } from '@/lib/actions/blogApi'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.shifaul.dev';
  
  const staticPages = [
    '',
    '/about',
    '/blog',
    '/portfolio',
    '/contact',
    '/service',
    '/terms',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: page === '' ? 1 : 0.8,
  }));

  try {
    const response = await getPublicBlogPosts({ limit: 100 });
    if (response.data?.success && response.data.data) {
      const posts = response.data.data;
      const postEntries = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
      sitemapEntries.push(...postEntries);
    }
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  return sitemapEntries;
}
