import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await loginUser(formData);

        console.log("Login successful:", response);

        login(response.data.token);

        navigate("/dashboard");

    } catch (error) {
        console.error("Login failed:", error);
    }
};

    return (
        <div className="login-page">
            <div className="login-card">

                <div className="login-header">
                    <h1>☁ CloudVault</h1>
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit">
                        Sign In
                    </button>

                </form>

                <div className="login-footer">
                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">
                            Register
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Login;