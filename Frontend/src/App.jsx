import { Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import CourseDetails from "./components/CourseDetails";
import ProfileManagement from "./components/ProfileManagement";
import PrivateRoute from "./components/routing/PrivateRoute";
import CertificatePage from "./components/CertificatePage";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

import NotFound from "./components/NotFound";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/course/:id" 
                element={
                  <PrivateRoute>
                    <CourseDetails />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <ProfileManagement />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/certificate/:courseId" 
                element={
                  <PrivateRoute>
                    <CertificatePage />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
