import "./App.css";
import Login from "./component/login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import LayoutPage from "./component/layout";
import StudentList from "./component/studentList";
import DetailCard from "./component/detail";
import Overview from "./component/overview";

const user =
  window.localStorage.getItem("user") !== null
    ? JSON.parse(window.localStorage.getItem("user"))
    : null;

function App() {

  function PrivateRoute({ user, redirectPath = "/login" }) {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  }
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute user={user} />}>
          <Route path="dashboard/manager" element={<LayoutPage />}>
            <Route path="" element={<Overview />} />
            <Route path="students" element={<StudentList />} />
            <Route path="students/:id" element={<DetailCard />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
