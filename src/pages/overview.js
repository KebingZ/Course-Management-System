import { get } from "../apiService"
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Progress } from "antd";
import {
  SolutionOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import PieCharts from "../component/charts/pieCharts";
import Polygon from "../component/charts/polygon";
import ColumnChart from "../component/charts/columnChart"
import HeatMap from "../component/charts/heatMap";
import Map from "../component/charts/map";
import styled from "styled-components";

export const ChartRow = styled(Row).attrs({
  gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
})``;

export const TotalFont = styled.b`
  color: white;
  font-size: 15px;
`;

export const Div = styled.div`
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const DataFont = styled.b`
  font-size: 30px;
  color: white;
`;
export const PercentageFont = styled.p`
  font-size: 15px;
  color: white;
  margin-top: 10px;
`;
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
        <ChartRow>
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
                  <TotalFont>TOTAL STUDENTS</TotalFont>
                  <Div>
                    <DataFont>{data?.student?.total}</DataFont>
                  </Div>
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
                  <PercentageFont>
                    {(
                      (data?.student?.lastMonthAdded / data?.student?.total) *
                      100
                    ).toFixed(2)}
                    % increase in 30 days
                  </PercentageFont>
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
                  <TotalFont>TOTAL TEACHERS</TotalFont>
                  <Div>
                    <DataFont style={{}}>{data?.teacher?.total}</DataFont>
                  </Div>
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
                  <PercentageFont>
                    {(
                      (data?.teacher?.lastMonthAdded / data?.teacher?.total) *
                      100
                    ).toFixed(2)}
                    % increase in 30 days
                  </PercentageFont>
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
                  <TotalFont>TOTAL COURSES</TotalFont>
                  <Div>
                    <DataFont>{data?.course?.total}</DataFont>
                  </Div>
                  <Progress
                    percent={
                      100 -
                      (data?.course?.lastMonthAdded / data?.course?.total) * 100
                    }
                    showInfo={false}
                    strokeColor="white"
                    trailColor="lightGreen"
                  />
                  <PercentageFont>
                    {(
                      (data?.course?.lastMonthAdded / data?.course?.total) *
                      100
                    ).toFixed(2)}
                    % increase in 30 days
                  </PercentageFont>
                </Col>
              </Row>
            </Card>
          </Col>
        </ChartRow>
        <ChartRow>
          <Col span={12}>
            <Map />
          </Col>
          <Col span={12}>
            <PieCharts />
          </Col>
        </ChartRow>
        <ChartRow>
          <Col span={12}>
            <Polygon />
          </Col>
          <Col span={12}>
            <ColumnChart />
          </Col>
        </ChartRow>

        <HeatMap />
      </div>
    </>
  );
};

export default Overview;
