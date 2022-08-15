import { Table } from "antd";
import { useEffect, useState } from "react";
import { get } from "../../../apiService";
import { user } from "../../../App";

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

const MyStudents = () => {
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 300,
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = (params = {}) => {
    setLoading(true);
    get(
      `students?page=${getParams(params).current}&limit=${
        getParams(params).pageSize
      }`
    )
      .then((response) => {
        if (response.data.students) {
          setStudents(response.data.students);
          setPagination((params) => ({
            ...params.pagination,
            total: getParams(params).pagination?.total,
          }));
        } else {
          return new Error();
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
      dataIndex: "name",
      editable: true,
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Courses",
      dataIndex: "courses",
      key: "courses",
      render(courses) {
        return courses?.map((item) => (
          <a href={`/dashboard/${user.role}/courses/${item.id}`} key={item.name}>
            <span style={{ margin: "10px" }}>{item.name}</span>
          </a>
        ));
      },
    },

    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type) => type.name,
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
        dataSource={students}
        columns={defaultColumns}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default MyStudents;
