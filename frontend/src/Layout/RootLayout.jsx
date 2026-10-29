import React, { useEffect } from 'react';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import { Outlet, useLocation } from 'react-router-dom';

const RootLayout = () => {

    const location = useLocation();

    const hideHeaderFooterPaths = ["/login", "/signup", "/forgot-password"];
    const shouldHide = hideHeaderFooterPaths.includes(location.pathname);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (shouldHide) {
            document.body.classList.add("no-navbar");
            document.body.style.paddingTop = "0px";
        } else {
            document.body.classList.remove("no-navbar");
        }
        return () => {
            document.body.classList.remove("no-navbar");
        };
    }, [location.pathname, shouldHide]);

  return (
    /* min-vh-100 aur flex-column ensures ki page kam se kam full screen height le */
    <div className={`d-flex flex-column min-vh-100 ${shouldHide ? "no-navbar-padding" : ""}`}>
      
      {!shouldHide && <Navbar />}

      <main className="flex-grow-1">
        <Outlet />
      </main>

      {!shouldHide && <Footer />}
      
    </div>
  );
};

export default RootLayout;