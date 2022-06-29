import { get } from "../apiService";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Progress } from "antd";
import {
  SolutionOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import PieCharts from "../component/pieCharts";
import Polygon from "../component/polygon";
import ColumnChart from "../component/columnChart";
import HeatMap from "../component/heatMap";
import Map from "../component/map";

const Overview = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    get("statistics/overview").then((response) => {
      setData(response.data);
    });
  }, []);
  return (
    <>
      <div>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={8}>
            <Card bodyStyle={{ backgroundColor: "#0099ff" }} bordered={false}>
              <Row type="flex" justify="center" align="middle">
                <Col span={6}>
                  {
                    <SolutionOutlined
                      style={{
                        backgroundColor: "white",
                        fontSize: "30px",
                        padding: "30px",
                        borderRadius: "50%",
                        color: "grey",
                      }}
                    />
                  }
                </Col>
                <Col span={18}>
                  <b style={{ color: "white", fontSize: "15px" }}>
                    TOTAL STUDENTS
                  </b>
                  <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <b style={{ fontSize: "30px", color: "white" }}>
                      {data?.student?.total}
                    </b>
                  </div>
                  <Progress
                    percent={
                      100 -
                      (data?.student?.lastMonthAdded / data?.student?.total) *
                        100
                    }
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightGreen"
                  />
                  <p
                    style={{
                      fontSize: "15px",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {(
                      (data?.student?.lastMonthAdded / data?.student?.total) *
                      100
                    ).toFixed(2)}
                    % increase in 30 days
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ backgroundColor: "#6600ff" }} bordered={false}>
              <Row type="flex" justify="center" align="middle">
                <Col span={6}>
                  {
                    <DeploymentUnitOutlined
                      style={{
                        backgroundColor: "white",
                        fontSize: "30px",
                        padding: "30px",
                        borderRadius: "50%",
                        color: "grey",
                      }}
                    />
                  }
                </Col>
                <Col span={18}>
                  <b style={{ color: "white", fontSize: "15px" }}>
                    TOTAL TEACHERS
                  </b>
                  <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <b style={{ fontSize: "30px", color: "white" }}>
                      {data?.teacher?.total}
                    </b>
                  </div>
                  <Progress
                    percent={
                      100 -
                      (data?.teacher?.lastMonthAdded / data?.teacher?.total) *
                        100
                    }
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightGreen"
                  />
                  <p
                    style={{
                      fontSize: "15px",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {(
                      (data?.teacher?.lastMonthAdded / data?.teacher?.total) *
                      100
                    ).toFixed(2)}
                    % increase in 30 days
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={8}>
            <Card bodyStyle={{ backgroundColor: "#ff9933" }} bordered={false}>
              <Row type="flex" justify="center" align="middle">
                <Col span={6}>
                  {
                    <ReadOutlined
                      style={{
                        backgroundColor: "white",
                        fontSize: "30px",
                        padding: "30px",
                        borderRadius: "50%",
                        color: "grey",
                      }}
                    />
                  }
                </Col>
                <Col span={18}>
                  <b style={{ color: "white", fontSize: "15px" }}>
                    TOTAL COURSES
                  </b>
                  <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                    <b style={{ fontSize: "30px", color: "white" }}>
                      {data?.course?.total}
                    </b>
                  </div>
                  <Progress
                    percent={
                      100 -
                      (data?.course?.lastMonthAdded / data?.course?.total) * 100
                    }
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightGreen"
                  />
                  <p
                    style={{
                      fontSize: "15px",
                      color: "white",
                      marginTop: "10px",
                    }}
                  >
                    {(
                      (data?.course?.lastMonthAdded / data?.course?.total) *
                      100
                    ).toFixed(2)}
                    % increase in 30 days
                  </p>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12}><Map /></Col>
          <Col span={12}>
            <PieCharts />
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col span={12} >
            <Polygon />
          </Col>
          <Col span={12} >
            <ColumnChart />
          </Col>
        </Row>
        
          <HeatMap />
       
      </div>
    </>
  );
};

export default Overview;
