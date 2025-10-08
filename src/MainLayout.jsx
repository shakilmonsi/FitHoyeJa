import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./layouts/Footer";
import Header from "./layouts/Header";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect, useState } from "react";
// import MobailFooter from "./layouts/MobailFooter";
import SideBar from "./pages/SideBar";
import MobailHeader from "./layouts/MobailHeader";
import SearchPageHeader from "./pages/searchPage/SearchPageHeader";

function MainLayout() {
  const location = useLocation();
  const [width, setWidth] = useState(window.innerWidth);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const isMobile = width <= 768; // mobile check

  const noHeaderPaths = ["/chats"];

  return (
    <>
      <ScrollToTop />
      <header className="sticky top-0 left-0 z-30 w-full">
        {location.pathname === "/search" ? (
          <SearchPageHeader />
        ) : (
          !noHeaderPaths.includes(location.pathname) && (
            <>
              {isMobile ? (
                // Mobile Header
                <MobailHeader
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                />
              ) : (
                // Desktop Header
                <Header
                  toggleSidebar={toggleSidebar}
                  sidebarOpen={sidebarOpen}
                />
              )}
            </>
          )
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
        {/* {isMobile &&
          !sidebarOpen &&
          location.pathname !== "/search" &&
          location.pathname !== "/" && (
            <MobailFooter toggleSidebar={toggleSidebar} />
          )} */}
      </footer>
      <SideBar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

export default MainLayout;
