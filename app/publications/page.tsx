// app/publications/page.tsx

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import { navItems } from "@/data";

// Function to get posts from a directory
const getPosts = (directory: string) => {
  const postsDirectory = path.join(process.cwd(), `content/${directory}`);
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      directory,
      ...(matterResult.data as {
        title: string;
        date: string;
        summary: string;
      }),
    };
  });

  // Sort posts by date in descending order
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
};

const PublicationsPage = () => {
  const blogPosts = getPosts("blogs");
  const researchPapers = getPosts("research");

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full py-20 sm:py-32">
        {/* Add the floating nav to this page as well */}
        <FloatingNav
          navItems={[
            { name: "Home", link: "/" },
            ...navItems.filter((item) => item.link.startsWith("#")),
          ]}
        />

        <h1 className="heading text-white">
          Writings & <span className="text-purple">Research</span>
        </h1>

        {/* Blog Posts Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white-100">Blog Posts</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.length > 0 ? (
              blogPosts.map((post) => (
                <Link
                  href={`/publications/${post.directory}/${post.slug}`}
                  key={post.slug}
                  className="block p-6 bg-black-200 rounded-lg border border-white/[0.1] hover:border-purple transition-colors duration-200"
                >
                  <p className="text-sm text-neutral-400">{post.date}</p>
                  <h3 className="text-xl font-semibold text-white mt-2">
                    {post.title}
                  </h3>
                  <p className="text-neutral-300 mt-2">{post.summary}</p>
                </Link>
              ))
            ) : (
              <p className="text-neutral-400">No blog posts yet.</p>
            )}
          </div>
        </div>

        {/* Research Papers Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-white-100">
            Research & Academics
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {researchPapers.length > 0 ? (
              researchPapers.map((paper) => (
                <Link
                  href={`/publications/${paper.directory}/${paper.slug}`}
                  key={paper.slug}
                  className="block p-6 bg-black-200 rounded-lg border border-white/[0.1] hover:border-purple transition-colors duration-200"
                >
                  <p className="text-sm text-neutral-400">{paper.date}</p>
                  <h3 className="text-xl font-semibold text-white mt-2">
                    {paper.title}
                  </h3>
                  <p className="text-neutral-300 mt-2">{paper.summary}</p>
                </Link>
              ))
            ) : (
              <p className="text-neutral-400">No research papers yet.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PublicationsPage;
