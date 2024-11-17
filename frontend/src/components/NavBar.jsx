import { useTheme } from "@mui/material";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const theme = useTheme();
  const background = theme.palette.background.default;

  const links = [
    { id: 0, label: "Home", to: "/home" },
    { id: 1, label: "Summaries", to: "/summaries" },
    { id: 2, label: "Settings", to: "/settings" },
  ];
  return (
    <div className="flex items-center justify-center">
      <nav
        className="flex items-center justify-center w-[85%] h-12 mt-3 rounded-full shadow-md"
        style={{ backgroundColor: background }}
      >
        <div className="flex flex-1 justify-around m-2">
          {links.map((link) => (
            <NavLink
              to={link.to}
              key={link.id}
              className="flex-1 text-center transition-colors rounded-full p-2"
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? theme.palette.primary.main
                  : hoveredIndex === link.id
                  ? theme.palette.primary.main
                  : "transparent",
                color: theme.palette.text.primary,
                fontWeight: isActive ? "bold" : "normal",
              })}
              onMouseEnter={() => setHoveredIndex(link.id)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
export default NavBar;
