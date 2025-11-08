import { NavLink } from "react-router-dom";
import { Ship, GitCompare, Landmark, Users } from "lucide-react";

export default function Navigation() {
  const links = [
    { path: "/", label: "Routes", icon: Ship },
    { path: "/compare", label: "Compare", icon: GitCompare },
    { path: "/banking", label: "Banking", icon: Landmark },
    { path: "/pooling", label: "Pooling", icon: Users },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Ship className="w-6 h-6" />
          <span>FuelEU Maritime</span>
        </div>
        <div className="flex gap-4">
          {links.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold"
                    : "hover:bg-white/20"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
