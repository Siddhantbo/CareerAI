import React, { useState } from "react";
import Sidebar from "../component/Sidebar";
import { Outlet, useLocation  } from "react-router-dom";
import Navbar from "../component/Navbar";

const Main = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation(); 

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const isEditProfilePage = location.pathname.includes("edit-profile") || location.pathname.includes("update-profile");;

  return (
    <>
      {/* Main Flex Container */}
      <div className="flex capitalize">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="flex-1 flex flex-col w-full">
          <div className="shadow-md bg-white z-[99] sticky top-0 w-full flex items-center px-5">
            <button
              onClick={toggleSidebar}
              className="lg:hidden bg-[#e5f2ea] hover:bg-[#d9ece1] text-gray-700 px-4 py-2 pt-3 rounded-md"
            >
              {isSidebarOpen ? (
                "Close"
              ) : (
                <img
                  src="/assets/open.png"
                  alt="Open Sidebar"
                  className="w-5 h-5"
                />
              )}
            </button>
            <Navbar />
          </div>
          <div className={`lg:ml-[280px] ${!isEditProfilePage ? "p-5" : "p-0"}`}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
