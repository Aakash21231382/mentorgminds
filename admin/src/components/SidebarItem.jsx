import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

const SidebarItem = ({ item, onLinkClick }) => {
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  const isChildActive = hasChildren
    ? item.children.some((child) => location.pathname === child.path)
    : false;

  const [isOpen, setIsOpen] = useState(isChildActive);

  /* ================================
     NORMAL MENU ITEM
  ================================= */
  if (!hasChildren) {
    const Icon = item.icon;

    return (
      <li className="sidebar-menu-item">
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
          onClick={onLinkClick}
        >
          {Icon && (
            <span className="sidebar-icon">
              <Icon />
            </span>
          )}
          <span className="sidebar-title">{item.title}</span>
        </NavLink>
      </li>
    );
  }

  /* ================================
     DROPDOWN MENU
  ================================= */
  const Icon = item.icon;

  return (
    <li className={`sidebar-menu-item ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className={`sidebar-link sidebar-dropdown-button ${isChildActive ? "active" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {Icon && (
          <span className="sidebar-icon">
            <Icon />
          </span>
        )}
        <span className="sidebar-title">{item.title}</span>
        <span className={`sidebar-arrow ${isOpen ? "rotate" : ""}`}>
          <FaChevronDown />
        </span>
      </button>

      <ul className={`sidebar-submenu ${isOpen ? "show" : ""}`}>
        {item.children.map((child, index) => {
          const SubIcon = child.icon;
          return (
            <li className="sidebar-submenu-item" key={index}>
              <NavLink
                to={child.path}
                className={({ isActive }) =>
                  `sidebar-submenu-link ${isActive ? "active" : ""}`
                }
                onClick={onLinkClick}
              >
                {SubIcon ? (
                  <span className="submenu-icon">
                    <SubIcon />
                  </span>
                ) : (
                  <span className="submenu-dot"></span>
                )}
                <span>{child.title}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </li>
  );
};

export default SidebarItem;
