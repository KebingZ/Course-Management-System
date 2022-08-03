/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import { Card } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { get } from "../../../apiService";
import HighchartsHeatmap from "highcharts/modules/heatmap";

const HeatMap = () => {
  HighchartsHeatmap(Highcharts);
  function getPointCategoryName(point, dimension) {
    var series = point.series,
      isY = dimension === "y",
      axis = series[isY ? "yAxis" : "xAxis"];
    return axis.categories[point[isY ? "y" : "x"]];
  }
  const [course, setCourse] = useState();
  useEffect(() => {
    get("statistics/course").then((res) => {
      setCourse(res.data);
    });
  }, []);
  const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const getCourseName = () => {
    const data = course?.type.map((item) => item.name);
    data?.push("Total");
    return data;
  };

  let data = [];
  const getHeatData = (index) => {
    let daysDict = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };
    course?.classTime[index].courses.forEach((course) => {
      course?.classTime?.forEach((time) => {
        daysDict[time.split(" ")[0]] += 1;
      });
    });
    let total = 0;
    for (var i = 0; i < 7; i++) {
      data.push([i, index, daysDict[days[i]]]);
      total += daysDict[days[i]];
    }
    data.push([7, index, total]);
  };

  const dataOperation = () => {
    let total = 0;
    for (var i = 0; i < getCourseName()?.length - 1; i++) {
      getHeatData(i);
    }
    let a = 0;

    for (var j = 0; j < 7; j++) {
      let s = 0;
      let b = a;
      while (b < (getCourseName()?.length - 1) * 8) {
        s += data[b][2];
        b += 8;
      }
      data.push([j, getCourseName()?.length - 1, s]);
      total += s;
      a += 1;
    }
    data.push([7, getCourseName()?.length - 1, total]);
  };
  dataOperation();

  const chart = {
    chart: {
      type: "heatmap",
      marginTop: 40,
      marginBottom: 40,
      plotBorderWidth: 1,
    },

    title: {
      text: "Course Schedule Per Weekday",
    },

    xAxis: {
      categories: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thurday",
        "Friday",
        "Saturday",
        "Total",
      ],
    },

    yAxis: {
      categories: getCourseName(),
      title: null,
      reversed: true,
    },

    colorAxis: {
      min: 0,
      minColor: "#FFFFFF",
      maxColor: Highcharts.getOptions().colors[0],
    },

    legend: {
      align: "right",
      layout: "vertical",
      margin: 0,
      verticalAlign: "top",
      y: 25,
      symbolHeight: 280,
    },

    tooltip: {
      formatter: function () {
        return (
          "<b>" +
          getPointCategoryName(this.point, "y") +
          "<br/>" +
          this.point.value +
          "</b>&nbsp lessons on <br/><b>" +
          getPointCategoryName(this.point, "x") +
          "</b>"
        );
      },
    },

    series: [
      {
        name: "Course Schedule",
        borderWidth: 1,
        data: data,
        dataLabels: {
          enabled: true,
          color: "#000000",
        },
      },
    ],

    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
        },
      ],
    },
  };

  return (
    <div>
      <Card title="Course Schedule">
        <HighchartsReact highcharts={Highcharts} options={chart} />
      </Card>
    </div>
  );
};

export default HeatMap;
