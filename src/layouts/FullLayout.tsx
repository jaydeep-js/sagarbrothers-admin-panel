import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "./Sidebar";

const FullLayout = () => {
  return (
    <main>
      <div className="pageWrapper d-lg-flex">
        <aside className="sidebarArea shadow" id="sidebarArea">
          <Sidebar />
        </aside>
        <div className="contentArea">
          <Header />
          <div className="p-4 wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default FullLayout;
