import React from "react";
import { Button, Col, Row, Layout, Menu } from "antd";
import axios from "axios";
import { createBrowserHistory } from "history";
import styled from "styled-components";

export default function Dashboard() {
  const user = JSON.parse(window.localStorage.getItem("user"));

  const logoutURL = "http://cms.chtoma.com/api/logout";

  const { Header, Content, Sider } = Layout;

  const items1 = ["COURSES", "EVENTS", "STUDENTS", "TEACHERS"].map((key) => ({
    key,
    label: `${key}`,
  }));

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    window.location.reload();

    // axios
    //   .post(logoutURL)
    //   .then((response) => {
    //     console.log(response.data)
    //   })
    //   .then(() => {
    //     let history = createBrowserHistory();
    //     history.push({
    //       pathname: "http://localhost:3000/",
    //     });
    //     history.go();

    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });
  };
  return (
    <>
      <Layout>
        <Header className="header">
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" items={items1} />
        </Header>
      </Layout>
      <Row type="flex" justify="center" style={{ minHeight: "100vh" }}>
        <Col md={8} sm={24}>
          <h2 style={{ marginTop: 200 }}>Welcome {user.role}!</h2>
          <Button onClick={handleLogout} type="primary">
            Logout
          </Button>
        </Col>
      </Row>
    </>
  );
}
