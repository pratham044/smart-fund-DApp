import React, { useEffect } from "react";
import Hero from "./Hero";
import Projects from "./Projects";
import CreateProject from "./CreateProject";
import { loadProjects } from "../services/blockchain";
import { useGlobalState } from "../store";

const Home = () => {
  const [projects] = useGlobalState("projects");

  useEffect(() => {
    async function fetchData() {
      await loadProjects();
    }
    fetchData();
  }, []);

  return (
    <div>
      <Hero />
      <Projects projects={projects} />
      <CreateProject />
    </div>
  );
};

export default Home;
