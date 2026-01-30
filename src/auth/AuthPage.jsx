import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/authApi";
import logo from "../assets/logo.png";

const AuthPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                const res = await login({
                    email: formData.email,
                    password: formData.password,
                });

                //localStorage.setItem("token", res.data.token);
                //localStorage.setItem("role", res.data.role);
                localStorage.setItem("userId", res.data.userId);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("name", res.data.name);

                if (res.data.role === "ADMIN") navigate("/admin");
                else if (res.data.role === "WORKER") navigate("/worker");
                else navigate("/customer");
            } else {
                await register(formData);
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <form style={styles.form} onSubmit={handleSubmit}>

                {/* LOGO */}
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Blue Collar Logo" style={styles.logo} />
                </div>

                <h2 style={styles.title}>
                    {isLogin ? "Login" : "Register"}
                </h2>

                {error && <p style={styles.error}>{error}</p>}

                {!isLogin && (
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                )}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    style={styles.input}
                />

                {!isLogin && (
                    <select name="role" onChange={handleChange} style={styles.input}>
                        <option value="CUSTOMER">Customer</option>
                        <option value="WORKER">Worker</option>
                    </select>
                )}

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
                </button>

                <p style={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
                    {isLogin
                        ? "New user? Register here"
                        : "Already have an account? Login"}
                </p>
            </form>
        </div>
    );
};

export default AuthPage;

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8",
    },
    form: {
        width: "360px",
        padding: "28px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
    },
    logoContainer: {
        display: "flex",
        justifyContent: "center",
        marginBottom: "10px",
    },
    logo: {
        width: "90px",
    },
    title: {
        textAlign: "center",
        marginBottom: "15px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "12px",
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#0d47a1",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        textAlign: "center",
    },
    toggle: {
        marginTop: "12px",
        textAlign: "center",
        cursor: "pointer",
        color: "#1976d2",
    },
};
