import React from "react";
import { Card, Divider, Col, Row, Button } from "antd";
import { UserOutlined, HeartFilled } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const timeUnit = {
  1: "years",
  2: "months",
  3: "days",
};
const CourseCard = (props) => (
  <Card
    style={{
      width: 360,
      margin: "10px",
    }}
    cover={
      <img
        alt="Course"
        src={props.data?.cover}
        style={{ width: "100%", height: "200px" }}
      />
    }
  >
    <h3>{props.data?.name}</h3>
    <Row>
      <Col span={12}>{props.data?.startTime}</Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <HeartFilled style={{ color: "red" }} /> <b>{props.data?.star}</b>
      </Col>
      <Divider />
      <Col span={12}>Duration:</Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <b>
          {props.data?.duration}{" "}
          {props.data?.duration === 1
            ? timeUnit[props.data?.durationUnit]?.substring(
                0,
                timeUnit[props.data?.durationUnit]?.length - 1
              )
            : timeUnit[props.data?.durationUnit]}
        </b>
      </Col>
      <Divider />
      <Col span={12}>Teacher:</Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <b>
          <a href={`/dashboard/manager/teachers/${props.data?.teacherId}`}>{props.data?.teacherName}</a>
        </b>
      </Col>
      <Divider />
      <Col span={12}>
        <UserOutlined style={{ color: "rgb(24, 144, 255)" }} /> Student Limit:
      </Col>
      <Col span={12} style={{ textAlign: "right" }}>
        <b>{props.data?.maxStudents}</b>
      </Col>
    </Row>
    <Button type="primary" style={{ marginTop: "20px" }}>
      <Link to={`${props.data?.id}`}>Read More</Link>
    </Button>
  </Card>
);

export default CourseCard;
