/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Tag, Table, Divider, Collapse } from "antd";
import { get } from "../apiService";
import styled from "styled-components";
import { timeUnit } from "./courseCard";
import { UserOutlined, HeartFilled } from "@ant-design/icons";
import { colorArr } from "./studentDetail";

const { Panel } = Collapse;

const DetailRow = styled(Row).attrs({
  gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
})``;

const Title = styled.h2`
  margin-bottom: 30px;
  color: rgb(115, 86, 241);
`;

const Theme = styled.h3`
  margin-top: 30px;
  margin-bottom: 30px;
`;

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const processTag = [
  { text: "finished", color: "" },
  { text: "processing", color: "lime" },
  { text: "pending", color: "gold" },
];

const CourseDetailCard = () => {
  const [course, setCourse] = useState([]);
  let pathname = window.location.pathname;
  const id = pathname.substring(pathname.lastIndexOf("/") + 1).toString();

  const courseColumn = days.map((item) => ({ title: item, dataIndex: item }));
  const courseTime = { key: 1 };
  course?.schedule?.classTime?.forEach((item) => {
    courseTime[item.split(" ")[0]] = item.split(" ")[1];
  });

  const checkProcess = () => {
    if (course?.schedule?.current !== 0) {
      return course?.schedule?.chapters?.filter(
        (item) => item?.id === course?.schedule?.current
      )[0].order;
    }
  };

  const ofAbout = (
    <div>
      <Title>Course Detail</Title>

      <Theme>Create Time: </Theme>
      <p>{course?.createdAt}</p>
      <Theme>Start Time: </Theme>
      <p>{course?.startTime}</p>
      <Theme>Status: </Theme>
      <p></p>
      <Theme>Course Code: </Theme>
      <p>{course?.uid}</p>
      <Theme>Class Time: </Theme>
      <Table
        columns={courseColumn}
        dataSource={[courseTime]}
        bordered
        pagination={false}
      />
      <Theme>Category: </Theme>
      {course?.type?.map((item) => {
        const selectedColor =
          colorArr[Math.floor(Math.random() * colorArr.length)];
        return (
          <Tag key={item.id} color={selectedColor}>
            {item.name}
          </Tag>
        );
      })}
      <Theme>Description:</Theme>
      <p>{course?.detail}</p>
      <Theme>Chapter: </Theme>
      <Collapse>
        {course?.schedule?.chapters?.map((item) => {
          if (item.order < checkProcess()) {
            return (
              <Panel
                header={item.name}
                extra={
                  <Tag key={item.id} color={processTag[0].color}>
                    {processTag[0].text}
                  </Tag>
                }
              >
                {item.content}
              </Panel>
            );
          } else if (item.order === checkProcess()) {
            return (
              <Panel
                header={item.name}
                extra={
                  <Tag key={item.id} color={processTag[1].color}>
                    {processTag[1].text}
                  </Tag>
                }
              >
                {item.content}
              </Panel>
            );
          } else {
            return (
              <Panel
                header={item.name}
                extra={
                  <Tag key={item.id} color={processTag[2].color}>
                    {processTag[2].text}
                  </Tag>
                }
              >
                {item.content}
              </Panel>
            );
          }
        })}
      </Collapse>
    </div>
  );

  useEffect(() => {
    get(`courses/detail?id=${id}`).then((response) => {
      setCourse(response.data);
    });
  }, [id]);

  return (
    <DetailRow>
      <Col className="gutter-row" span={8}>
        <Card
          style={{
            width: "100%",
            margin: "10px",
          }}
          cover={
            <img
              alt="Course Image"
              src={course?.cover}
              style={{ width: "100%", height: "200px" }}
            />
          }
        >
          <h3>{course?.name}</h3>
          <Row>
            <Col span={12}>{course?.startTime}</Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <HeartFilled style={{ color: "red" }} /> <b>{course?.star}</b>
            </Col>
            <Divider />
            <Col span={12}>Duration:</Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <b>
                {course?.duration}{" "}
                {course?.duration === 1
                  ? timeUnit[course?.durationUnit]?.substring(
                      0,
                      timeUnit[course?.durationUnit]?.length - 1
                    )
                  : timeUnit[course?.durationUnit]}
              </b>
            </Col>
            <Divider />
            <Col span={12}>Teacher:</Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <b>
                <a href="">{course?.teacherName}</a>
              </b>
            </Col>
            <Divider />
            <Col span={12}>
              <UserOutlined style={{ color: "rgb(24, 144, 255)" }} /> Student
              Limit:
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
              <b>{course?.maxStudents}</b>
            </Col>
          </Row>
        </Card>
      </Col>

      <Col className="gutter-row" span={16}>
        <Card style={{ width: "100%", margin: "10px" }}>{ofAbout}</Card>
      </Col>
    </DetailRow>
  );
};

export default CourseDetailCard;
