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

  const handleStudentList = (key) => {
    // let history = createBrowserHistory();
    // history.push({
    //   pathname: `/dashboard/${user.role}/students`,
    // });
    // history.go();
    setPage(<StudentList />);
  };
  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ position: "fixed", zIndex: 1, height: "100%" }}
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
              Student List
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
            width: "100%",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
              style: {
                color: "white",
                fontSize: "20px",
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
            marginTop: "80px",
            marginBottom: "80px",
            marginRight: "50px",
            marginLeft: "240px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {page}
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
