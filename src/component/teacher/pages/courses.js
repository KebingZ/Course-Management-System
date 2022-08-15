/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from "react";
import { Table, Input, Tag, Rate } from "antd";
import { formatDistanceToNow } from "date-fns";
import { throttle } from "lodash";
import { get } from "../../../apiService";
import { useNavigate } from "react-router-dom";
import { processTag } from "../../../pages/courseDetail";
import { durationUnit } from "./students";

const { Search } = Input;

const MyCourseList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 300,
  });
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const getParams = (params) => ({
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  });

  const getData = (params = {}) => {
    setLoading(true);
    get(
      `courses?page=${getParams(params).current}&limit=${
        getParams(params).pageSize
      }`
    )
      .then((response) => {
        setDataSource(response.data);
        setPagination({
          ...params.pagination,
          total: getParams(params).pagination.total,
        });
        console.log(response.data.courses);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData({
      pagination,
    });
  }, []);

  const onChange = useCallback(
    throttle((e) => {
      get("courses", {
        params: {
          name: e.target.value,
          page: pagination.current,
          limit: pagination.pageSize,
        },
      }).then((response) => {
        setDataSource(response.data);
      });
    }, 1500),
    []
  );

  const defaultColumns = [
    {
      title: "id",
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
      render: (name, course) => {
        return (
          <a
            key={name}
            onClick={() => {
              navigate(`${course.id}`);
            }}
          >
            {name}
          </a>
        );
      },
    },
    {
      title: "Category",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type?.map((item) => (
          <span style={{ margin: "10px" }}>{item.name}</span>
        )),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, course) => {
        return (
          <Tag key={course.id} color={processTag[status].color}>
            {processTag[status].text}
          </Tag>
        );
      },
    },
    {
      title: "Star",
      dataIndex: "star",
      key: "star",
      render: (star) => <Rate disabled defaultValue={star} />,
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration, course) => {
        return (
          <div>
            {duration +
              " " +
              durationUnit[course.durationUnit] +
              (duration > 1 ? "s" : null)}
          </div>
        );
      },
    },
    {
      title: "Create Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render(createdAt) {
        return formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        });
      },
    },
  ];

  const handleTableChange = (newPagination, filters) => {
    getData({
      pagination: newPagination,
    });
  };

  return (
    <div>
      <Search
        placeholder="input search text"
        style={{ float: "right", width: "20%", marginBottom: "20px" }}
        enterButton
        onChange={onChange}
      />
      <Table
        rowClassName={() => "editable-row"}
        bordered
        rowKey="id"
        dataSource={dataSource.courses}
        columns={defaultColumns}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default MyCourseList;
