import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import MyFiles from "../pages/MyFiles";
import Recent from "../pages/Recent";
import Favorites from "../pages/Favorites";
import Trash from "../pages/Trash";

import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Protected Application Routes */}

                <Route element={<ProtectedRoute />}>

                    <Route element={<MainLayout />}>

                        {/* Root → Dashboard */}

                        <Route
                            path="/"
                            element={
                                <Navigate
                                    to="/dashboard"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        <Route
                            path="/files"
                            element={<MyFiles />}
                        />

                        <Route
                            path="/recent"
                            element={<Recent />}
                        />

                        <Route
                            path="/favorites"
                            element={<Favorites />}
                        />

                        <Route
                            path="/trash"
                            element={<Trash />}
                        />

                    </Route>

                </Route>

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;