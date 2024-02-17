import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState } from "../store/index";
import { setGlobalState } from "../store/index";
import { backProject } from "../services/blockchain";
import { toast } from "react-toastify";

const BackProject = ({ project }) => {
  const [backModal] = useGlobalState("backModal");
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    await backProject(project?.id, amount); // wait for promise to get return 
    toast.success("Project backed successfully, will reflect in about 30sec.");
    setGlobalState("backModal", "scale-0"); // close the pop-up 
  };

  return (
    <div
      className={` fixed top-0 bottom-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 transform transition-transform duration-300 ${backModal}`}
    >
      <div className="bg-white shadow-xl shadow-black rounded-xl w-11/12 md:w-2/5 h-7/12 p-6">
        <form className="flex flex-col " onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <p className="font-semibold text-lg"> Back Project </p>
            <button
              type="button"
              className="border-0 bg-transparent focus:outline-none hover:scale-125 hover:text-gray-700"
              onClick={() => setGlobalState("backModal", "scale-0")}
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex object-cover justify-center items-center p-3">
            <img
              src={
                project?.imageUrl ||
                "https://imgs.search.brave.com/6Ox8tw0kK2UNIxYmUciehtraPgAnM8elWN2SCC1CfX4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzhhLzEy/LzZjLzhhMTI2Yzk0/MmJiM2EwZDQ1MTVh/MjgzNDc1NjBhYTE4/LmpwZw"
              }
              alt="project image "
              className="w-20"
            />
          </div>
          <div className="flex flex-col gap-1 justify-center items-center ">
            <label className="w-full">
              <input
                type="number"
                name="Amount"
                placeholder="Amount (in ETH)"
                className="bg-gray-200 p-2 px-3 rounded-3xl my-2 w-full
                "
                required
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>

            <button
              type="submit"
              className=" text-white bg-green-600 text-center px-4 py-1.5 rounded-full inline-block"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BackProject;
