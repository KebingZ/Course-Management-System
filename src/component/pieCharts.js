import { Card, Col, Select, Row } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { get } from "../apiService";

const PieCharts = () => {
  const [data, setData] = useState();
  const [student, setStudent] = useState();
  const [teacher, setTeacher] = useState();
  const [selValue, setSelValue] = useState("student");
  const getData = (value) => {
    if (value === "gender") {
      get("statistics/overview").then((res) => {
        setStudent(res.data.student);
        setTeacher(res.data.teacher);
      });
    } else {
      get(`statistics/${value}`).then((res) => {
        res.data.type.total = 0;
        res.data.type.forEach((item) => {
          res.data.type.total += item.amount;
        });
        setData(res.data);
      });
    }
  };
  useEffect(() => {
    getData(selValue);
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
      title: {
        text: title[selValue],
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
      y: (item.amount / data.type.total) * 100,
    };
  });

  const genderData = (data) => {
    const total = data ? (Object.values(data.gender).reduce((a, b) => a + b)) : null;
    
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

  return (
    <div>
      <Card
        title="Type"
        extra={
          <Select
            defaultValue="student"
            bordered={false}
            onChange={(value) => setSelValue(value)}
          >
            <Select.Option key="student" value="student">student type</Select.Option>
            <Select.Option key="course" value="course">course type</Select.Option>
            <Select.Option key="gender" value="gender">gender</Select.Option>
          </Select>
        }
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
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
      </Card>
    </div>
  );
};

export default PieCharts;
