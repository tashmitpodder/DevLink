import { useEffect, useState } from "react";
import axios from "axios";

const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("https://devlink-ntqg.onrender.com/api/users");
        console.log("API:", res.data);
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      {/* Header */}
      <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>Users</h1>
      <p style={{ color: "#aaa", marginBottom: "20px" }}>
        View all users and their team activity.
      </p>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {users.map((user) => (
          <div
            key={user._id}
            style={{
              background: "#111",
              border: "1px solid #222",
              borderRadius: "12px",
              padding: "20px",
              transition: "0.2s",
            }}
          >
            {/* Name */}
            <h3 style={{ fontSize: "18px", fontWeight: "600" }}>
              {user.name}
            </h3>

            {/* Email */}
            <p style={{ color: "#888", fontSize: "14px" }}>
              {user.email}
            </p>

            {/* Divider */}
            <hr style={{ borderColor: "#222", margin: "15px 0" }} />

            {/* Team count */}
            <p style={{ color: "#aaa", fontSize: "14px" }}>
              👥 {user.teamCount} teams joined
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;