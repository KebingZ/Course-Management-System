import React from "react";
import { Button, Col, Row } from "antd";
import { post } from "../apiService";

export default function Dashboard() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  console.log(user);

  const handleLogout = () => {
    post(
        "logout",
        {},
      )
      .then(() => {
        window.localStorage.clear();
        window.location.reload();
      })
  };
  return (
    <>
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
