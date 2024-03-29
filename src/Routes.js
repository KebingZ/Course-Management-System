import { Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login";
import LayoutPage from "./component/layout";
import StudentList from "./component/manager/lists/studentList";
import Overview from "./pages/overview";
import Students from "./component/manager/pages/students";
import CourseList from "./component/manager/pages/courses";
import StudentDetailCard from "./component/studentDetail";
import CourseDetailCard from "./pages/courseDetail";
import Message from "./pages/messages";
import AddCourse from "./pages/addCourse";
import EditCourse from "./pages/editCourse";
import ClassSchedule from "./component/teacher/pages/classSchedule";
import Profile from "./pages/profile";
import TeacherOverview from "./component/teacher/pages/overview";
import StudentOverview from "./component/student/pages/overview";
import { GalleryPage } from "./pages/gallery";
import { EventPage } from "./pages/event";
import { HomePage } from "./pages/home";
import MyCourse from "./component/student/pages/course";
import MyStudents from "./component/teacher/pages/students";
import MyCourseList from "./component/teacher/pages/courses";
import TeacherList from "./component/manager/lists/teacherList";

export const manager = [
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
        element: <TeacherList />,
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
        element: <CourseList />,
      },
      {
        path: ":id",
        element: <CourseDetailCard />,
      },
      {
        path: "add-course",
        key: "Add Course",
        element: <AddCourse />,
      },
      {
        path: "edit-course",
        key: "Edit Course",
        element: <EditCourse />,
      },
    ],
  },
  {
    path: "messages",
    key: "Message",
    element: <Message />,
  },
];

export const teacher = [
  {
    path: "",
    key: "Overview",
    element: <TeacherOverview />,
  },
  {
    path: "schedule",
    key: "Class Schedule",
    element: <ClassSchedule />,
  },
  {
    path: "profile",
    key: "Profile",
    element: <Profile />,
  },
  {
    path: "students",
    key: "Student",
    element: <Students />,
    children: [
      {
        path: "",
        key: "Student List",
        element: <MyStudents />,
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
        element: <MyCourseList />,
      },
      {
        path: ":id",
        element: <CourseDetailCard />,
      },
      {
        path: "add-course",
        key: "Add Course",
        element: <AddCourse />,
      },
      {
        path: "edit-course",
        key: "Edit Course",
        element: <EditCourse />,
      },
    ],
  },
  {
    path: "messages",
    key: "Message",
    element: <Message />,
  },
];

const student = [
  {
    path: "",
    key: "Overview",
    element: <StudentOverview />,
  },
  {
    path: "profile",
    key: "Profile",
    element: <Profile />,
  },
  {
    path: "courses",
    key: "Course",
    children: [
      {
        path: "",
        key: "All Courses",
        element: <CourseList />,
      },
      {
        path: ":id",
        element: <CourseDetailCard />,
      },
      {
        path: "own",
        key: "My Courses",
        element: <MyCourse />,
      },
    ],
  },
  {
    path: "schedule",
    key: "Class Schedule",
    element: <ClassSchedule />,
  },
  {
    path: "messages",
    key: "Message",
    element: <Message />,
  },
];

export const getRoutes = (role) => {
  switch (role) {
    case "manager":
      return manager;
    case "teacher":
      return teacher;
    case "student":
      return student;
    default:
  }
};

const RoutesTree = (user = null, role = null) => {
  function PrivateRoute({ user, redirectPath = "/login" }) {
    if (!user) {
      return <Navigate to={redirectPath} replace />;
    }
    return <Outlet />;
  }

  const element = [
    {
      path: "",
      element: <HomePage />,
    },
    {
      path: "/gallery",
      element: <GalleryPage />,
    },
    {
      path: "events",
      element: <EventPage />,
    },
    {
      path: "/login",
      element: <Login />,
    },

    {
      element: <PrivateRoute user={user} />,
      children: [
        {
          path: `dashboard/${role}`,
          element: <LayoutPage roleTree={getRoutes(role)} />,
          children: getRoutes(role),
        },
      ],
    },
  ];

  return element;
};
export default RoutesTree;
