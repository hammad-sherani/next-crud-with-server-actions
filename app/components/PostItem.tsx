// app/components/PostItem.tsx
"use client";

import { Post } from "@prisma/client";
import { useFormStatus } from "react-dom";
import { updatePost, deletePost } from "@/app/actions";
import { useState } from "react";
import toast, { Toaster } from 'react-hot-toast'; // Toast library

interface PostItemProps {
  post: Post;
}

// --- Sub-Component: Delete Button with Loading State ---
function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-red-500 hover:bg-red-700 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}

// --- Sub-Component: Save Button with Loading State ---
function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending} 
      className="bg-green-500 hover:bg-green-700 text-white py-1 px-3 rounded text-sm disabled:opacity-50"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

// --- Main Component ---
export default function PostItem({ post }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Server Action binding (Post ID ko action ke saath jodne ke liye)
  const deleteActionWithId = deletePost.bind(null, post.id);
  const updateActionWithId = updatePost.bind(null, post.id);

  // 💡 DELETE ACTION HANDLER
  const handleDelete = async () => {
    // Confirmation ke liye browser prompt (Optional, but recommended for Delete)
    if (!window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
        return;
    }
    
    try {
      await deleteActionWithId(); // Server Action ko call karein
      toast.success(`🗑️ Post "${post.title}" deleted.`);
    } catch (error) {
      toast.error("❌ Failed to delete post.");
      console.error(error);
    }
  };

  // 💡 UPDATE ACTION HANDLER
  const handleUpdate = async (formData: FormData) => {
    try {
      await updateActionWithId(formData); // Server Action ko call karein
      
      // FormData se title nikal kar toast mein dikhayein
      const newTitle = formData.get('title');
      toast.success(`📝 Post "${newTitle}" updated.`);
      
      setIsEditing(false); // Update successful hone ke baad editing mode band karein
    } catch (error) {
      toast.error("❌ Failed to update post.");
      console.error(error);
    }
  };


  // --- Render Editing Form ---
  if (isEditing) {
    return (
      <form action={handleUpdate} className="border p-4 rounded shadow bg-yellow-50 space-y-2">
        <input
          type="text"
          name="title"
          defaultValue={post.title}
          required
          className="w-full border p-2 rounded text-lg text-black font-semibold"
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`published-${post.id}`}
            name="published"
            defaultChecked={post.published}
          />
          <label className="text-black" htmlFor={`published-${post.id}`}>Published</label>
        </div>
        <div className="flex space-x-2">
          <SaveButton />
          <button 
            type="button" 
            onClick={() => setIsEditing(false)} 
            className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  // --- Render Display View ---
  return (
    <>
      <Toaster position="top-right" /> {/* Toast container */}
      <div className="border p-4 rounded shadow bg-white flex justify-between items-center">
        <div>
          <h3 className="text-lg text-black font-semibold">{post.title}</h3>
          <p className="text-sm text-gray-600">{post.content}</p>
          <span className={`text-xs ${post.published ? 'text-green-600' : 'text-red-600'}`}>
            {post.published ? 'Published' : 'Draft'}
          </span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          
          {/* Edit Button */}
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
          >
            Edit
          </button>
          
          {/* Delete Form (using custom onSubmit handler) */}
          <form 
            onSubmit={(e) => {
                // Form submit hone se pehle preventDefault() lagana zaroori hai 
                // taki hum custom handleDelete function chala sakein
                e.preventDefault(); 
                handleDelete();     
            }}
          >
            <DeleteButton />
          </form>
        </div>
      </div>
    </>
  );
}