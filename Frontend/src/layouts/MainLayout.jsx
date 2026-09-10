import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="app-layout">
            <Sidebar />

            <div className="main-content">
                <Navbar onLogout={handleLogout} />

                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;