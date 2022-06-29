/* eslint-disable array-callback-return */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { get } from "../apiService";

const Polygon = () => {
  const month = {
    "2022-01": "Jan",
    "2022-02": "Feb",
    "2022-03": "Mar",
    "2022-04": "Apr",
    "2022-05": "May",
    "2022-06": "Jun",
    "2022-07": "Jul",
    "2022-08": "Aug",
    "2022-09": "Sep",
    "2022-10": "Oct",
    "2022-11": "Nov",
    "2022-12": "Dec",
  };
  const dataConvert = (data) => {
    data?.createdAt.map((item) => {
      if (month[item.name]) {
        item.name = month[item.name];
      } else {
        item = null;
      }
      return item;
    });

    return data;
  };

  const getName = (data) => {
    var arr = data?.map((item) => item.name);
    return arr;
  };

  const [student, setStudent] = useState();
  const [teacher, setTeacher] = useState();
  const [course, setCourse] = useState();

  useEffect(() => {
    get("statistics/student").then((res) => setStudent(dataConvert(res.data)));
    get("statistics/teacher").then((res) => setTeacher(dataConvert(res.data)));
    get("statistics/course").then((res) => setCourse(dataConvert(res.data)));
  }, []);

  const getValue = (arr) => {
    const pushData = (value) => {
      let amount = 0;
      arr?.createdAt.map((item) => {
        if (item.name === value) {
          amount = item.amount;
        }
      });
      return amount;
    };
    let data = [];
    for (var key in month) {
      if (getName(arr?.createdAt)?.indexOf(month[key]) > -1) {
        data.push(pushData(month[key]));
      } else {
        data.push(0);
      }
    }
    return data;
  };

  const polygonChart = {
    title: {
      text: "",
    },
    yAxis: {
      title: {
        text: "Increment",
      },
    },

    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],

    },

  
    legend: {
      layout: "horizontal",
      align: "center",
      verticalAlign: "bottom",
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },

    series: [
      {
        name: "student",
        data: getValue(student),
      },
      {
        name: "teacher",
        data: getValue(teacher),
      },
      {
        name: "course",
        data: getValue(course),
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: "vertical",
              align: "center",
              verticalAlign: "bottom",
            },
          },
        },
      ],
    },
  };

  return (
    <div>
      <Card
        title="Increment"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <HighchartsReact highcharts={Highcharts} options={polygonChart} />
      </Card>
    </div>
  );
};
export default Polygon;
