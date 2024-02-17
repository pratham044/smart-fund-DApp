import { FaEthereum } from "react-icons/fa";
import { setGlobalState, useGlobalState } from "../store/index";
import { payout_project } from "../services/blockchain";
import { daysRemaining, truncate } from "../store/index";
import Identicons from "react-identicons";

const ProjectDetails = ({ project }) => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  console.log("Project : " , project);
  
  const expired = new Date().getTime() > Number(project?.expiresAt + "000");

  return (
    <div className="flex justify-center px-6 pt-24 mb-5">
      <div className="flex flex-col justify-center md:w-2/3">
        <div className="flex flex-wrap items-start justify-start sm:space-x-4">
          <img
            src={project?.imageUrl}
            alt={project?.title}
            className="object-cover w-full h-64 rounded-xl sm:w-1/3"
          />

          <div className="flex-1 py-4 sm:py-0">
            <div className="flex flex-col flex-wrap justify-start">
              <h5 className="mb-2 text-2xl font-medium text-gray-900">
                {project?.title}
              </h5>
              <small className="text-gray-500 ">
                {expired
                  ? "Expired"
                  : daysRemaining(project?.expiresAt) + " left"}
              </small>
            </div>

            <div className="flex items-center justify-between w-full pt-1">
              <div className="flex justify-start space-x-2">
                <Identicons
                  className="rounded-full shadow-md "
                  string={project?.owner}
                  size={20}
                />
                {project?.owner ? (
                  <small className="pb-1 text-base text-gray-700">
                    {truncate(project?.owner, 7, 7, 18)}
                  </small>
                ) : null}
                <small className="px-10 text-base font-bold text-gray-500">
                  ({project?.backers} Backer{project?.backers == 1 ? "" : "s"})
                </small>
              </div>

              <div className="font-bold">
                {expired ? (
                  <small className="text-red-500">Expired</small>
                ) : project?.status == 0 ? (
                  <small className="text-green-600">Open</small>
                ) : project?.status == 1 ? (
                  <small className="text-red-500">Deleted</small>
                ) : project?.status == 2 ? (
                  <small className="text-gray-500">Reverted</small>
                ) : project?.status == 3 ? (
                  <small className="text-orange-500">Paidout</small>
                ) : (
                  <small className="text-green-500">Accepted</small>
                )}
              </div>
            </div>

            <div>
              <p className="mt-2 text-sm font-light">{project?.description}</p>
              <div className="w-full mt-4 overflow-hidden bg-gray-300">
                <div
                  className="bg-green-600 text-xs font-medium
            text-green-100 text-center p-0.5 leading-none
            rounded-l-full h-1 overflow-hidden max-w-full"
                  style={{
                    width: `${(project?.raised / project?.target) * 100}%`,
                  }}
                ></div>
              </div>

              <div className="flex items-center justify-between mt-2 font-bold">
                <small>{project?.raised} ETH Raised</small>
                <small className="flex items-center justify-start">
                  <FaEthereum />
                  <span>{project?.target} ETH</span>
                </small>
              </div>

              <div className="flex items-center justify-start mt-4 space-x-2">
                {project?.status == 0 ? (
                  <button
                    type="button"
                    className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
                    onClick={() => setGlobalState("backModal", "scale-100")}
                  >
                    Back Project
                  </button>
                ) : null}

                {connectedAccount == project?.owner ? (
                  project?.status != 3 ? (
                    project?.status == 1 ? (
                      <button
                        type="button"
                        className="inline-block px-6 py-2.5 bg-orange-600
                      text-white font-medium text-xs leading-tight uppercase
                      rounded-full shadow-md hover:bg-orange-700"
                        onClick={() => payout_project(project?.id)}
                      >
                        Payout
                      </button>
                    ) : project?.status != 4 ? (
                      <>
                        <button
                          type="button"
                          className="inline-block px-6 py-2.5 bg-gray-600
                        text-white font-medium text-xs leading-tight uppercase
                        rounded-full shadow-md hover:bg-gray-700"
                          onClick={() =>
                            setGlobalState("updateModal", "scale-100")
                          }
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="inline-block px-6 py-2.5 bg-red-600
                        text-white font-medium text-xs leading-tight uppercase
                        rounded-full shadow-md hover:bg-red-700"
                          onClick={() =>
                            setGlobalState("deleteModal", "scale-100")
                          }
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        className="inline-block px-6 py-2.5 bg-gray-600
                      text-white font-medium text-xs leading-tight uppercase
                      rounded-full shadow-md hover:bg-gray-700"
                      >
                        Project Closed
                      </button>
                    )
                  ) : null
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
