import React from 'react';
import ReactDOM from "react-dom/client";
import { Meteor } from 'meteor/meteor';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import 'antd/dist/reset.css';
import {routes} from "/imports/routers";
const router = createBrowserRouter(routes);


Meteor.startup(() => {
  const ele =document.getElementById("react-target");
  // @ts-ignore
  ReactDOM.createRoot(ele).render(
    <RouterProvider router={router} />
  );
});
