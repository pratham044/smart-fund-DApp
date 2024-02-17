import React from "react";
import { useParams } from "react-router-dom";
import ProjectDetails from "./ProjectDetails";
import ProjectBackers from "./ProjectBackers";
import UpdateProject from "./UpdateProject";
import BackProject from "./BackProject";
import DeleteProject from "./DeleteProject";
import { useGlobalState } from "../store";
import { loadProject, getBackers } from "../services/blockchain";
import { useEffect, useState } from "react";

const Project = () => {
  const { id } = useParams();

  const [project] = useGlobalState("project");
  const [backers] = useGlobalState("backers");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      await loadProject(id);
      await getBackers(id);
      setLoaded(true);
    }
    fetchData();
  }, [id]);

  return loaded ? (
    <div>
      <ProjectDetails project={project} />
      <ProjectBackers backers={backers} />
      <UpdateProject project={project} />
      <BackProject project={project} />
      <DeleteProject project={project} />
    </div>
  ) : null;
};

export default Project;
