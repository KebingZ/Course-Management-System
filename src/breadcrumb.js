/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb } from "antd";
import { user } from "./App";
import { Link } from "react-router-dom";
import { manager } from "./Routes";

const search = (path, data, breadcrumbPath, breadcrumb) => {
  if (path === null) {
    return [["Overview"], [""]];
  }
  if (!isNaN(parseInt(path)) && !data.key) {
    breadcrumb.push(path);
    breadcrumbPath.push(path);

    return [breadcrumb, breadcrumbPath];
  }
  if (data.path === path) {
    breadcrumb.push(data.key);
    breadcrumbPath.push(data.path);
    return [breadcrumb, breadcrumbPath];
  }
  if (data?.children) {
    breadcrumb.push(data.key);
    breadcrumbPath.push(data.path);
    return search(path, data.children, breadcrumb, breadcrumbPath);
  }

  if (data.length > 2) {
    for (var i = 0; i < data.length; i++) {
      if (search(path, data[i], breadcrumb, breadcrumbPath))
        return search(path, data[i], breadcrumb, breadcrumbPath);
    }
  }
};

const deepSearchRoutes = (path, data) => {
  let breadData;
  for (var i = 0; i < data.length; i++) {
    let breadcrumb = [];
    let breadcrumbPath = [];
    const result = search(path, data[i], breadcrumb, breadcrumbPath);
    if (result?.length === 2) {
      breadData = result;
      return breadData;
    }
  }
};

export const BreadcrumbForManager = () => {
  let pathname = window.location.pathname;
  const currentPath = pathname.toString().split(`${user.role}/`)[1];
  const path = currentPath
    ? currentPath.includes("/") && currentPath[currentPath.length - 1] !== "/"
      ? currentPath.substring(currentPath.lastIndexOf("/") + 1)
      : currentPath?.substring(0, currentPath.length - 1)
    : null;

  const data = deepSearchRoutes(path, manager.children);
  let bread = [];
  let pathTracker = "";

  if (data && data[0]) {
    for (var i = 0; i < data[0]?.length; i++) {
      data[0] = Array.from(new Set(data[0]));
      data[1] = Array.from(new Set(data[1]));
      pathTracker += i === data[0].length - 1 ? data[1][i] : data[1][i] + "/";
      bread.push(
        <Breadcrumb.Item key={data[0][i]}>
          <Link to={pathTracker}>{data[0][i]}</Link>
        </Breadcrumb.Item>
      );
    }
  }
  return (
    <Breadcrumb
      style={{ padding: "5px", marginLeft: "10px", marginTop: "10px" }}
    >
      <Breadcrumb.Item>
        <a href={`/dashboard/${user.role}`}>
          CMS {user.role.toUpperCase()} SYSTEM
        </a>
      </Breadcrumb.Item>
      {bread !== [] ? (
        bread.map((item) => item)
      ) : (
        <Breadcrumb.Item key="Overview">Overview</Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};
