import "./App.css";
import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Exam from "./components/Exam";
import Notes from "./components/Notes";
import Feedback from "./components/Feedback";
import FeeHistory from "./components/FeeHistory";
import StudentResult from "./components/StudentResult";
import Timetable from "./components/Timetable";
import Support from "./components/Support";
import Grade from "./components/Grade";
import Settings from "./components/Settings";
import LeaveNote from "./components/LeaveNote";
import Attendance from "./components/Attendance";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectesRoute"; 
import EditProfile from "./components/EditProfile";
import Profile from "./components/Profile";
import Courses from "./components/Courses";

const router = createBrowserRouter([
  { path: "/login", element: <Login /> }, 
  { path: "/", element: <ProtectedRoute><Navbar /></ProtectedRoute> },
  { path: "/exam", element: <ProtectedRoute><Exam /></ProtectedRoute> },
  { path: "/notes", element: <ProtectedRoute><Notes /></ProtectedRoute> },
  { path: "/feedback", element: <ProtectedRoute><Feedback /></ProtectedRoute> },
  { path: "/attend", element: <ProtectedRoute><Attendance /></ProtectedRoute> },
  { path: "/fee-history", element: <ProtectedRoute><FeeHistory /></ProtectedRoute> },
  { path: "/result", element: <ProtectedRoute><StudentResult /></ProtectedRoute> },
  { path: "/timetable", element: <ProtectedRoute><Timetable /></ProtectedRoute> },
  { path: "/support", element: <ProtectedRoute><Support /></ProtectedRoute> },
  { path: "/settings", element: <ProtectedRoute><Settings /></ProtectedRoute> },
  { path: "/leave", element: <ProtectedRoute><LeaveNote /></ProtectedRoute> },
  { path: "/grade", element: <ProtectedRoute><Grade /></ProtectedRoute> },
  { path: "/profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
  { path: "/edit", element: <ProtectedRoute><EditProfile /></ProtectedRoute> },
  { path: "/course", element: <ProtectedRoute><Courses /></ProtectedRoute> },
]);

function App() {
  useEffect(() => {
    let deferredPrompt;

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const installButton = document.getElementById("installBtn");
      if (installButton) {
        installButton.style.display = "block";

        installButton.addEventListener("click", () => {
          installButton.style.display = "none";
          deferredPrompt.prompt();

          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the install prompt");
            } else {
              console.log("User dismissed the install prompt");
            }
            deferredPrompt = null;
          });
        });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Service Worker Update Logic
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
        registration.onupdatefound = () => {
          const newSW = registration.installing;
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              const updateBtn = document.createElement('button');
              updateBtn.textContent = 'Update Available – Tap to Refresh';
              updateBtn.onclick = () => {
                newSW.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              };
              document.body.append(updateBtn);
            }
          });
        };
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <>
      <button
        id="installBtn"
        style={{
          display: "none",
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "10px 20px",
          borderRadius: "8px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Install App
      </button>

      <RouterProvider router={router} />
    </>
  );
}

export default App;
