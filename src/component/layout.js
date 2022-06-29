/* eslint-disable jsx-a11y/anchor-is-valid */
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
import { createBrowserHistory } from "history";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { post } from "../apiService";
import { BreadcrumbForManager } from "../breadcrumb";

const { Header, Sider, Content } = Layout;

const handleLogout = () => {
  post("logout", {})
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
    });
};

const LayoutPage = () => {
  let navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const MenuFolder = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
  let pathname = window.location.pathname;
  const path = pathname.toString().split("manager/")[1]?.split("/")[0];

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
            marginTop: "5px",
            marginBottom: "15px",
            color: "white",
            height: "40px",
            textAlign: "center",
            fontSize: 35,
            fontFamily: "monospace",
            textShadow: "5px 1px 5px",
            transform: "rotateX(45deg)",
          }}
        >
          cms
        </h3>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["overview"]}
          selectedKeys={path ? [path] : "overview"}
          defaultOpenKeys={path ? [path] : null}
        >
          <Menu.Item key="overview" icon={<DashboardOutlined />}>
            <Link to="">Overview</Link>
          </Menu.Item>
          <SubMenu key="student" icon={<SolutionOutlined />} title="Student">
            <Menu.Item
              key="students"
              icon={<TeamOutlined />}
              onClick={() => {
                navigate("students");
              }}
            >
              Student List
            </Menu.Item>
          </SubMenu>
          <SubMenu key="teacher" icon={<DeploymentUnitOutlined />} title="Teacher">
            <Menu.Item
              key="teachers"
              icon={<TeamOutlined />}
              onClick={() => {
                navigate("teachers");
              }}
            >
              Teacher List
            </Menu.Item>
          </SubMenu>
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
          <MenuFolder
            className="trigger"
            key="trigger"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
            style={{
              color: "white",
            }}
          />
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
        <BreadcrumbForManager />
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
