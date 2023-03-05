import React from "react";

import Home from "/imports/page/home";



import JobsMapView from "/imports/page/jobs-map/JobsMapView";
import CompaniesView from "/imports/page/company/CompaniesView";
import ImportTasks from "/imports/page/import-tasks/ImportTasks";
import MiscInfoView from "/imports/page/MiscInfo/MiscInfoView";
import ConfigSetup from "/imports/page/config/ConfigSetup";
import IndustryFilterPage from "/imports/page/industry-filter/IndustryFilterPage";
export const routes = [
  {
    path: "/",
    element: <Home />,
    title:"Home"
  },
  {
    path: "/companies",
    element: <CompaniesView />,
    title:"Companies"
  },
  {
    path: "/IndustryFilterPage",
    element: <IndustryFilterPage />,
    title:"Industry Filter"
  },
  {
    path: "/JobsMapView",
    element: <JobsMapView />,
    title:"Jobs Map"
  },
  {
    path: "/MiscInfoView",
    element: <MiscInfoView />,
    title:"Misc Info"
  },
  {
    path: "/ImportTasks",
    element: <ImportTasks />,
    title:"Import Tasks"
  },
  {
    path: "/ConfigSetup",
    element: <ConfigSetup />,
    title:"Config Setup"
  },





]
