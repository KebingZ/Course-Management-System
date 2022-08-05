import { get } from "../../../apiService";
import { user } from "../../../App";
import { Calendar, Col, Tag, Card, Modal, Descriptions, Tooltip } from "antd";
import { useEffect, useState } from "react";
import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  getDay,
  getMonth,
  getYear,
  isSameDay,
} from "date-fns";
import { cloneDeep, sortBy } from "lodash";
import { FormRow } from "../../courseStep1";
import { ClockCircleOutlined, NotificationFilled } from "@ant-design/icons";
import { colorArr } from "../../studentDetail";

export const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const sortWeekdays = (classTime, startTime) => {
  const startDay = getDay(startTime);
  classTime = sortBy(classTime, ["weekDay, time"], ["asc", "asc"]);
  const firstIndex = classTime.findIndex((item) => item.weekday === startDay);
  return [...classTime.slice(firstIndex), ...classTime.slice(0, firstIndex)];
};

const generateCalendar = (course) => {
  const {
    startTime,
    duration,
    durationUnit,
    schedule: { classTime, chapters },
  } = course;

  if (!classTime) return;

  const chaptersCopy = cloneDeep(chapters);
  const start = new Date(startTime);
  const addFns = [addYears, addMonths, addDays, addWeeks, addHours];
  const end = addFns[durationUnit - 1](start, duration);
  const days = differenceInCalendarDays(end, start);
  const transformWeekday = (day) => weekDays.findIndex((item) => item === day);
  const classTimes = classTime.map((item) => {
    const [day, time] = item.split(" ");
    const weekday = transformWeekday(day);

    return { weekday, time };
  });
  const sortedClassTimes = sortWeekdays(classTimes, start);
  const getClassInfo = (day) =>
    sortedClassTimes.find((item) => item.weekday === day);
  const result = [
    {
      date: start,
      chapter: chaptersCopy.shift(),
      weekday: getDay(start),
      time:
        getDay(start) === sortedClassTimes[0]?.weekday
          ? sortedClassTimes[0]?.time
          : "",
    },
  ];

  for (let i = 1; i < days; i++) {
    const date = addDays(start, i);
    const day = getDay(date);
    const classInfo = getClassInfo(day);
    if (classInfo) {
      const chapter = chaptersCopy.shift();
      result.push({ date, chapter, ...classInfo });
    }
  }

  return result;
};

const ClassSchedule = () => {
  const [data, setData] = useState([]);
  const [info, setInfo] = useState();

  useEffect(() => {
    get(`class/schedule?userId=${user.userId}`).then((response) => {
      const courses = response.data?.map((item) => ({
        ...item,
        calendar: generateCalendar(item),
      }));
      setData(courses);
    });
  }, []);

  const monthCellRender = (val) => {
    const value = new Date(val);
    const month = getMonth(value);
    const year = getYear(value);
    const result = data
      ?.map((item) => {
        const course = item?.calendar?.filter((item) => {
          const classMonth = getMonth(item.date);
          const classYear = getYear(item.date);
          return classYear === year && classMonth === month;
        });

        const total = course?.length;
        return !!total ? { ...item, statistics: { total } } : null;
      })
      .filter((item) => item);

    return result?.length ? (
      <>
        {result.map((course) => (
          <FormRow key={course.id} style={{ marginBottom: "5px" }}>
            <Col>
              <Tag
                key={course.name}
                color={colorArr[Math.floor(Math.random() * colorArr.length)]}
              >
                <b>{course.name}</b>
              </Tag>
            </Col>

            <Col offset={1}>{course.statistics.total} lessons</Col>
          </FormRow>
        ))}
      </>
    ) : null;
  };

  const dateCellRender = (value) => {
    const listData = data
      ?.map((item) => {
        const { calendar } = item;
        const date = calendar?.find((item) =>
          isSameDay(new Date(value), item.date)
        );
        return date ? { class: date, ...item } : null;
      })
      .filter((item) => !!item);

    return (
      <>
        {listData?.map((item, index) => (
          <FormRow
            key={index}
            onClick={() => setInfo(item)}
            style={{ marginBottom: "5px" }}
          >
            <Col span={1}>
              <ClockCircleOutlined />
            </Col>

            <Col span={8} offset={1}>
              {item?.class?.time}
            </Col>

            <Col offset={1}>
              <Tag
                key={item.name}
                color={colorArr[Math.floor(Math.random() * colorArr.length)]}
              >
                {item.name}
              </Tag>
            </Col>
          </FormRow>
        ))}
      </>
    );
  };
  return (
    <div>
      <Card title="My Class Schedule">
        <Calendar
          dateCellRender={dateCellRender}
          monthCellRender={monthCellRender}
        />
      </Card>
      <Modal
        title="Class Info"
        onCancel={() => setInfo()}
        visible={info}
        footer={null}
      >
        <Descriptions>
          <Descriptions.Item span={3} label="Course Name">
            {info?.name}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Chapter N.O">
            {info?.schedule.chapters.findIndex(
              (item) => item.id === info?.class.chapter?.id
            ) + 1}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Course Type">
            {info?.type[0]?.name}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Teacher Name">
            {info?.teacherName}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Class Time">
            {info?.class.time}

            <Tooltip title="Remind me">
              <NotificationFilled
                style={{ color: "#1890ff", marginLeft: 10, cursor: "pointer" }}
                onClick={() => {
                  setInfo();
                }}
              />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Chapter Name">
            {info?.class.chapter?.name}
          </Descriptions.Item>
          <Descriptions.Item span={3} label="Chapter Content">
            {info?.class.chapter?.content}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </div>
  );
};
export default ClassSchedule;
