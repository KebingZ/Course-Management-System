import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DeploymentUnitOutlined,
  DashboardOutlined,
  SolutionOutlined,
  ReadOutlined,
  MessageOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Popover } from "antd";
import React, { useState } from "react";
import StudentList from "./studentList";
import SubMenu from "antd/lib/menu/SubMenu";
import axios from "axios";
import { createBrowserHistory } from "history";
import Dashboard from "./dashboard";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Link,
} from "react-router-dom";

const { Header, Sider, Content } = Layout;

const logoutURL = "http://cms.chtoma.com/api/logout";
const user = JSON.parse(window.localStorage.getItem("user"));

const handleLogout = () => {
  axios
    .post(
      logoutURL,
      {},
      {
        headers: {
          Authorization: "Bearer " + user.token,
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .then(() => {
      window.localStorage.clear();
      let history = createBrowserHistory();
      history.push({
        pathname: "/",
      });
      history.go();
    })
    .catch((error) => {
      alert(error);
    });
};

const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [page, setPage] = useState("");

  const listURL = "http://cms.chtoma.com/api/students?page=1&limit=20";
  const handleStudentList = () => {
    axios
      .get(listURL, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        response.data.data.students = response.data.data.students.map(
          (student) => {
            student.courseList = student.courses.map((course) => {
              return course.name;
            });
            delete student.courses;
            return student;
          }
        );
        response.data.data.students = response.data.data.students.map(
          (student) => {
            student.type = student.type.name;
            return student;
          }
        );
        window.localStorage.setItem(
          "students",
          JSON.stringify(response.data.data)
        );
      })
      .catch((error) => {
        alert(error);
      });
    setPage(<StudentList />);
  };
  return (
    <Layout style={{ flexDirection: "row", boxSizing: "border-box" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          flex: "none",
          padding: 0,
          overflowY: "auto",
        }}
      >
        <div className="logo" />
        <h3
          style={{
            margin: "10px",
            color: "white",
            textAlign: "center",
            fontSize: 26,
            fontFamily: "monospace",
            textShadow: "2px 1px #fff",
          }}
        >
          cms
        </h3>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["overview"]}>
          <Menu.Item key="overview" icon={<DashboardOutlined />}>
            Overview
          </Menu.Item>

          <SubMenu key="student" icon={<SolutionOutlined />} title="Student">
            <Menu.Item
              key="list"
              icon={<TeamOutlined />}
              onClick={handleStudentList}
            >
              <Link to={`/dashboard/${user.role}/students`}>Student List</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="teacher" icon={<DeploymentUnitOutlined />}>
            Teacher
          </Menu.Item>
          <Menu.Item key="course" icon={<ReadOutlined />}>
            Course
          </Menu.Item>
          <Menu.Item key="message" icon={<MessageOutlined />}>
            Message
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: 0,
            position: "sticky",
            top: 0,
            backgroundColor: "#001529",
            zIndex: 1,
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: {
                color: "white",
              },
            }
          )}
          <Popover content={<a onClick={handleLogout}>Logout</a>}>
            <UserOutlined
              style={{
                backgroundColor: "grey",
                color: "white",
                fontSize: "20px",
                float: "right",
                marginRight: "100px",
                marginTop: "20px",
              }}
            />
          </Popover>
          <BellOutlined
            style={{
              color: "white",
              fontSize: "20px",
              float: "right",
              marginRight: "50px",
              marginTop: "20px",
            }}
          />
        </Header>

        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            height: "100%",
          }}
        >
          {page}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
