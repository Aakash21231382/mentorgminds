import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";

const Breadcrumb = () => {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((item) => item);

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link to="/admin/dashboard" className="breadcrumb-home">
        <FaHome />
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");

        const isLast = index === pathnames.length - 1;

        const formattedName = name
          .replace(/-/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase());

        return (
          <React.Fragment key={routeTo}>
            <span className="breadcrumb-separator">
              <FaChevronRight />
            </span>

            {isLast ? (
              <span className="breadcrumb-current">
                {formattedName}
              </span>
            ) : (
              <Link to={routeTo} className="breadcrumb-link">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;