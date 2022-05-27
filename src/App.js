import "./App.css";
import Login from "./component/login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Dashboard from "./component/dashboard";

function App() {
  function PrivateRoute({ children }) {
    return window.localStorage.getItem("user") !== null ? (
      children
    ) : (
      <Navigate to="/" />
    );
  }
  console.log(window.localStorage.getItem("user"));
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
