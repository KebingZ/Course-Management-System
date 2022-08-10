import { Row, Select, Tabs, Spin } from "antd";
import { useState, useCallback } from "react";
import { throttle } from "lodash";
import { get } from "../apiService";
import FirstStep from "../component/courseStep1";
import SecondStep from "../component/courseStep2";
import moment from "moment";

const { Option } = Select;
const { TabPane } = Tabs;
const timeStamps = {
  1: "Year",
  2: "Month",
  3: "Week",
  4: "Day",
  5: "Hour",
};

const EditCourse = () => {
  const [searchType, setSearchType] = useState("uid");
  const [search, setSearch] = useState([]);
  const [detailData, setDetailData] = useState();
  const [scheduleData, setScheduleData] = useState();
  const [courseId, setCourseId] = useState();
  const [step2Param, setStep2Param] = useState();
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (value) => {
    setSearchType(value);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    throttle((value) => {
      if (!value) {
        setSearch([]);
        return;
      }
      setIsSearching(true);
      get(`courses`, { [searchType]: value })
        .then((response) => {
          setSearch(response.data);
        })
        .then(() => {
          setIsSearching(false);
        });
    }, 1000),
    [searchType]
  );
  const getItem = (value) => {
    const item = search?.courses.filter((item) => item.name === value);
    get(`courses/schedule?courseId=${item[0].id}`).then((response) => {
      const {
        name,
        uid,
        detail,
        price,
        maxStudents,
        duration,
        cover,
        teacherId,
        id,
      } = item[0];
      setDetailData({
        name,
        uid,
        detail,
        startDate: moment(item[0]?.startTime?.split(" ")[0]),
        price,
        maxStudents,
        duration,
        suffixId: item[0]?.durationUnit,
        cover,
        teacherId,
        typeId: item[0]?.type?.map((item) => item.id),
        id,
        teacher: item[0]?.teacherName,
        type: item[0]?.type?.map((item) => item.name),
        suffix: timeStamps[item[0]?.durationUnit],
      });
      setScheduleData({
        chapter: response.data.chapters?.map((item) => {
          return { name: item.name, content: item.content };
        }),
        time: response.data.classTime?.map((item) => {
          return {
            day: item.split(" ")[0],
            time: new Date(`2022-08-01 ${item.split(" ")[1]}`),
          };
        }),
      });
      setStep2Param({
        scheduleId: item[0]?.scheduleId,
        courseId: item[0]?.id,
      });
    });
  };
  return (
    <div>
      <Row style={{ marginBottom: "30px", marginTop: "10px" }}>
        <Select
          defaultValue={searchType}
          style={{
            width: 80,
            marginRight: "-1px",
          }}
          onChange={handleChange}
          optionFilterProp="value"
        >
          <Option key="code" value="uid">
            Code
          </Option>
          <Option key="name" value="name">
            Name
          </Option>
          <Option key="category" value="type">
            Category
          </Option>
        </Select>
        <Select
          showSearch
          style={{
            width: 740,
          }}
          notFoundContent={isSearching ? <Spin size="small" /> : null}
          placeholder={`Search course by ${searchType}`}
          onSearch={onSearch}
          onChange={(value) => getItem(value)}
        >
          {search?.courses?.map((item) => (
            <Option key={item.uid + item.id} value={item.name}>
              {item.name} - {item.teacherName} - {item.uid}
            </Option>
          ))}
        </Select>
      </Row>

      <Tabs defaultActiveKey="detail" type="card" size="large">
        <TabPane tab="Course Detail" key="detail">
          <FirstStep
            detailData={detailData}
            isEdit={true}
            setCourseId={setCourseId}
            setStep2Param={setStep2Param}
          />
        </TabPane>
        <TabPane tab="Course Schedule" key="schedule">
          <SecondStep
            scheduleData={scheduleData}
            isEdit={true}
            courseId={courseId}
            step2Param={step2Param}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default EditCourse;
