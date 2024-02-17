import React, { useState, useEffect } from "react";
import { setGlobalState, useGlobalState } from "../store/index";

const Hero = () => {
  const [stats] = useGlobalState("stats");
  console.log("stats : ", stats);

  const [_stats, setStats] = useState([]);

  // UseEffect : so that data get updated till it is shown on Home page
  useEffect(() => {
    const fetchstats = async () => {
      try {
        const statsArray = await stats;
        setStats(statsArray);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setStats([]);
      }
    };
    fetchstats();
  }, [stats]);

  return (
    <div className="px-20 py-24 text-center bg-opacity-80">
      <h1 className="mb-5 text-64xl md:text-2xl xl:text-6xl">
        <span className="py-10 mb-10">
          " One Block at a Time: SmartFund the Future with Blockchain"{" "}
        </span>
        <hr className="mt-5" />
      </h1>

      <div className="flex items-center justify-center gap-5 py-3">
        <button
          type="button"
          className="px-4 py-2 text-lg text-center bg-green-300 rounded-3xl hover:scale-105"
          onClick={() => setGlobalState("createModal", "scale-100")}
        >
          Create project
        </button>
        <button
          type="button"
          className="px-4 py-2 text-lg text-center bg-blue-200 hover:scale-105 rounded-3xl"
        >
          Contribute to a project
        </button>
      </div>
      <div className="flex items-center justify-center gap-2 mt-10">
        <div className="flex flex-col items-center justify-center w-full h-20 border shadow-lg rounded-xl bg-slate-200">
          <span className="text-2xl font-semibold leading-5">
            {_stats?.totalProjects}{" "}
          </span>
          <span>Projects</span>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-20 border shadow-lg rounded-xl bg-slate-200">
          <span className="text-2xl font-semibold leading-5">
            {_stats?.totalBackings}{" "}
          </span>
          <span> Backings </span>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-20 border shadow-lg rounded-xl bg-slate-200">
          <span className="text-2xl font-semibold leading-5">
            {_stats?.totalDonations} ETH
          </span>
          <span>Donated</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;
