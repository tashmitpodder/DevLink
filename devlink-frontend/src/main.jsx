import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PostsProvider } from "./store/postsContext";
import { TeamsProvider } from "./store/teamsContext";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

if (localStorage.theme === "dark") {
  document.documentElement.classList.add("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TeamsProvider>
        <PostsProvider>
          <App />
        </PostsProvider>
      </TeamsProvider>
    </BrowserRouter>
  </React.StrictMode>
);
