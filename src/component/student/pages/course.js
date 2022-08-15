import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { get } from "../../../apiService";
import { user } from "../../../App";
import { processTag } from "../../../pages/courseDetail";
import { formatDistanceToNow } from "date-fns";

export const getParams = (params) => ({
  pageSize: params.pagination?.pageSize,
  current: params.pagination?.current,
  ...params,
});

export const durationUnit = {
  1: "year",
  2: "month",
  3: "day",
  4: "week",
  5: "hour",
};

const MyCourse = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 300,
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = (params = {}) => {
    setLoading(true);
    get(
      `courses?page=${getParams(params).current}&limit=${
        getParams(params).pageSize
      }&userId=${user.userId}`
    )
      .then((response) => {
        if (response.data.courses) {
        setCourses(response.data.courses);
        setPagination((params) => ({
          ...params.pagination,
          total: getParams(params).pagination?.total,
        }));
      }
      else {
        return new Error()
      }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getData(pagination);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultColumns = [
    {
      title: "Id",
      dataIndex: "id",
      editable: false,
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "name",
      dataIndex: "course",
      editable: true,
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (_, course) => {
        return (
          <a
            key={course.course.name}
            href={`/dashboard/${user.role}/courses/${course.id}`}
          >
            {course.course.name}
          </a>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "course",
      key: "status",
      render: (_, course) => {
        return (
          <Tag key={course.id} color={processTag[course.course.status].color}>
            {processTag[course.course.status].text}
          </Tag>
        );
      },
    },
    {
      title: "Duration",
      dataIndex: "course",
      key: "duration",
      render: (_, course) => {
        console.log(course.course.duration);
        return (
          <div>
            {course.course.duration +
              " " +
              durationUnit[course.course.durationUnit] +
              (course.course.duration > 1 ? "s" : null)}
          </div>
        );
      },
    },
    {
      title: "Course Start",
      dataIndex: "course",
      key: "startTime",
      render: (_, course) => course.course.startTime,
    },
    {
      title: "Category",
      dataIndex: "course",
      key: "type",
      render(_, course) {
        return course.course.type?.map((item) => item.name);
      },
    },

    {
      title: "Join Time",
      dataIndex: "course",
      key: "createdAt",
      render: (_, course) =>
        formatDistanceToNow(new Date(course.createdAt), {
          addSuffix: true,
        }),
    },
  ];

  const handleTableChange = (newPagination) => {
    getData({
      pagination: newPagination,
    });
  };
  return (
    <div>
      <Table
        rowClassName={() => "editable-row"}
        bordered
        rowKey="id"
        dataSource={courses}
        columns={defaultColumns}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default MyCourse;
