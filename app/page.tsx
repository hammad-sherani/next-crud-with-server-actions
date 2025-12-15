// app/page.tsx
import { getPosts } from "@/app/actions";
import { Post } from "@prisma/client";
import PostItem from "./components/PostItem";
import CreatePostForm from "./components/CreatePostForm";

export default async function Home() {
  const posts: Post[] = await getPosts();

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Next.js CRUD Demo</h1>
      <CreatePostForm />
      <h2 className="text-2xl font-semibold mt-10 mb-4">All Posts</h2>
      <div className="space-y-4">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}