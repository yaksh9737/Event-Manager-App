// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load the user from local storage if there's a token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      throw new Error(error.response.data.message || "Login failed");
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await api.post("/users/register", {
        username,
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      throw new Error(error.response.data.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
