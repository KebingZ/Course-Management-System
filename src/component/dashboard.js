import React from "react";
import { Button, Col, Row, Layout, Menu, message } from "antd";
import axios from "axios";
import styled from "styled-components";

export default function Dashboard() {
  const user = JSON.parse(window.localStorage.getItem("user"));
  console.log(user);
  const logoutURL = "http://cms.chtoma.com/api/logout";

  const handleLogout = () => {
    axios
      .post(
        logoutURL,
        {},
        {
          headers: {
            Authorization: "Bearer " + user.token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
      })
      .then(() => {
        window.localStorage.clear();
        window.location.reload();
      })
      .catch((error) => {
        alert(error);
      });
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
