import React from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import SubMenu from "antd/lib/menu/SubMenu";
import {
  DeploymentUnitOutlined,
  DashboardOutlined,
  SolutionOutlined,
  ReadOutlined,
  MessageOutlined,
  TeamOutlined,
  ProjectOutlined,
  FileAddOutlined,
  EditOutlined,
} from "@ant-design/icons";

const iconList = {
  Overview: <DashboardOutlined />,
  Student: <SolutionOutlined />,
  "Student List": <TeamOutlined />,
  Teacher: <DeploymentUnitOutlined />,
  "Teacher List": <TeamOutlined />,
  Course: <ReadOutlined />,
  "All Courses": <ProjectOutlined />,
  "Add Course": <FileAddOutlined />,
  "Edit Course": <EditOutlined />,
  Message: <MessageOutlined />,
};

export const searchKeys = (path, data, keys) => {
  for (let i = 0; i < data.length; i++) {
    if (data[i].path === path[0]) {
      keys.push(data[i].key);
      path = path.slice(1)
      if (data[i]?.children && path.length!==0) {
        return searchKeys(path, data[i].children, keys);
      }
      return keys;
    }
  }
};

export const getActiveKey = (path, routes) => {
  if (path === null) {
    return [[""], null];
  }
  if (path.includes("/")) {
    const keys = path.split("/");
    const openKeys = searchKeys(keys.slice(0, keys.length - 1), routes, [])
    if (
      keys[keys.length - 1] !== "" &&
      isNaN(parseInt(keys[keys.length - 1])) === true
    ) {
      const selectedKeys = keys[keys.length - 1];
      return [[selectedKeys], openKeys];
    }
    const selectedKeys = keys[keys.length - 2];
    return [[selectedKeys], openKeys];
  }
  return [[path], null]
};

const SidebarGenerator = (element, parent = null) => {
  if (element?.key) {
    if (!element?.children) {
      const path = parent ? parent?.path + "/" + element?.path : element?.path;
      const key = () => {
        if (path.includes("/")) {
          if (path.split("/")[1]) {
            return path.split("/")[1];
          }
          return path.split("/")[0];
        }
        return path;
      };
      return (
        <Menu.Item key={key()} icon={iconList[element?.key]}>
          <Link to={path}>{element?.key}</Link>
        </Menu.Item>
      );
    }
    return (
      <SubMenu
        key={element?.key}
        icon={iconList[element?.key]}
        title={element?.key}
      >
        {element?.children.map((item) => SidebarGenerator(item, element))}
      </SubMenu>
    );
  }
};

export default SidebarGenerator;
