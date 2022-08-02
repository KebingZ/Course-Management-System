/* eslint-disable jsx-a11y/anchor-is-valid */
import { Breadcrumb } from "antd";
import { user } from "./App";
import { Link } from "react-router-dom";
import { getActiveKey, searchKeys } from "./component/sidebar";
import { getRoutes } from "./Routes";

export const BreadcrumbForAll = () => {
  let pathname = window.location.pathname;
  const path = pathname.split(`${user.role}/`)[1]
    ? pathname.split(`${user.role}/`)[1]
    : null;

  const noLinkNodes = getActiveKey(path, getRoutes(user.role))[1];

  const breadcrumbGenerator = (data) => {
    if (path === null) {
      data.push(<Breadcrumb.Item key="Overview">Overview</Breadcrumb.Item>);
      return data;
    }
    let keys = path.split("/");
    if (!isNaN(parseInt(keys[keys.length - 1]))) {
      keys = keys.slice(0, keys.length - 1);
      keys.push("");
    }
    const nodes = searchKeys(keys, getRoutes(user.role), []);
    data = nodes.map((item) => {
      if (
        noLinkNodes?.includes(item) ||
        (item === nodes[nodes.length - 1] &&
          isNaN(parseInt(path.split("/")[path.split("/").length - 1])))
      ) {
        return <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>;
      } else {
        return (
          <Breadcrumb.Item key={item}>
            <Link to={keys.slice(0, nodes.indexOf(item) + 1).join("/")}>
              {item}
            </Link>
          </Breadcrumb.Item>
        );
      }
    });
    if (!isNaN(parseInt(path.split("/")[path.split("/").length - 1]))) {
      data.push(<Breadcrumb.Item key="detail">detail</Breadcrumb.Item>);
    }
    return data;
  };

  return (
    <Breadcrumb
      style={{ padding: "5px", marginLeft: "10px", marginTop: "10px" }}
    >
      <Breadcrumb.Item>
        <a href={`/dashboard/${user.role}`}>
          CMS {user.role.toUpperCase()} SYSTEM
        </a>
      </Breadcrumb.Item>
      {breadcrumbGenerator([]).map((item) => item)}
    </Breadcrumb>
  );
};
