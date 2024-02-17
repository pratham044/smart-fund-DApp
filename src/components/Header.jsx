import React from "react";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { connectWallet } from "../services/blockchain";
import { truncate, useGlobalState } from "../store";

const Header = () => {
  const [connectedAccount] = useGlobalState("connectedAccount");
  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between p-5 text-gray-300 shadow-2xl bg-black/80 hover:text-gray-800">
      <a href="/" className="flex items-center justify-start text-3xl ">
        <span className="mx-3 font-semibold text-white">SmartFund</span>
        <RiMoneyDollarCircleFill size={40} className="text-white" />
      </a>
      <div className="flex items-center px-4 mx-6 font-semibold ">
        {connectedAccount ? (
          <button className="px-4 py-2 font-bold text-white transition-transform duration-300 ease-in-out transform bg-blue-500 rounded-3xl bg-gradient-to-r animate-3d-running">
            {truncate(connectedAccount, 7, 7, 18)}
          </button>
        ) : (
          <button
            className="px-4 py-2 font-bold text-white transition-transform duration-300 ease-in-out transform bg-gray-500 rounded-3xl bg-gradient-to-r animate-3d-running"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
