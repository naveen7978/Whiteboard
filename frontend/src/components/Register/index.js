import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./index.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration");
    }
  };

  return (
    <>
      <div className={styles.registerBackground}></div>
      <div className={styles.registerOverlay}></div>
      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.registerTitle}>Create your account</div>
          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Register</button>
          </form>
          <Link to="/login" className={styles.registerLink}>
            Already have an account? Login here
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
