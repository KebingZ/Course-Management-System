/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  InfoCircleOutlined,
  LogoutOutlined
} from "@ant-design/icons";
import { Dropdown, Layout, Menu, Popover, notification, Badge } from "antd";
import React, { useEffect, useState } from "react";
import { createBrowserHistory } from "history";
import { Outlet } from "react-router-dom";
import { get, post } from "../apiService";
import { BreadcrumbForAll } from "../breadcrumb";
import styled from "styled-components";
import SidebarGenerator, { getActiveKey } from "./sidebar";
import MessageDropdown from "./messageDropdown";
import messageSSE from "./messageSSE";
import { useMessage } from "../reducer";
import { user } from "../App";

const { Header, Sider, Content } = Layout;

const LayoutSider = styled(Sider)`
  top: 0;
  left: 0;
  padding: 0;
  overflow-y: auto;
  position: sticky;
  height: 100vh;
`;

const LayoutHeader = styled(Header)`
  padding: 0;
  position: sticky;
  top: 0;
  background-color: #001529;
  z-index: 1;
`;
const LayoutContent = styled(Content)`
  margin: 24px 16px;
  padding: 24px;
  min-height: 280px;
  height: 100%;
`;

const Logo = styled.h3`
  margin-top: 5px;
  margin-bottom: 15px;
  color: white;
  height: 40px;
  text-align: center;
  font-size: 35px;
  font-family: monospace;
  text-shadow: 5px 1px 5px;
  transform: rotateX(45deg);
`;

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

const LayoutPage = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const MenuFolder = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
  let pathname = window.location.pathname;
  const path = pathname.split(`${user.role}/`)[1]
    ? pathname.split(`${user.role}/`)[1]
    : null;
  const selectedKeys = getActiveKey(path, props?.roleTree)[0];
  const openKeys = getActiveKey(path, props?.roleTree)[1];
  const evtSource = messageSSE();
  const { msgStore, dispatch } = useMessage();

  useEffect(() => {
    get("message/statistics").then((response) => {
      dispatch({
        type: "RESET",
      });
      dispatch({
        type: "INC",
        payload: {
          type: "message",
          count: response.data.receive.message.unread,
        },
      });
      dispatch({
        type: "INC",
        payload: {
          type: "notification",
          count: response.data.receive.notification.unread,
        },
      });
    });
  }, [dispatch]);
  useEffect(() => {
    evtSource.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data?.type === "message") {
        const args = {
          message: `You have a message from ${data?.content.from.nickname}`,
          description: <b>{data?.content.content}</b>,
          duration: 4,
          icon: <InfoCircleOutlined style={{ color: "#108ee9" }} />,
        };

        notification.open({
          ...args,
          style: {
            zIndex: 999,
          },
        });
        console.log(data);
        dispatch({
          type: "INC",
          payload: { type: data?.content?.type, count: 1 },
        });
      }
    });
    return () => {
      evtSource.close();
    };
  }, [evtSource, dispatch]);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <LayoutSider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Logo>cms</Logo>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[""]}
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys ? openKeys : null}
        >
          {props?.roleTree?.map((item) => SidebarGenerator(item))}
        </Menu>
      </LayoutSider>
      <Layout className="site-layout">
        <LayoutHeader className="site-layout-background" style={{zIndex: 99}}>
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
          <Popover content={<a onClick={handleLogout}>{<LogoutOutlined style={{marginRight: "10px"}}/>}Logout</a>}>
            <UserOutlined
              style={{
                backgroundColor: "grey",
                color: "white",
                fontSize: "20px",
                padding: "5px",
                float: "right",
                marginRight: "100px",
                borderRadius: "50%",
                marginTop: "15px",
              }}
            />
          </Popover>
          <div style={{ float: "right", marginRight: "50px" }}>
            <Badge size="small" count={msgStore?.total} offset={[10, 0]}>
              <Dropdown
                overlay={<MessageDropdown />}
                overlayStyle={{
                  width: "20%",
                  height: "auto",
                  position: "fixed",
                  backgroundColor: "white",
                  color: "!important",
                  borderRadius: "5px",
                  margin: "10px",
                }}
                trigger={["click"]}
              >
                <BellOutlined
                  style={{
                    color: "white",
                    fontSize: "20px",
                  }}
                />
              </Dropdown>
            </Badge>
          </div>
        </LayoutHeader>
        <BreadcrumbForAll />
        <LayoutContent className="site-layout-background">
          <Outlet />
        </LayoutContent>
      </Layout>
    </Layout>
  );
};

export default LayoutPage;
