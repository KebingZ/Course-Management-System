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
import SubMenu from "antd/lib/menu/SubMenu";
import axios from "axios";
import { createBrowserHistory } from "history";
import {
  BrowserRouter as Router,
  Link,
  Outlet,
} from "react-router-dom";
import axiosInst from "../apiService";

const { Header, Sider, Content } = Layout;

const logoutURL = "http://cms.chtoma.com/api/logout";
const user = JSON.parse(window.localStorage.getItem("user"));

const handleLogout = () => {
  axiosInst
    .post(
      logoutURL,
      {},
    )
    .then((response) => {
      console.log(response.data);
    })
    .then(() => {
      window.localStorage.clear();
      let history = createBrowserHistory();
      history.push({
        pathname: "/login",
      });
      history.go();
    })
    .catch((error) => {
      alert(error);
    });
};

const LayoutPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          top: 0,
          left: 0,
          padding: 0,
          overflowY: "auto",
          position: "sticky",
          height: "100vh",
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

            >
              <Link to="students">Student List</Link>
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
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
