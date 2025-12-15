// app/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Post } from "@prisma/client"; 

export async function getPosts(): Promise<Post[]> {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string | null;

  if (!title) {
    throw new Error("Title is required.");
  }

  await prisma.post.create({
    data: {
      title,
      content,
    },
  });

  revalidatePath("/");
}

export async function updatePost(postId: number, formData: FormData) {
  const title = formData.get("title") as string;
  const published = formData.get("published") === "on";

  if (!title) {
    throw new Error("Title is required.");
  }

  await prisma.post.update({
    where: { id: postId },
    data: {
      title,
      published,
    },
  });

  revalidatePath("/");
}

export async function deletePost(postId: number) {
  await prisma.post.delete({
    where: { id: postId },
  });

  revalidatePath("/");
}