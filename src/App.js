import "./App.css";
import Login from "./component/login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./component/dashboard";
import LayoutPage from "./component/layout";
import StudentList from "./component/studentList";

const user =
  window.localStorage.getItem("user") !== null
    ? JSON.parse(window.localStorage.getItem("user"))
    : null;

function App() {
  function PrivateRoute({ children }) {
    return window.localStorage.getItem("user") !== null ? (
      children
    ) : (
      <Navigate to="/" />
    );
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path={user ? `/dashboard/${user.role}` : "/"}
          element={
            <PrivateRoute>
              <LayoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path={user ? `/dashboard/${user.role}/students` : "/"}
          element={
            <PrivateRoute>
              <StudentList />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
