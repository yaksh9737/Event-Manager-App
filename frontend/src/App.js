import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import EventDetails from "./pages/EventDetails"; // Import the EventDetails component
import MyEvents from "./pages/MyEvents";
import Header from "./components/Header";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          {/* Public Route: HomePage is accessible to everyone */}
          <Route path="/" element={<HomePage />} />

          {/* Public Routes (Login/Register) - Only visible to non-logged-in users */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute> 
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes: Only accessible to logged-in users */}
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <h1>Protected Content: Only visible to logged-in users!</h1>
              </ProtectedRoute>
            }
          />

          {/* Routes for creating and viewing user's events */}
          <Route
            path="/create-event"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />

          {/* Route for editing an event */}
          <Route
            path="/edit-event/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          {/* New Route for viewing event details */}
          <Route path="/event/:id" element={<EventDetails />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
