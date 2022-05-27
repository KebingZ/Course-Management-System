import React from "react";
import { Button, Col, Row } from "antd";
import axios from "axios";
import { createBrowserHistory } from "history";

export default function Dashboard() {
  const user = JSON.parse(window.localStorage.getItem("user"));

  const logoutURL = "http://cms.chtoma.com/api/logout";

  const handleLogout = () => {
    window.localStorage.removeItem("user");
    window.location.reload();
    // axios
    //   .post(logoutURL)
    //   .then(() => {

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
    <div>
      <Row type="flex" justify="center" style={{ minHeight: "100vh" }}>
        <Col md={8} sm={24}>
          <h2 style={{ marginTop: 200 }}>Welcome {user.role}!</h2>
          <Button onClick={handleLogout} type="primary">
            Logout
          </Button>
        </Col>
      </Row>
    </div>
  );
}
