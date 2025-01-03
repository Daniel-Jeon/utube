import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./output.css";
import { UserProvider } from "./contexts/User";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  //<React.StrictMode>
  <UserProvider>
    <App />
  </UserProvider>
  //</React.StrictMode>
);
