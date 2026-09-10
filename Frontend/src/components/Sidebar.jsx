import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Files,
    Clock3,
    Star,
    Trash2
} from "lucide-react";

const Sidebar = () => {
    return (
        <aside className="sidebar">

            <h2>CloudVault</h2>

            <nav>

                <NavLink to="/dashboard">
                    <LayoutDashboard size={20} />
                    Dashboard
                </NavLink>

                <NavLink to="/files">
                    <Files size={20} />
                    My Files
                </NavLink>

                <NavLink to="/recent">
                    <Clock3 size={20} />
                    Recent
                </NavLink>

                <NavLink to="/favorites">
                    <Star size={20} />
                    Favorites
                </NavLink>

                <NavLink to="/trash">
                    <Trash2 size={20} />
                    Trash
                </NavLink>

            </nav>

        </aside>
    );
};

export default Sidebar;