import React from "react";
import "../assets/css/sidebar.css";
import sidebarMenu from "../config/sidebarMenu";
import SidebarItem from "./SidebarItem";
import Logo from '../assets/images/NavLogo1.png';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <aside className={`sidebar${isOpen ? " open" : ""}`}>

      {/* Logo */}
      <div className="sidebar-logo">
        <img src={Logo} alt="Admin Logo" />
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        <ul className="sidebar-menu">
          {sidebarMenu.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              onLinkClick={onClose}
            />
          ))}
        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;
