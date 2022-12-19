import { Button, Nav, NavItem } from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import logoimg1 from "../assets/images/logo/adminlogo.png";

const navigation = [
    {
        title: "Home",
        href: "/home",
        icon: "bi bi-house-fill",
    },
    {
        title: "About",
        href: "/about",
        icon: "bi bi-file-person-fill",
    },
    {
        title: "Product",
        href: "/product",
        icon: "bi bi-bag-dash-fill",
    },
    {
        title: "Workplace",
        href: "/workplace",
        icon: "bi bi-person-circle",
    },
    {
        title: "Contact",
        href: "/contact",
        icon: "bi bi-person-lines-fill",
    },
    {
        title: "Option",
        href: "/option",
        icon: "bi bi-people-fill",
    }
];
export const Sidebar: React.FC = () => {
    const showMobilemenu = () => {
        document.getElementById("sidebarArea").classList.toggle("showSidebar");
    };
    let location = useLocation();
    return (
        <div className="p-3">
            <div className="d-flex align-items-center">
                <img
                    src={logoimg1}
                    alt="profile"
                    width="100%"
                    height="auto"
                ></img>
                <Button
                    close
                    size="sm"
                    className="ms-auto d-lg-none"
                    onClick={() => showMobilemenu()}
                >&times;</Button>
            </div>
            <div className="pt-4 mt-2">
                <Nav vertical className="sidebarNav">
                    {navigation.map((navi, index) => (
                        <NavItem key={index} className="sidenav-bg">
                            <Link
                                to={navi.href}
                                className={
                                    location.pathname === navi.href
                                        ? "text-primary nav-link py-3"
                                        : "nav-link text-secondary py-3"
                                }
                            >
                                <i className={navi.icon}></i>
                                <span className="ms-3 d-inline-block">{navi.title}</span>
                            </Link>
                        </NavItem>
                    ))}
                </Nav>
            </div>
        </div>
    );
};