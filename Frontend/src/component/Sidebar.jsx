import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { adminrole, Recruiterrole, sidebarItems } from "../sidebar/sidebardata";

export default function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const [activeItem, setActiveItem] = useState(null);
  const [openSubItems, setOpenSubItems] = useState({});
  const [sidebarData, setSidebarData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSidebarData, setFilteredSidebarData] = useState([]);
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const handleItemClick = (item) => {
    const isSubMenu = item.subMenu;
    setActiveItem(item.name);

    if (isSubMenu) {
      setOpenSubItems((prev) => {
        const updatedState = { [item.name]: !prev[item.name] };
        return updatedState;
      });
    } else {
      setOpenSubItems({});
    }
    localStorage.setItem("activeItem", item.name);
  };

  useEffect(() => {
    const storedActiveItem = localStorage.getItem("activeItem");

    if (storedActiveItem) {
      setActiveItem(storedActiveItem);
      const sidebarItem = sidebarData.find(
        (item) => item.name === storedActiveItem
      );
      if (sidebarItem?.subMenu) {
        setOpenSubItems({ [sidebarItem.name]: true });
      }
    }

    if (location.pathname.includes("admin")) {
      setSidebarData(adminrole);
    } else if (location.pathname.includes("recruiter")) {
      setSidebarData(Recruiterrole);
    } else if (location.pathname.includes("user")) {
      setSidebarData(sidebarItems);
    }

    const currentSidebarItem = sidebarData.find((item) =>
      location.pathname.endsWith(item.path)
    );
    if (currentSidebarItem) {
      handleItemClick(currentSidebarItem);
    }
  }, [location.pathname, sidebarData]);

  // Filter sidebar data
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredSidebarData(sidebarData);
    } else {
      const filteredData = sidebarData
        .map((item) => {
          // Filter main item
          const matchesItem = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const filteredSubMenu = item.subMenu
            ? item.subMenu.filter((subItem) =>
              subItem.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            : [];

          return {
            ...item,
            subMenu:
              filteredSubMenu.length > 0 || matchesItem
                ? filteredSubMenu
                : undefined,
          };
        })
        .filter((item) => {
          return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.subMenu && item.subMenu.length > 0)
          );
        });

      setFilteredSidebarData(filteredData);
    }
  }, [searchTerm, sidebarData]);

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] bg-[#f4f4f4] p-4 shadow-lg border border-gray-200 lg:block z-[9999] transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 lg:hidden bg-[#005151] text-[] px-2 py-2 rounded-full shadow-md"
        >
          <img src="/assets/close.svg" className="w-[18px] h-[18px]" alt="" />
        </button>
        <div className="ml-[250px] max-sm:ml-0 max-lg:ml-0 max-md:ml-0">
          <img
            src="/assets/logo-light.png"
            className="w-56 max-sm:w-[190px] max-md:w-[200px] max-md:hidden max-sm:block"
            alt=" "
          />
        </div>
        <div className="flex flex-col items-center justify-center mb-6 mt-5">
          <div className="relative">
            <img
              src={
                currentUser?.profilePhoto?.url ||
                "https://www.cgg.gov.in/wp-content/uploads/2017/10/dummy-profile-pic-male1.jpg"
              }
              alt="Profile"
              className="w-[110px] h-[110px] rounded-full mb-3 border-2 border-gray-300 cursor-pointer"
            />

           <Link to={`/${currentUser.role}/update-profile`}>
           <img
              src='/assets/pencil.svg'
              alt=''
              className='absolute z-99 w-[25px] h-[25px] -bottom-15 top-[70px] bg-white rounded-lg'
              style={{ right: '-5px' }}
            />
           </Link>

          </div>

          <p className="text-lg font-semibold text-[#005151] capitalize">
            {currentUser?.first_Name} {currentUser?.last_Name}
          </p>
          <p className="text-sm text-gray-500 capitalize">
            {currentUser?.role}
          </p>
        </div>

        <div className="relative mb-5 w-full">
          <input
            type="text"
            placeholder="Search..."
            className="border rounded py-2 px-10 shadow-sm focus:ring focus:ring-[#4DC3AB] focus:outline-none w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src="/assets/search-Bordere.svg"
            alt="Search Icon"
            className="absolute left-2 top-3 w-6 h-5"
          />
        </div>

        {/* Sidebar Menu */}
        <nav>
          <ul>
            {filteredSidebarData.map((item) => (
              <li key={item.id}>
                <div className="relative">
                  <NavLink
                    to={item.path || "#"}
                    className={`flex items-center mb-[10px] text-sm font-medium rounded-lg p-[14px] group text-[#6c757d] ${activeItem === item.name
                      ? "bg-[#005151] text-white border"
                      : "hover:bg-[#cecece75]"
                      }`}
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="mr-[10px]">
                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={item.name}
                          className={`transition duration-300 group-hover:brightness-0 group-hover:invert ${activeItem === item.name
                            ? "filter brightness-0 invert"
                            : ""
                            }`}
                        />
                      )}
                    </div>
                    <span
                      className={`lg:inline transition duration-0 font-medium leading-[19.5px] text-[13px] ${activeItem === item.name ? "text-white" : ""
                        }`}
                    >
                      {item.name}
                    </span>
                    {item.subMenu && item.subMenu.length > 0 && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill={activeItem === item.name ? "#fff" : "#6c757d"}
                        className="w-5 h-5 ml-auto"
                      >
                        <path
                          d={
                            openSubItems[item.name]
                              ? "M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" // Down arrow (expand)
                              : "M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" // Up arrow (collapse)
                          }
                        />
                      </svg>
                    )}
                  </NavLink>
                </div>
                {item.subMenu && (
                  <ul
                    className={`rounded-lg bg-[white] overflow-hidden transition-[max-height] duration-300 ease-in-out ${openSubItems[item.name] ? "max-h-[500px]" : "max-h-0"
                      }`}
                  >
                    {item.subMenu.map((subItem) => (
                      <li
                        key={subItem.id}
                        className={`p-2 py-1 ${location.pathname.endsWith(subItem.path)
                          ? "border-black"
                          : "border-gray-300 hover:border-black"
                          }`}
                      >
                        <NavLink
                          to={subItem.path}
                          className={`flex items-center text-sm rounded-lg pt-[6px] pb-[5px] ${location.pathname.endsWith(subItem.path)
                            ? "text-black font-medium"
                            : "hover:text-[#202224] font-medium"
                            }`}
                        >
                          <span
                            className={`ml-2 transition duration-500 ${location.pathname.endsWith(subItem.path)
                              ? "text-black"
                              : "text-[#6c757d] hover:text-black"
                              }`}
                          >
                            {subItem.name}
                          </span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
