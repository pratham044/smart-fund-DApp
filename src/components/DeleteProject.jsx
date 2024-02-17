import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useGlobalState , setGlobalState } from '../store/index';
import { deleteProject } from '../services/blockchain';
import {toast} from 'react-toastify';

const DeleteProject = ({project}) => {
    const [deleteModal] = useGlobalState("deleteModal");
    const navigate = useNavigate();

    const handleSubmit =async (e) =>{
        e.preventDefault();
        await deleteProject(project?.id);
        toast.success('Project Deleted successfully, will reflect in about 30sec.');
        setGlobalState("deleteModal" , "scale-0");
        navigate('/'); // Navigate it to Home page after project got deleted
    }

  return (
    <div className={` fixed top-0 bottom-0 flex justify-center items-center w-screen h-screen bg-black bg-opacity-50 transform transition-transform duration-300 ${deleteModal}`}>
    <div className='bg-white shadow-xl shadow-black rounded-xl w-11/12 md:w-2/5 h-7/12 p-6'>
        <form className='flex flex-col ' onSubmit={handleSubmit} >
            <div className='flex justify-between items-center '>
                <div className='font-semibold text-lg'> Delete Project </div>
                <button type='button' className='border-0 bg-transparent focus:outline-none' onClick={() => setGlobalState('deleteModal' , 'scale-0')} >
                    <FaTimes />
                </button>
            </div>
            <div className='flex object-cover justify-center items-center p-3'>
                <img src={ project?.imageUrl || 'https://imgs.search.brave.com/6Ox8tw0kK2UNIxYmUciehtraPgAnM8elWN2SCC1CfX4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzhhLzEy/LzZjLzhhMTI2Yzk0/MmJiM2EwZDQ1MTVh/MjgzNDc1NjBhYTE4/LmpwZw'} alt={project?.title} className='w-20' />
            </div>
            <div className='text-gray-600 flex py-2 font-semibold justify-center items-center'>{project?.title} </div>
            <div className='text-red-400 flex py-2 font-semibold justify-center items-center'>This action is irreversible.</div>
            
                <div className='text-red-600 flex px-2 py-2 justify-center items-center'> Are you absolutely sure you want to proceed?</div>
            <div className='flex flex-col gap-1 justify-center items-center w-full px-2 py-1'>
            <button type='submit' className=' text-white bg-red-500 text-center w-full py-1.5 rounded-full inline-block'>
                Delete 
            </button>
            </div>
        </form>
    </div>
    </div>
  )
}

export default DeleteProject ;