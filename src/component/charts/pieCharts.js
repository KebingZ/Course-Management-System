import { Card, Col, Select, Row } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { get } from "../../apiService";
import styled from "styled-components";
import { user } from "../../App";

const ChartCard = styled(Card)`
  margin-top: 20px;
  margin-bottom: 20px;
`;

const PieCharts = () => {
  const [data, setData] = useState();
  const [student, setStudent] = useState();
  const [teacher, setTeacher] = useState();
  const [selValue, setSelValue] = useState("student");
  const [total, setTotal] = useState(0);
  const getData = (value) => {
    if (value === "gender") {
      get("statistics/overview").then((res) => {
        setStudent(res.data.student);
        setTeacher(res.data.teacher);
      });
    } else {
      get(`statistics/${value}`).then((res) => {
        setTotal(0);
        res.data.type.forEach((item) => {
          setTotal((total) => total + item.amount);
        });
        setData(res.data);
      });
    }
  };

  const getTeacherPieData = () => {
    get(`statistics/${user.role}?userId=${user.userId}`).then((response) => {
      setData(response.data);
      setTotal(0);
      response.data.type?.forEach((item) =>
        setTotal((total) => total + item.amount)
      );
    });
  };
  useEffect(() => {
    if (user.role === "manager") {
      getData(selValue);
    } else if (user.role === "teacher") {
      getTeacherPieData();
    }
  }, [selValue]);

  const title = {
    student: "Student Type",
    course: "Course type",
  };
  const pieChart = (data) => {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title:
        user.role === "manager"
          ? {
              text: title[selValue],
            }
          : {
              text: "Course Category",
            },

      tooltip: {
        pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Brands",
          colorByPoint: true,
          data: data,
        },
      ],
    };
  };
  const dualTypeData = data?.type?.map((item) => {
    return {
      name: item.name,
      y: (item.amount / total) * 100,
    };
  });

  const genderData = (data) => {
    const total = data
      ? Object.values(data.gender).reduce((a, b) => a + b)
      : null;

    return [
      {
        name: "male",
        y: data?.gender["male"] / total,
      },
      {
        name: "female",
        y: data?.gender["female"] / total,
      },
      {
        name: "unknown",
        y: data?.gender["unknown"] / total,
      },
    ];
  };
  const twoPieChart = [
    pieChart(genderData(student)),
    pieChart(genderData(teacher)),
  ];

  if (user.role === "teacher") {
    return (
      <div>
        <ChartCard title="Course Category">
          <HighchartsReact
            highcharts={Highcharts}
            options={pieChart(dualTypeData)}
          />
        </ChartCard>
      </div>
    );
  }

  return (
    <div>
      <ChartCard
        title="Type"
        extra={
          <Select
            defaultValue="student"
            bordered={false}
            onChange={(value) => setSelValue(value)}
          >
            <Select.Option key="student" value="student">
              student type
            </Select.Option>
            <Select.Option key="course" value="course">
              course type
            </Select.Option>
            <Select.Option key="gender" value="gender">
              gender
            </Select.Option>
          </Select>
        }
      >
        {selValue === "gender" ? (
          <Row>
            {twoPieChart.map((item) => {
              return (
                <Col span={12} key={twoPieChart.indexOf(item)}>
                  <HighchartsReact highcharts={Highcharts} options={item} />
                </Col>
              );
            })}
          </Row>
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={pieChart(dualTypeData)}
          />
        )}
      </ChartCard>
    </div>
  );
};

export default PieCharts;
