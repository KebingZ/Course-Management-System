/* eslint-disable array-callback-return */
import { Card } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { get } from "../apiService";

const ColumnChart = () => {
  const [student, setStudent] = useState();
  const [teacher, setTeacher] = useState();
  useEffect(() => {
    get("statistics/student").then((res) => setStudent(res.data));
    get("statistics/teacher").then((res) => setTeacher(res.data));
  }, []);
  const keys = teacher ? Object.keys(teacher?.skills) : null;
  keys?.unshift("Lisp");

  const getStackData = (arr, level) => {
    let data = [];
    keys?.forEach((key) => {
      if (arr?.skills[key]) {
        arr?.skills[key]?.forEach((item) => {
          if (item.level === level) {
            data.push([key, item.amount]);
          }
        });
      } else {
        data.push([key, 0]);
      }
    });
    return data;
  };
  const getInterest = (arr) => {
    let data = [];
    arr?.interest.forEach((item) => {
      data.push(Object.values(item));
    });
    data.sort((a, b) => {
      const rule = keys;
      return rule?.indexOf(a[0]) - rule?.indexOf(b[0]);
    });
    return data;
  };

  const chart = {
    chart: {
      type: "column",
    },
    title: {
      text: "Student VS Teacher",
    },
    subtitle: {
      text: "Comparing what students are interested in and teachers' skills",
    },
    xAxis: {
      categories: keys,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: "Interested VS Skills",
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: "</table>",
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
        dataLabels: {
          enabled: true,
        },
      },
    },
    series: [
      {
        name: "Know",
        stacking: "normal",
        data: getStackData(teacher, 1),
      },
      {
        name: "Practiced",
        stacking: "normal",
        data: getStackData(teacher, 2),
      },
      {
        name: "Comprehend",
        stacking: "normal",
        data: getStackData(teacher, 3),
      },
      {
        name: "Expert",
        stacking: "normal",
        data: getStackData(teacher, 4),
      },
      {
        name: "Master",
        stacking: "normal",
        data: getStackData(teacher, 5),
      },
      {
        name: "Interest",
        data: getInterest(student),
      },
    ],
  };
  return (
    <div>
      <Card
        title="Languages"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={chart} />
      </Card>
    </div>
  );
};

export default ColumnChart;
