//this is basically the file where you define the react frontend routes, basically which component the react will show when you visit a certain url.

import { Routes, Route } from "react-router-dom"; 
import Layout from "./components/Layout";
import Signup from "./pages/auth/signup";
import Profile from "./pages/profile/Profile";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard";
import Navbar from "./components/Navbar";
import Posts from "./pages/Post/Posts";
import Teams from "./pages/Teams/teams";
import CreateTeam from "./pages/Teams/CreateTeam";
import TeamDetails from "./pages/Teams/TeamDetails";


function App() {
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-[#0d1117] text-black dark:text-[#e6edf3]">
        <Navbar />

        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Layout />}>
            <Route path="signup" element={<Signup />} />
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            {/* default home page */}
            <Route
              index
              element={<h1 className="text-center text-2xl">Welcome to DevLink 🚀</h1>}
            />
          </Route>
          <Route path="/posts" element={<Posts />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/teams/new" element={<CreateTeam />} />
          <Route path="/teams/:slug" element={<TeamDetails />} />

        </Routes>
      </div>
    </>
  );
}

export default App;
