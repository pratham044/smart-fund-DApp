import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState, setGlobalState } from "../store/index";
import { updateProject } from "../services/blockchain";
import { toast } from "react-toastify";

const UpdateProject = ({ project }) => {
  const [updateModal, setUpdateModal] = useGlobalState("updateModal");

  const [title, setTitle] = useState(project?.title);
  const [description, setDescription] = useState(project?.description);
  const [date, setDate] = useState(project?.date);
  const [imageUrl, setImageURL] = useState(project?.imageUrl);

  const toTimestamp = (dateStr) => {
    const dateObj = Date.parse(dateStr);
    return dateObj / 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !imageUrl) return;

    const params = {
      id: project?.id,
      title,
      description,
      imageUrl,
      expiresAt: toTimestamp(date),
    };
    await updateProject(params);
    toast.success("Project updated successfully, will reflect in about 30sec.");
    setGlobalState("updateModal", "scale-0");
  };

  return (
    <div className={`fixed top-0 bottom-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 transform transition-transform duration-300 ${updateModal}`}>
  <div className="bg-white shadow-xl rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
    <form className="flex flex-col" onSubmit={handleSubmit}>
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-lg">Edit Project</p>
        <button
          type="button"
          className="focus:outline-none"
          onClick={() => setUpdateModal("scale-0")}
        >
          <FaTimes />
        </button>
      </div>
      <div className="flex justify-center mb-4">
        <img
          src={imageUrl || "https://imgs.search.brave.com/6Ox8tw0kK2UNIxYmUciehtraPgAnM8elWN2SCC1CfX4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzhhLzEy/LzZjLzhhMTI2Yzk0/MmJiM2EwZDQ1MTVh/MjgzNDc1NjBhYTE4/LmpwZw"}
          alt="project image"
          className="w-20 h-20 object-cover cursor-pointer"
        />
      </div>
      <div className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="text-sm">New Title</span>
          <input
            type="text"
            name="title"
            placeholder="New Title"
            className="bg-gray-200 p-2 rounded-lg"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Date</span>
          <input
            type="date"
            name="date"
            className="bg-gray-200 p-2 rounded-lg"
            required
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Image URL</span>
          <input
            type="url"
            name="amount"
            placeholder="Image Url"
            className="bg-gray-200 p-2 rounded-lg"
            required
            onChange={(e) => setImageURL(e.target.value)}
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Description</span>
          <textarea
            className="bg-gray-200 p-2 rounded-lg focus:ring-0"
            type="text"
            name="description"
            placeholder="Description"
            required
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </label>
        <button
          type="submit"
          className="bg-green-600 text-white px-3 py-2 rounded-full inline-block"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

export default UpdateProject;
