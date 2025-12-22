import { useState } from "react";
import { useAuth } from "../../store/auth";   // auth context
import { apiRequest } from "../../utils/api"; // helper for API calls
import { useNavigate } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // we will call this to store token/user
  const navigate = useNavigate();

  const handleSubmit = async (e) => {// here e means event object, it is sent by the browser when an event occurs, in this case pressing the submit button ig.
    e.preventDefault(); //this preventDefault function is to precent the browser from refresing the page automatially.. keeps the SPA properyt intact

    // Call backend login API
    const data = await apiRequest("/auth/login", "POST", { email, password }); //we are using the apiRequest function which was made in the api.js file for calling the backend.

    if (data.token) {// if a valid token is returned that means login was successful
      login(data.token, data.user); // store token in context/localStorage
      navigate("/dashboard");
      alert("Login successful 🚀");
    } else {
      alert(data.message || "Login failed ❌");
    }
  };

  return ( //we write the jsx here in the form of jsx
    <div className="flex items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}
