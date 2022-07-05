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
  Message: <MessageOutlined />
};

  const SidebarGenerator = (element, parent=null) => {
    if (element?.key) {
      if (!element?.children) {
        const path = parent ? parent?.path + "/" + element?.path : element?.path
        const key = () => {
          if (path.includes("/")) {
            if (path.split("/")[1]) {
              return path.split("/")[1]
            }
            return path.split("/")[0]
          }
          return path
        }
        return (
          <Menu.Item
                key={key()}
                icon={iconList[element?.key]}
              >
                <Link to={path}>{element?.key}</Link>
              </Menu.Item>
        )
      }
      return (
        <SubMenu key={element?.key} icon={iconList[element?.key]} title={element?.key}>{element?.children.map(item => SidebarGenerator(item, element))}</SubMenu>
      )
    }
  }

export default SidebarGenerator;
