import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../css/Login.css';
import { UserContext } from '../../context/userContext'
import { useContext } from 'react'

function Login() {
    const { setUser } = useContext(UserContext);  // Get setUser from context
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const loginUser = async (e) => {
        e.preventDefault();
        const { email, password } = data;

        console.log("🚀 Sending login request...");

        try {
            const response = await axios.post(
                "http://localhost:8000/api/auth/login",
                { email, password },
                { withCredentials: true } // Ensures cookies are sent
            );

            console.log("✅ Response received:", response.data);

            if (response.data.error) {
                toast.error(response.data.error);
            } else {
                console.log("🎉 Login successful, updating context...");
                setUser(response.data.user);  // ✅ Update UserContext
                setData({ email: "", password: "" });
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("❌ Login error:", error.response?.data || error.message);
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={loginUser} className="login-form">
                <label>Email</label>
                <input type="email" placeholder='Email' value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                <label>Password</label>
                <input type="password" placeholder='Password' value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}

export default Login;
