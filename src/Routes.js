import { Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login";
import LayoutPage from "./component/layout";
import StudentList from "./component/lists/studentList";
import Overview from "./pages/overview";
import Students from "./pages/students";
import CourseList from "./pages/courses";
import StudentDetailCard from "./component/studentDetail";
import CourseDetailCard from "./component/courseDetail"

export const manager = {
  path: "dashboard/manager",
  element: <LayoutPage />,
  children: [
    {
      path: "",
      key: "Overview",
      element: <Overview />,
    },
    {
      path: "students",
      key: "Student",
      element: <Students />,
      children: [
        {
          path: "",
          key: "Student List",
          element: <StudentList />,
        },
        {
          path: ":id",
          element: <StudentDetailCard />,
        },
      ],
    },
    {
      path: "teachers",
      key: "Teacher",
      children: [
        {
          path: "",
          key: "Teacher List",
        },
        {
          path: ":id",
        },
      ],
    },
    {
      path: "courses",
      key: "Course",
      children: [
        {
          path: "",
          key: "All Courses",
          element: <CourseList />
        },
        {
          path: ":id",
          element: <CourseDetailCard />
        },
        {
          path: "add-course",
          key: "Add Course",
        },
        {
          path: "edit-course",
          key: "Edit Course",
        },
      ],
    },
    {
      path: "messages",
      key: "Message",
    },
  ],
}

const getRoutes = (role) => {
  if (role==="manager") return [manager]
  else if (role==="student") return []
  else if (role==="teacher") return []
}

const RoutesTree = (user = null, role=null) => {
  function PrivateRoute({ user, redirectPath = "/login" }) {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  }

  const element = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <PrivateRoute user={user} />,
      children: getRoutes(role)
    },
  ];

  return element;
};
export default RoutesTree;
