import Identicon from "react-identicons";
import { FaEthereum } from "react-icons/fa";
import { truncate } from "../store";
import { formatDistanceToNow } from "date-fns";

const ProjectBackers = ({ backers }) => {
  console.log("backers", backers);

  return (
    <div className="flex flex-col items-start justify-center px-1 mx-auto md:w-2/3">
      <div
        className="max-h-[calc(100vh_-_25rem)] overflow-y-auto
        shadow-md rounded-md w-full mb-10"
      >
        <table className="min-w-full rounded-lg shadow-lg ">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-lg font-semibold text-left rounded-none"
              >
                Backer
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-lg font-semibold text-left"
              >
                Donations
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-lg font-semibold text-left"
              >
                Refunded
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-lg font-semibold text-left"
              >
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {backers.map((backer, i) => (
              <Backer key={i} backer={backer} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Backer = ({ backer }) => (
  <tr className="border-b border-gray-200">
    <td className="px-6 py-4 text-sm font-light whitespace-nowrap">
      <div className="flex items-center justify-start space-x-2 text-lg">
        <Identicon
          className="object-contain w-10 h-10 rounded-full shadow-md"
          string={backer?.owner}
          size={25}
        />
        <span>{truncate(backer.owner, 7, 7, 18)}</span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm font-light whitespace-nowrap">
      <small className="flex items-center justify-start space-x-1">
        <FaEthereum size={17} />
        <span className="text-lg font-medium text-gray-700">
          {backer?.contribution} ETH
        </span>
      </small>
    </td>
    <td className="px-6 py-4 text-lg font-medium whitespace-nowrap">
      {backer?.refunded ? "Yes" : "No"}
    </td>
    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
      {formatDistanceToNow(new Date(backer?.timestamp), { addSuffix: true })}
    </td>
  </tr>
);

export default ProjectBackers;
