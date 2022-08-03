import { useEffect, useState } from "react";
import { Col, Row, Skeleton, Divider, BackTop } from "antd";
import { get } from "../../../apiService";
import CourseCard from "../courseCard";
import InfiniteScroll from "react-infinite-scroll-component";

const CourseList = () => {
  const [data, setData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    get(`courses?page=1&limit=${20 * page}`).then((response) => {
      setData(response.data);
      setCourseData(response.data.courses);
    });
  }, [page]);
  return (
    <div>
      <BackTop style={{ right: 0, border: "none" }} />
      <InfiniteScroll
        dataLength={courseData?.length}
        next={() => {
          setPage(page + 1);
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
              <CourseCard data={item} />
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </div>
  );
};

export default CourseList;
