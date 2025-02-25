import "./App.css";
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
import BatchTiming from "./components/BatchTiming";

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
  { path: "/batchtiming", element: <ProtectedRoute><BatchTiming /></ProtectedRoute> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
