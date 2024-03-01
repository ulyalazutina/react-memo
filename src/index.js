import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ModeProvider } from "./context/ModeProvider";
import { LeadersProvider } from "./context/LeadersProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <LeadersProvider>
      <ModeProvider>
        <RouterProvider router={router}></RouterProvider>
      </ModeProvider>
    </LeadersProvider>
  </React.StrictMode>,
);
