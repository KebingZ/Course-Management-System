/* eslint-disable react/jsx-no-duplicate-props */
import { Card, Select } from "antd";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { get } from "../../apiService";
import axios from "axios";
import highchartsMap from "highcharts/modules/map";
import styled from "styled-components";

const ChartCard = styled(Card)`
  margin-top: 20px;
  margin-bottom: 20px;
`;

highchartsMap(Highcharts);
const Map = () => {
  const [mapData, setMapData] = useState();
  const [selValue, setSelValue] = useState("student");
  const [data, setData] = useState();
  const getData = (value) => {
    get(`statistics/${value}`).then((res) => {
      setData(res.data.country);
    });
  };
  useEffect(() => {
    getData(selValue);
  }, [selValue]);

  useEffect(() => {
    axios
      .get(
        "https://code.highcharts.com/mapdata/custom/world-palestine-highres.geo.json"
      )
      .then((res) => {
        setMapData(res.data);
      });
  }, []);

  const mapSource = data?.map((item) => {
    const target = mapData?.features.find(
      (feature) =>
        item.name.toLowerCase() === feature.properties.name.toLowerCase()
    );

    return !!target
      ? {
          "hc-key": target.properties["hc-key"],
          value: item.amount,
        }
      : {};
  });

  const chart = {
    title: {
      text: null,
    },

    accessibility: {
      series: {
        descriptionFormat:
          "{series.name}, map with {series.points.length} areas.",
        pointDescriptionEnabledThreshold: 50,
      },
    },

    colorAxis: {
      min: 0,
      stops: [
        [0, "#EFEFFF"],
        [0.5, Highcharts.getOptions().colors[0]],
        [
          1,
          Highcharts.color(Highcharts.getOptions().colors[0])
            .brighten(-0.5)
            .get(),
        ],
      ],
    },

    legend: {
      layout: "vertical",
      align: "left",
      verticalAlign: "bottom",
    },

    series: [
      {
        data: mapSource,
        mapData: mapData,
        name: "Total",
        states: {
          hover: {
            color: Highcharts.getOptions().colors[2],
          },
        },
        dataLabels: {
          style: {
            fontWeight: 100,
            fontSize: "10px",
            textOutline: "none",
          },
        },
      },
      {
        name: "Lines",
        accessibility: {
          enabled: false,
        },
        nullColor: "#333333",
        showInLegend: false,
        enableMouseTracking: false,
      },
    ],
  };

  return (
    <div>
      <ChartCard
        title="Distribution"
        extra={
          <Select
            defaultValue="student"
            bordered={false}
            onChange={(value) => setSelValue(value)}
          >
            <Select.Option value="student">student</Select.Option>
            <Select.Option value="teacher">teacher</Select.Option>
          </Select>
        }
      >
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"mapChart"}
          options={chart}
        />
      </ChartCard>
    </div>
  );
};
export default Map;
