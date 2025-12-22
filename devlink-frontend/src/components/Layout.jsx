// Layout.jsx
import { Outlet } from "react-router-dom"; 

export default function Layout() {
  return (
    <main className="p-6">
      <Outlet />
    </main>
  );
}
