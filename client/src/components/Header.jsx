import React from "react";
import {
  FaVoteYea,
  FaUsers,
  FaChartPie,
  FaLandmark,
  FaSearch,
} from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import Search from "./Search";
import useMobile from "../hook/userMobile";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMoile] = useMobile();

  const navigate = useNavigate();

  const redirectToLoginPage = () => {
    navigate("/login");
  };

  return (
    <header className="hidden bg-gradient-to-r from-green-600 via-white to-orange-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo + Title */}
        <Link className="flex items-center space-x-3">
          <FaLandmark className="text-3xl text-green-800" />
          <h1 className="text-2xl font-bold text-gray-800">
            ग्राम पंचायत मतदान ऐप 🗳️
          </h1>
        </Link>

        {/* Navigation Links */}
        {/* <nav className="flex space-x-8 text-gray-800 font-semibold">
          <a
            href="#live-voting"
            className="flex items-center space-x-2 hover:text-green-700 transition"
          >
            <FaVoteYea />
            <span>Live Voting</span>
          </a>

          <a
            href="#candidates"
            className="flex items-center space-x-2 hover:text-green-700 transition"
          >
            <FaUsers />
            <span>Candidates</span>
          </a>

          <a
            href="#results"
            className="flex items-center space-x-2 hover:text-green-700 transition"
          >
            <FaChartPie />
            <span>Results</span>
          </a>

          <a
            href="#about"
            className="flex items-center space-x-2 hover:text-green-700 transition"
          >
            <FaLandmark />
            <span>Panchayat Info</span>
          </a>
        </nav> */}
        <div className="hidden">
          <Search />
        </div>

        {/* Login Button */}
        <div className="">
          <button className="text-neutral-800 lg:hidden">
            <FaRegCircleUser size={25} />
          </button>

          <div className="hidden lg:block">
            <button
              onClick={() => navigate("/login")}
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition font-medium"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      {/* <div className="container mx0">
        <Search />
      </div> */}
    </header>
  );
};

export default Header;
