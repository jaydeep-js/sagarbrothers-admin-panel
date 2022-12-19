import React from "react";
import {
  Navbar,
  Button,
} from "reactstrap";

const Header = () => {
  const showMobilemenu = () => {
    document.getElementById("sidebarArea").classList.toggle("showSidebar");
  };
  return (
    <Navbar  dark expand="md" className="bg-gradient">
      <div className="d-flex align-items-center">
        <Button
          color="primary"
          className=" d-lg-none"
          onClick={() => showMobilemenu()}
        >
          <i className="bi bi-list"></i>
        </Button>
      </div>
    </Navbar>
  );
};

export default Header;
