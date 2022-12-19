import { lazy } from "react";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout"));

/***** Pages ****/

const Homepage = lazy(() => import("../views/Homepage"));
const Optionpage = lazy(() => import("../views/Optionpage"));
const Aboutpage = lazy(() => import("../views/Aboutpage"));
const Contactpage = lazy(() => import("../views/Conatctpage"));
const Productpage = lazy(() => import("../views/Productpage"));
const WorkplacePage = lazy(() => import("../views/WorkplacePage"));

/*****Routes******/

const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout/>,  
    children: [
        { path: "home", exact: true, element: <Homepage /> },
        { path: "option", exact: true, element: <Optionpage /> },
        { path: "about", exact: true, element: <Aboutpage /> },
        { path: "product", exact: true, element: <Productpage /> },
        { path: "workplace", exact: true, element: <WorkplacePage /> },
        { path: "contact", exact: true, element: <Contactpage /> },
      ],
  },
];

export default ThemeRoutes;
