/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Col, Row, Skeleton, Divider, BackTop } from "antd";
import { get } from "../apiService";
import CourseCard from "../component/courseCard";
import InfiniteScroll from "react-infinite-scroll-component";

let page = 1;
const CourseList = () => {
  const [data, setData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const getData = (i) => {
    get(`courses?page=1&limit=${20 * i}`).then((response) => {
      setData(response.data);
      setCourseData(response.data.courses);
    });
  };
  useEffect(() => {
    getData(page);
  }, []);
  return (
    <div>
      <BackTop style={{ right: 0 }} />
      <InfiniteScroll
        dataLength={courseData?.length}
        next={() => {
          page += 1;
          return getData(page);
        }}
        hasMore={courseData?.length < data?.total}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <Row>
          {courseData?.map((item) => (
            <Col span={6} key={item.id}>
              {CourseCard(item)}
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </div>
  );
};

export default CourseList;
