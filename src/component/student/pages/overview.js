import { Card, Col, Progress, Row, Space } from "antd";
import { useEffect, useState } from "react";
import {
  ChartRow,
  DataFont,
  Div,
  PercentageFont,
  TotalFont,
} from "../../../pages/overview";
import {
  DesktopOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { user } from "../../../App";
import { get } from "../../../apiService";

const StudentOverview = () => {
  const [data, setData] = useState([]);
  const [pending, setPending] = useState(0);
  const [active, setActive] = useState(0);
  const [done, setDone] = useState(0);
  useEffect(() => {
    get(`statistics/${user.role}?userId=${user.userId}`).then((response) => {
      setData(response.data);
      console.log(response.data);
      setPending(0);
      setActive(0);
      setDone(0);
      response.data.own.courses?.forEach((item) => {
        switch (item.course.status) {
          case 0:
            setPending((pending) => pending + 1);
            break;
          case 1:
            setActive((active) => active + 1);
            break;
          case 2:
            setDone((done) => done + 1);
            break;
          default:
            return new Error();
        }
      });
    });
  }, []);
  return (
    <div>
      <ChartRow>
        <Col span={8}>
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
                  <DataFont>{pending ? pending : 0}</DataFont>
                </Div>
                <Progress
                  percent={
                    pending ? 100 - (pending / data?.own.amount) * 100 : 100
                  }
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {(pending ? (pending / data?.own.amount) * 100 : 0).toFixed(
                    2
                  )}
                  % courses pending
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
                  <DataFont>{active ? active : 0}</DataFont>
                </Div>
                <Progress
                  percent={
                    active ? 100 - (active / data?.own.amount) * 100 : 100
                  }
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {(active ? (active / data?.own.amount) * 100 : 0).toFixed(2)}%
                  courses in progress
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
                  <DataFont>{done ? done : 0}</DataFont>
                </Div>
                <Progress
                  percent={done ? 100 - (done / data?.own.amount) * 100 : 100}
                  showInfo={false}
                  strokeColor="white"
                  trailColor="lightGreen"
                />
                <PercentageFont>
                  {(done ? (done / data?.own.amount) * 100 : 0).toFixed(2)}%
                  courses done
                </PercentageFont>
              </Col>
            </Row>
          </Card>
        </Col>
      </ChartRow>

      <ChartRow>
        <Card
          title="Courses you might be interested in"
          extra={<SyncOutlined />}
          style={{width: "100%", margin: "15px"}}
        >

        </Card>
      </ChartRow>
    </div>
  );
};

export default StudentOverview;
