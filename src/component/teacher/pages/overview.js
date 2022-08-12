import {
  DesktopOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { Card, Col, Progress, Row, Space } from "antd";
import { useEffect, useState } from "react";
import { get } from "../../../apiService";
import { user } from "../../../App";
import {
  ChartRow,
  DataFont,
  Div,
  PercentageFont,
  TotalFont,
} from "../../../pages/overview";
import HeatMap from "../../charts/heatMap";
import PieCharts from "../../charts/pieCharts";
import Polygon from "../../charts/polygon";

const TeacherOverview = () => {
  const [data, setData] = useState();
  const [totalCourse, setTotalCourse] = useState(0);
  const [student, setStudent] = useState();
  useEffect(() => {
    get(`statistics/${user.role}?userId=${user.userId}`).then((response) => {
      setData(response.data);
      setTotalCourse(0);
      response.data.status?.forEach((item) =>
        setTotalCourse((totalCourse) => totalCourse + item.amount)
      );
    });

    get(`statistics/student?userId=${user.userId}`).then((response) => {
      setStudent(response.data);
    });
  }, []);

  return (
    <div>
      <ChartRow>
        <Col span={6}>
          <Card bodyStyle={{ backgroundColor: "#0099ff" }} bordered={false}>
            <Row type="flex" justify="center" align="middle">
              <Col span={6}>
                {
                  <BulbOutlined
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
              <Col span={2}>
                <Space></Space>
              </Col>

              <Col span={16}>
                <TotalFont>Pending</TotalFont>
                <Div>
                  <DataFont>
                    {data?.status[0] ? data?.status[0]?.amount : 0}
                  </DataFont>
                </Div>
                <Progress
                  percent={
                    data?.status[0]
                      ? 100 - (data?.status[0]?.amount / totalCourse) * 100
                      : 100
                  }
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {(data?.status[0]
                    ? (data?.status[0]?.amount / totalCourse) * 100
                    : 0
                  ).toFixed(2)}
                  % courses pending
                </PercentageFont>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card bodyStyle={{ backgroundColor: "#6600ff" }} bordered={false}>
            <Row type="flex" justify="center" align="middle">
              <Col span={6}>
                {
                  <DesktopOutlined
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
              <Col span={2}>
                <Space></Space>
              </Col>

              <Col span={16}>
                <TotalFont>Active</TotalFont>
                <Div>
                  <DataFont>
                    {data?.status[1] ? data?.status[1]?.amount : 0}
                  </DataFont>
                </Div>
                <Progress
                  percent={
                    data?.status[1]
                      ? 100 - (data?.status[1]?.amount / totalCourse) * 100
                      : 100
                  }
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {(data?.status[1]
                    ? (data?.status[1]?.amount / totalCourse) * 100
                    : 0
                  ).toFixed(2)}
                  % courses in progress
                </PercentageFont>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card bodyStyle={{ backgroundColor: "#ff9933" }} bordered={false}>
            <Row type="flex" justify="center" align="middle">
              <Col span={6}>
                {
                  <SafetyCertificateOutlined
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
              <Col span={2}>
                <Space></Space>
              </Col>

              <Col span={16}>
                <TotalFont>Done</TotalFont>
                <Div>
                  <DataFont>
                    {data?.status[2] ? data?.status[2]?.amount : 0}
                  </DataFont>
                </Div>
                <Progress
                  percent={
                    data?.status[2]
                      ? 100 - (data?.status[2]?.amount / totalCourse) * 100
                      : 100
                  }
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {(data?.status[2]
                    ? (data?.status[2]?.amount / totalCourse) * 100
                    : 0
                  ).toFixed(2)}
                  % courses done
                </PercentageFont>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={6}>
          <Card bodyStyle={{ backgroundColor: "green" }} bordered={false}>
            <Row type="flex" justify="center" align="middle">
              <Col span={6}>
                {
                  <TeamOutlined
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
              <Col span={2}>
                <Space></Space>
              </Col>

              <Col span={16}>
                <TotalFont>Students</TotalFont>
                <Div>
                  <DataFont>{student?.total}</DataFont>
                </Div>
                <Progress
                  percent={
                    student?.lastMonthAdded
                      ? 100 - (student?.lastMonthAdded / student?.total) * 100
                      : 100
                  }
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {student?.lastMonthAdded
                    ? (
                        (student?.lastMonthAdded / student?.total) *
                        100
                      ).toFixed(2)
                    : 0}
                  % increase in 30 days
                </PercentageFont>
              </Col>
            </Row>
          </Card>
        </Col>
      </ChartRow>
      <ChartRow>
        <Col span={12}>
          <PieCharts />
        </Col>
        <Col span={12}>
          <Polygon />
        </Col>
      </ChartRow>

      <HeatMap />
    </div>
  );
};

export default TeacherOverview;
