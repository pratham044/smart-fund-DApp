import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { truncate } from "../store";
import { FaEthereum } from "react-icons/fa";
import { daysRemaining } from "../store";
import Identicons from "react-identicons";

const Projects = ({ projects }) => {
  const [recieved_projects, setProjects] = useState([]);

  const [end, setEnd] = useState(3);
  const [count] = useState(3);
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsArray = await projects;
        setProjects(projectsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, [projects]);

  const getCollection = () => recieved_projects.slice(0, end);
  useEffect(() => {
    setCollection(getCollection());
  }, [recieved_projects, end]);

  return (
    <div className="flex flex-col p-4 px-6 mb-7">
      <div className="flex flex-wrap items-center justify-center">
        {collection.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
      {recieved_projects.length > collection.length ? (
        <div className="flex items-center justify-center my-5">
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600
          text-white font-medium text-xs leading-tight uppercase
          rounded-full shadow-md hover:bg-green-700"
            onClick={() => setEnd(end + count)}
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
};

const ProjectCard = ({ project }) => {
  // check expiry date
  const expired = new Date().getTime() > Number(project?.expiresAt + "000");

  return project?.status != 1 ? (
    <div id="projects" className="w-64 m-4 bg-white rounded-lg shadow-lg ">
      <Link to={"/projects/" + project.id}>
        <img
          src={
            project.imageUrl ||
            "https://imgs.search.brave.com/6yz2O2VMpgQz_QxPjezntKKQCz7JzLGM10nxx8rjT9s/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMuZnJlZWltYWdl/cy5jb20vaW1hZ2Vz/L2hvbWUvYmx1cmJz/L3Zpc3VhbHMud2Vi/cA"
          }
          alt={project.title}
          className="w-full h-64 rounded-xl "
          style={{ objectFit: "cover", objectPosition: "50% 50%" }}
        />

        <div className="items-center justify-center px-2 py-3">
          <div className="flex-col justify-between">
            <div className="text-lg font-bold">
              {truncate(project.title, 25, 0, 28)}
            </div>
            <div className="flex items-center justify-between mb-3">
              <Identicons
                className="rounded-full shadow-md"
                string={project.owner}
                size={15}
              />

              <small className="text-sm text-gray-700 ">
                {truncate(project.owner, 6, 5, 15)}
              </small>
            </div>
          </div>
          <div className="flex flex-col">
            <small className="p-1 font-semibold text-gray-500">
              {expired ? "Expired" : daysRemaining(project.expiresAt) + " left"}
            </small>
          </div>
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className="bg-green-600 text-xs font-medium text-green-100 text-center p-0.5 leading-none rounded-s-full"
              style={{ width: `${(project.raised / project.target) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between">
            <small className="flex font-medium">
              {project.raised} ETH Raised
            </small>
            <small className="flex font-bold">
              {" "}
              <FaEthereum className="mt-1" /> {project.target} ETH{" "}
            </small>
          </div>
          <div className="flex flex-wrap items-center justify-between mt-3 mb-2 ">
            <small className="font-semibold text-gray-400">
              {" "}
              {project.backers} Backer{project.backers <= 1 ? "" : "s"}
            </small>
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
        </div>
      </Link>
    </div>
  ) : null;
};
export default Projects;
