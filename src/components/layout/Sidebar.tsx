import React from "react";
import { Link } from "react-router-dom";
import {
  MdOutlineDashboard,
  MdOutlineAssignment,
  MdOutlineFolder,
  MdOutlinePayments,
  MdOutlinePeople,
  MdOutlineSchedule,
  MdOutlineSupportAgent,
  MdOutlineReport,
  MdOutlineAssignment as MdOutlineRequestPage,
  MdOutlineLightbulb,
  MdOutlineCalendarToday,
} from "react-icons/md";

interface SidebarProps {
  logoSrc: string;
}

const Sidebar: React.FC<SidebarProps> = ({ logoSrc }) => {
  return (
    <aside className="w-96 h-full bg-white border-r border-gray-200 overflow-y-scroll">
      <div className="flex items-center gap-x-2 p-3">
        <img className="size-16" src={logoSrc} alt="Barangay Logo" />
        <div>
          <h1 className="font-bold">Magsaysay</h1>
          <p className="text-xs text-gray-600">Digital Barangay Portal</p>
        </div>
      </div>

      <nav className="mt-2">
        <ul className="px-2">
          {/* Dashboard */}
          <li>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              <MdOutlineDashboard className="text-xl" />
              <span>Dashboard</span>
            </Link>
          </li>

          {/* My Request */}
          <li>
            <Link
              to="/request"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              <MdOutlineAssignment className="text-xl" />
              <span>My Request</span>
            </Link>
          </li>

          {/* My Documents */}
          <li>
            <Link
              to="/documents"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              <MdOutlineFolder className="text-xl" />
              <span>My Documents</span>
            </Link>
          </li>

          {/* Payments */}
          <li>
            <Link
              to="/payments"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              <MdOutlinePayments className="text-xl" />
              <span>Payments</span>
            </Link>
          </li>

          {/* Community */}
          <li>
            <Link
              to="/community"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              <MdOutlinePeople className="text-xl" />
              <span>Community</span>
            </Link>
          </li>

          {/* Appointment */}
          <li>
            <Link
              to="/appointment"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-600 hover:text-white"
            >
              <MdOutlineSchedule className="text-xl" />
              <span>Appointment</span>
            </Link>
          </li>

          {/* Helpdesk - The only one with dropdown */}
          <li>
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between p-2 rounded-lg hover:bg-blue-600 hover:text-white list-none">
                <div className="flex items-center gap-2">
                  <MdOutlineSupportAgent className="text-xl" />
                  <span>Helpdesk</span>
                </div>
                <svg
                  className="h-5 w-5 group-open:rotate-180 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>

              <ul className="pl-8 mt-1">
                <li>
                  <Link
                    to="/helpdesk/complaints"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MdOutlineReport className="text-xl" />
                    <span>Complaints</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/helpdesk/requests"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MdOutlineRequestPage className="text-xl" />
                    <span>Requests</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/helpdesk/suggestions"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MdOutlineLightbulb className="text-xl" />
                    <span>Suggestions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/helpdesk/appointments"
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                  >
                    <MdOutlineCalendarToday className="text-xl" />
                    <span>Appointments</span>
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
