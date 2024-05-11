import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function Postmodal({ open, onClose, postId, onDelete }) {
  const API_BASE_URL = "https://vigoplace.com/server";
  const queryClient = useQueryClient();

  const deletePost = async (postId) => {
    //console.log(postId)
    const response = await fetch(
      `${API_BASE_URL}/api/admin/categorization/${postId}/post`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    //console.log(data)
    if (!response.ok) {
      throw new Error(data.error);
      return;
    }
    toast.success("Post successfully deleted");
    queryClient.invalidateQueries("uncategorizedData");
    queryClient.invalidateQueries("categorizedPost");
    return data;
  };

  const { mutate, isLoading, isError, error } = useMutation(deletePost);

  const handleDelete = async () => {
    try {
      await mutate(postId);
      onClose(); // Close the modal
      onDelete(); // Trigger the delete action in the parent component
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (isLoading) {
    return <div>Deleting post...</div>;
  }

  if (isError) {
    return <div>Error deleting post: {error.message}</div>;
  }

  if (!open) return null;

  return (
    <div className="flex flex-col mt-0 justify-center z-20 items-center ml-0 fixed bg-[#2e2b2b] bg-opacity-60 inset-0 w-full h-screen">
      <div className="bg-white w-96 h-72 rounded-md">
        <div className="p-10">
          <h5 className="text-center text-[#706464] font-bold pt-3 text-base">
            Are you sure you want delete this post?
          </h5>
          <h6 className="pt-12 leading-7 text-center text-[#706464] text-base">
            This will delete this post permanently.
            <br />
            You cannot undo this action.
          </h6>
          <div className="flex justify-center pt-10 gap-5">
            <button
              className="bg-white border-2 border-[#706464] py-2 px-5 text-base rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-[#F93636] py-3 px-7 rounded-md text-white text-base"
              onClick={() => handleDelete(postId)}
            >
              Delete post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
