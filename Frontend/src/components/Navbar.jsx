import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Search,
    Bell,
    User,
    Settings,
    LogOut,
    ChevronDown
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


const Navbar = () => {

    const navigate = useNavigate();

    const { logout } = useAuth();

    const [profileOpen, setProfileOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");


    const handleSearch = (e) => {

        e.preventDefault();

        const keyword = searchTerm.trim();

        if (!keyword) {
            navigate("/files");
            return;
        }

        navigate(
            `/files?search=${encodeURIComponent(keyword)}`
        );
    };


    const handleLogout = () => {

        logout();

        setProfileOpen(false);

        navigate("/login");
    };


    return (
        <header className="navbar">

            <form
                className="search-box"
                onSubmit={handleSearch}
            >

                <Search size={20} />

                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

            </form>


            <div className="navbar-actions">

                <button
                    type="button"
                    className="navbar-icon"
                >
                    <Bell size={20} />
                </button>


                <div className="profile-wrapper">

                    <button
                        type="button"
                        className="profile-btn"
                        onClick={() =>
                            setProfileOpen(!profileOpen)
                        }
                    >

                        <div className="profile-avatar">
                            C
                        </div>

                        <span>
                            Chief
                        </span>

                        <ChevronDown size={16} />

                    </button>


                    {profileOpen && (

                        <div className="profile-dropdown">

                            <div className="profile-info">

                                <div className="profile-avatar large">
                                    C
                                </div>

                                <div>

                                    <strong>
                                        Chief
                                    </strong>

                                    <span>
                                        CloudVault User
                                    </span>

                                </div>

                            </div>


                            <div className="profile-divider" />


                            <button type="button">

                                <User size={17} />

                                Profile

                            </button>


                            <button type="button">

                                <Settings size={17} />

                                Settings

                            </button>


                            <div className="profile-divider" />


                            <button
                                type="button"
                                className="logout-btn"
                                onClick={handleLogout}
                            >

                                <LogOut size={17} />

                                Logout

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
};


export default Navbar;