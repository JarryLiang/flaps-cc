import CompanyFilterManagement from "/imports/page/company-filter/CompanyFilterManagement";
import MiscTestPage from "/imports/page/misc-test/MiscTestPage";
import OpenPageHelper from "/imports/page/open-104/OpenPageHelper";
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
    path: "/companies/CompanyFilterManagement",
    element: <CompanyFilterManagement />,
    title:"管理預設過濾公司關鍵字"
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
  {
    path: "/OpenPageHelper",
    element: <OpenPageHelper />,
    title:"Open 104 helper"
  },
  {
    path: "/ForTest",
    element: <MiscTestPage />,
    title:"Misc Test"
  }
]
