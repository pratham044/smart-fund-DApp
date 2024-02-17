import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState } from "../store/index";
import { setGlobalState } from "../store/index";
import { createProject } from "../services/blockchain";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateProject = () => {
  const [createModal, setCreateModal] = useGlobalState("createModal");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("");
  const [date, setDate] = useState("");
  const [imageUrl, setImageURL] = useState("");

  const toTimestamp = (dateStr) => {
    const dateObj = Date.parse(dateStr);
    return dateObj / 1000;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !target || !date || !imageUrl) return;

    const params = {
      title,
      description,
      imageUrl,
      target,
      expireAt: toTimestamp(date),
    };

    await createProject(params); 
    toast.success("Project created successfully, will reflect in about 30sec.");
    onClose();
  };

  const onClose = () => {
    setGlobalState("createModal", "scale-0");
    reset();
  };

  // Reseting every state to null
  const reset = () => {
    setTitle("");
    setTarget("");
    setDescription("");
    setImageURL("");
    setDate("");
  };

  return (
    <div
      className={`fixed top-0 bottom-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 transform transition-transform duration-300 ${createModal}`}
    >
      <div className="w-11/12 p-6 bg-white shadow-xl shadow-black rounded-xl md:w-2/5 h-7/12">
        <div className="flex items-center justify-between">
          <p className="font-semibold"> Add Project </p>
          <button
            type="button"
            className="bg-transparent border-0 focus:outline-none"
            onClick={onClose}
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex items-center justify-center object-cover p-3">
          <img
            src={
              imageUrl ||
              "https://imgs.search.brave.com/VlkOtp3Fm6rj_qQYdA5cgtPNx-SwzCrPrhpEKj6wUi4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4u/dmVjdG9yc3RvY2su/Y29tL2kvcHJldmll/dy0xeC8wNi84NC9j/cm93ZGZ1bmRpbmct/ZmluYW5jaW5nLWNy/ZWF0aXZlLXByb2pl/Y3QtdmVjdG9yLTI5/MTQwNjg0LmpwZw"
            }
            alt="project image"
            className="w-40"
          />
        </div>
        <form className="flex flex-col " onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 ">
            <label className="flex flex-col">
              <span className="px-2 font-semibold text-gray-700">Title : </span>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="px-3 py-2 bg-gray-200 rounded-3xl focus:outline-none "
                required
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="px-2 font-semibold text-gray-700">Date</span>
              <input
                type="date"
                name="date"
                placeholder="Date"
                className="px-3 py-2 bg-gray-200 rounded-3xl focus:outline-none "
                required
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="px-2 font-semibold text-gray-700">Target</span>
              <input
                type="number"
                name="target"
                placeholder="Target"
                className="px-3 py-2 bg-gray-200 rounded-3xl focus:outline-none "
                required
                onChange={(e) => setTarget(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="px-2 font-semibold text-gray-700">
                Image URL
              </span>
              <input
                type="url"
                name="amount"
                placeholder="Image Url"
                className="px-3 py-2 bg-gray-200 rounded-3xl focus:outline-none "
                required
                onChange={(e) => setImageURL(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="px-2 font-semibold text-gray-700">
                Description
              </span>
              <textarea
                className="p-2 bg-gray-200 rounded-xl focus:ring-0 focus:outline-none"
                type="text"
                name="description"
                placeholder="Description"
                required
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className="w-4/12 px-4 py-2 mx-auto text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none"
            >
              Submit
              <ToastContainer />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
{
  /* <div className={` fixed top-0 bottom-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 transform transition-transform duration-300 ${createModal}`}>
    <div className='w-11/12 p-6 bg-white shadow-xl shadow-black rounded-xl md:w-2/5 h-7/12'>
        <form className='flex flex-col ' onSubmit={handleSubmit}>
            <div className='flex items-center justify-between '>
                <p className='font-semibold'> Add Project </p>
                <button type='button' className='bg-transparent border-0 focus:outline-none' onClick={onClose} >
                    <FaTimes />
                </button>
            </div>
            <div className='flex items-center justify-center object-cover p-3'>
                <img src={ imageUrl || 'https://imgs.search.brave.com/6Ox8tw0kK2UNIxYmUciehtraPgAnM8elWN2SCC1CfX4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzhhLzEy/LzZjLzhhMTI2Yzk0/MmJiM2EwZDQ1MTVh/MjgzNDc1NjBhYTE4/LmpwZw' } alt='project image ' className='w-20' />
            </div>
            
            <div className='flex flex-col items-start justify-center gap-1 '>
            <label>
                <input type="text" name='title' placeholder='Title' className='p-2 my-2 bg-gray-200 rounded-xl ' required onChange={(e) => setTitle(e.target.value)} />
            </label>
            
            <label>
               <input  className='p-2 my-2 bg-gray-200 rounded-xl' type='date' step={0.01} min={0.01} name='date' placeholder='Date' required onChange={(e) => setDate(e.target.value)} />
            </label> 
            <label>
                <input type="number" name='target' placeholder='Target' className='p-2 my-2 bg-gray-200 rounded-xl' required onChange={(e) => setTarget(e.target.value)} />
            </label>     
            <label>
                <input type="url" name='amount' placeholder='Image Url' className='p-2 my-2 bg-gray-200 rounded-xl' required onChange={(e) => setImageURL(e.target.value)} />
            </label> 
            <textarea className='p-2 my-2 bg-gray-200 rounded-xl focus:ring-0' type="text" name='description' placeholder='Description' required onChange={(e) => setDescription(e.target.value)} >
            </textarea>
            <button type='submit' className=' text-white bg-green-600 text-center px-3 py-1.5 rounded-full inline-block' >
                Submit 
                <ToastContainer />
            </button>
            </div>
        </form>
    </div>
    </div> */
}
