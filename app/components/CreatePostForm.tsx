// app/components/CreatePostForm.tsx
"use client";

import { useFormStatus } from "react-dom";
import { createPost } from "@/app/actions";
import toast, { Toaster } from 'react-hot-toast'; // 💡 Import toast and Toaster

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
    >
      {pending ? "Creating..." : "Create Post"}
    </button>
  );
}

export default function CreatePostForm() {
  
  // 💡 Naya form action handler
  const formActionHandler = async (formData: FormData) => {
    // Client-side validation:
    const title = formData.get("title");
    if (!title) {
        toast.error("Title field cannot be empty.");
        return;
    }

    // Server Action ko call karein
    try {
      // 1. Server Action chalao
      await createPost(formData);
      
      // 2. Success hone par Toast show karein
      toast.success("✅ Post successfully created!"); 
      
      // 3. Form ko reset karein (Optional: user experience behtar banane ke liye)
      const formElement = document.getElementById('create-post-form') as HTMLFormElement;
      if (formElement) {
        formElement.reset();
      }
      
    } catch (error) {
      // 4. Error hone par error toast show karein
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast.error(`❌ Creation failed: ${errorMessage}`);
      console.error(error);
    }
  };


  return (
    <>
      {/* 💡 Toaster Component Add karein (Yeh component notifications dikhayega) */}
      <Toaster position="top-center" /> 
      
      {/* Form action ab client-side handler ko point karega */}
      <form id="create-post-form" action={formActionHandler} className="border p-4 rounded shadow space-y-3">
        <h3 className="text-xl font-medium">Create New Post</h3>
        <input
          type="text"
          name="title" 
          placeholder="Post Title (required)"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="content"
          placeholder="Post Content (optional)"
          rows={3}
          className="w-full border p-2 rounded"
        />
        <SubmitButton />
      </form>
    </>
  );
}