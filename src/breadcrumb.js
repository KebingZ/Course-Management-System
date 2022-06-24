/* eslint-disable jsx-a11y/anchor-is-valid */
import { Path } from "./breadcrumbPath";
import { Breadcrumb } from "antd";

export const BreadcrumbForManager = () => {
  let pathname = window.location.pathname;
  const id = parseInt(
    pathname.substring(pathname.lastIndexOf("/") + 1).toString()
  );

  const path = pathname.toString().split("manager/")[1]?.split("/")[0];
  return (
    <Breadcrumb
      style={{ padding: "5px", marginLeft: "10px", marginTop: "10px" }}
    >
      <Breadcrumb.Item>
        <a href="/dashboard/manager">CMS MANAGER SYSTEM</a>
      </Breadcrumb.Item>
      {path ? (
        [
          <Breadcrumb.Item key={path}>
            <a>{path.substring(0, path.length - 1)}</a>
          </Breadcrumb.Item>,
          <Breadcrumb.Item key={Path[path]}>
            <a href={`/dashboard/manager/${path}`}>{Path[path]}</a>
          </Breadcrumb.Item>,
        ]
      ) : (
        <Breadcrumb.Item>
          <a href="/dashboard/manager">Overview</a>
        </Breadcrumb.Item>
      )}
      {path && id ? (
        <Breadcrumb.Item>
          <a href={`/dashboard/manager/${path}/${id}`}>{id}</a>
        </Breadcrumb.Item>
      ) : null}
    </Breadcrumb>
  );
};
