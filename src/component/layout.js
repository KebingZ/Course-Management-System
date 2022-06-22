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
import { Layout, Menu, Popover, Breadcrumb } from "antd";
import React, { useState } from "react";
import SubMenu from "antd/lib/menu/SubMenu";
import { createBrowserHistory } from "history";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { post } from "../apiService";

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
  let pathname = window.location.pathname;
  const path = pathname.toString().split("manager/")[1]?.split("/")[0];

  const id = parseInt(
    pathname.substring(pathname.lastIndexOf("/") + 1).toString()
  );

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
          defaultSelectedKeys={"overview"}
          selectedKeys={path ? path : "overview"}
          defaultOpenKeys={path ? path : null}
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
              key: "trigger",
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
        <Breadcrumb
          style={{ padding: "5px", marginLeft: "10px", marginTop: "10px" }}
        >
          <Breadcrumb.Item>
            <a href="/dashboard/manager">CMS MANAGER SYSTEM</a>
          </Breadcrumb.Item>
          {path ? (
            <Breadcrumb.Item>
              <a href={`/dashboard/manager/${path}`}>{path}</a>
            </Breadcrumb.Item>
          ) : null}
          {id ? (
            <Breadcrumb.Item>
              <a href={`/dashboard/manager/students/${id}`}>{id}</a>
            </Breadcrumb.Item>
          ) : null}
        </Breadcrumb>
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
