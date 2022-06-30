import React, { useEffect, useState } from "react";
import { Avatar, Card, Row, Col, Tag, Table } from "antd";
import { get } from "../apiService";
import styled from "styled-components";

const { Meta } = Card;

const Title = styled.h2`
  margin-bottom: 30px;
  color: purple;
`;
const DetailRow = styled(Row).attrs({
  gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
})``;

const StudentRow = styled(DetailRow)`
  margin: 30px;
  text-align: center;
`;
const DetailCard = () => {
  const [student, setStudent] = useState({});
  let pathname = window.location.pathname;
  const id = pathname.substring(pathname.lastIndexOf("/") + 1).toString();
  useEffect(() => {
    get(`students/${id}`).then((response) => {
      setStudent(response.data);
    });
  }, [id]);

  const tabList = [
    {
      key: "About",
      tab: "About",
    },
    {
      key: "Courses",
      tab: "Courses",
    },
  ];
  const genderList = { 1: "Male", 2: "Female" };
  const colorArr = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "cyan",
    "blue",
    "geekblue",
  ];

  const ofAbout = (
    <div>
      <Title>Information</Title>

      <DetailRow>
        <Col span={6}>
          <b>Education:</b>
        </Col>
        <Col span={6}>
          <p>{student.education}</p>
        </Col>
      </DetailRow>
      <DetailRow>
        <Col span={6}>
          <b>Area:</b>
        </Col>
        <Col span={6}>
          <p>{student.country}</p>
        </Col>
      </DetailRow>
      <DetailRow>
        <Col span={6}>
          <b>Gender:</b>
        </Col>
        <Col span={18}>
          <p>{genderList[student.gender]}</p>
        </Col>
      </DetailRow>
      <DetailRow>
        <Col span={6}>
          <b>Member Period:</b>
        </Col>
        <Col span={18}>
          <p>
            {student.memberStartAt} - {student.memberEndAt}
          </p>
        </Col>
      </DetailRow>
      <DetailRow>
        <Col span={6}>
          <b>Type:</b>
        </Col>
        <Col span={6}>
          <p>{student.type?.name}</p>
        </Col>
      </DetailRow>
      <DetailRow>
        <Col span={6}>
          <b>Create Time:</b>
        </Col>
        <Col span={6}>
          <p>{student.createdAt}</p>
        </Col>
      </DetailRow>
      <DetailRow>
        <Col span={6}>
          <b>Update Time:</b>
        </Col>
        <Col span={6}>
          <p>{student.updatedAt}</p>
        </Col>
      </DetailRow>
      <Title style={{ marginTop: "20px" }}>Interests</Title>
      {student.interest?.map((item) => {
        const selectedColor =
          colorArr[Math.floor(Math.random() * colorArr.length)];
        return (
          <Tag key={item} color={selectedColor}>
            {item}
          </Tag>
        );
      })}
      <h2 style={{ marginBottom: "20px", marginTop: "30px", color: "purple" }}>
        Description
      </h2>
      <p>{student.description}</p>
    </div>
  );

  const coursesColumns = [
    {
      title: "No.",
      dataIndex: "id",
      editable: false,
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render(type) {
        return type?.map((item) => item.name);
      },
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];
  const ofCourses = (
    <div>
      <Table
        rowClassName={() => "editable-row"}
        bordered
        rowKey="id"
        dataSource={student.courses}
        columns={coursesColumns}
      />
    </div>
  );
  const contentList = {
    About: ofAbout,
    Courses: ofCourses,
  };
  const [tabKey, setTabKey] = useState("About");

  return (
    <DetailRow>
      <Col className="gutter-row" span={8}>
        <Card
          title={
            <Meta
              avatar={
                <Avatar
                  src={student.avatar}
                  style={{ width: "150px", height: "150px" }}
                />
              }
              style={{
                display: "flex",
                justifyContent: "center",
                height: "160px",
              }}
            />
          }
        >
          <StudentRow>
            <Col className="gutter-row" span={12}>
              <b>Name</b>
              <br />
              {student.name}
            </Col>
            <Col className="gutter-row" span={12}>
              <b>Age</b>
              <br />
              {student.age}
            </Col>
          </StudentRow>
          <StudentRow>
            <Col className="gutter-row" span={12}>
              <b>Email</b>
              <br />
              {student.email}
            </Col>
            <Col className="gutter-row" span={12}>
              <b>Phone</b>
              <br />
              {student.phone}
            </Col>
          </StudentRow>
          <StudentRow>
            <Col className="gutter-row" span={24}>
              <b>Address</b>
              <br />
              {student.address}
            </Col>
          </StudentRow>
        </Card>
      </Col>

      <Col className="gutter-row" span={16}>
        <Card
          style={{ width: "100%" }}
          tabList={tabList}
          activeTabKey={tabKey}
          onTabChange={(key) => {
            setTabKey(key);
          }}
        >
          {contentList[tabKey]}
        </Card>
      </Col>
    </DetailRow>
  );
};

export default DetailCard;
