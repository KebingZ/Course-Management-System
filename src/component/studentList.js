/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  Modal,
  Select,
  message,
} from "antd";
import { formatDistanceToNow } from "date-fns";
import throttle from "lodash/throttle";
import { post, get, put, apiDelete } from "../apiService";

const StudentList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editStudent, setEditStudent] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 300,
  });
  const [loading, setLoading] = useState(false);

  const getParams = (params) => ({
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  });

  const getData = (params = {}) => {
    setLoading(true);
    get(
      `students?page=${getParams(params).current}&limit=${
        getParams(params).pageSize
      }`
    )
      .then((response) => {
        response.data.students.map((student) => {
          if (student.type) {
            student.type = student.type.name;
            return student;
          }
        });
        setDataSource(response.data);
        setPagination({
          ...params.pagination,
          total: getParams(params).pagination.total,
        });
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

  useEffect(() => {
    get("countries").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
    setIsEdit(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const value = form.getFieldValue();
        if (isEdit) {
          edit(value);
        } else {
          onFinish(value);
        }
      })
      .then(() => {
        form.submit();
      })
      .finally(() => {
        setEditStudent();
        setIsModalVisible(false);
      });
  };

  const onFinish = (values) => {
    setIsLoading(true);
    post("students", {
      name: values.name,
      country: values.country,
      email: values.email,
      type: values.type,
    })
      .then((response) => {
        message.success(response.msg);
        getData({ pagination });
      })
      .finally(() => setIsLoading(false));
  };

  const edit = (values) => {
    put("students", {
      id: values.id,
      name: values.name,
      country: values.country,
      email: values.email,
      type: values.type,
    })
      .then((res) => {
        message.success(res.msg);
      })
      .then(() => {
        setEditStudent();
      })
      .then(() => {
        setIsModalVisible(false);
        getData({ pagination });
      });
  };

  const onChange = useCallback(
    throttle((e) => {
      get("students", {
        params: {
          query: e.target.value,
          page: pagination.current,
          limit: pagination.pageSize,
        },
      }).then((response) => {
        message.success("changed");
        setDataSource(response.data);
      });
    }, 1000),
    []
  );

  const handleDelete = (id) => {
    apiDelete(`students/${id}`).then((response) => {
      message.success(response.msg);
      getData({ pagination });
    });
  };

  const [filteredInfo, setFilteredInfo] = useState({});

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
      render: (name, student) => {
        return (
          <a key={name} href={`students/${student.id}`}>
            {name}
          </a>
        );
      },
    },
    {
      title: "country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      key: "courses",
      render(courses) {
        const course = courses.map((course) => course.name);
        return course;
      },
    },
    {
      title: "Student Type",
      dataIndex: "type",
      key: "type",
      render(type) {
        return type ? type.name || type : null;
      },
      filters: [
        {
          text: "tester",
          value: "tester",
        },
        {
          text: "developer",
          value: "developer",
        },
      ],
      filteredValue: filteredInfo.type || null,
      onFilter: (value, record) => {
        if (record.type && record.type.includes(value)) return record;
      },
      ellipsis: true,
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render(createdAt) {
        return formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        });
      },
    },
    {
      title: "operation",
      key: "operation",
      render: (_, student) =>
        dataSource.students.length >= 1
          ? <div>
              <a
                key="edit"
                style={{ padding: "5px", marginRight: "10px" }}
                onClick={() => {
                  setEditStudent(student);
                  setIsModalVisible(true);
                  setIsEdit(true);
                }}
              >
                Edit
              </a>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(student.id)}
              >
                <a
                  key="delete"
                  style={{ padding: "5px" }}
                >
                  Delete
                </a>
              </Popconfirm>
              </div>
          : null,
    },
  ];

  const { Search } = Input;
  const { Option } = Select;

  const handleTableChange = (newPagination, filters) => {
    getData({
      pagination: newPagination,
    });
    setFilteredInfo(filters);
  };

  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={showModal}
      >
        + Add
      </Button>
      <Modal
        title={isEdit ? "Edit Student" : "Add Student"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsModalVisible(false);
        }}
        destroyOnClose
        okButtonProps={{ disabled: isLoading }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={isEdit ? editStudent : {}}
          autoComplete="off"
          preserve={false}
        >
          <Form.Item
            label="Name"
            name="name"
            key="name"
            rules={[
              {
                required: true,
                message: "please input a name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            key="email"
            rules={[
              {
                required: true,
                message: "please input an email!",
              },
              {
                type: "email",
                message: "Please confirm the type of the email!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Area"
            name="country"
            key="country"
            rules={[
              {
                required: true,
                message: "please input a student's name!",
              },
            ]}
          >
            <Select allowClear>
              {countries.map((item) => (
                <Select.Option key={item.en} value={item.en}>
                  {item.en}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Student Type"
            name="type"
            key="type"
            rules={[
              {
                required: true,
                message: "please input a student's name!",
              },
            ]}
          >
            <Select allowClear>
              <Option value="1">tester</Option>
              <Option value="2">developer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Search
        placeholder="input search text"
        style={{ float: "right", width: "20%" }}
        enterButton
        onChange={onChange}
      />
      <Table
        rowClassName={() => "editable-row"}
        bordered
        rowKey="id"
        dataSource={dataSource.students}
        columns={defaultColumns}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default StudentList;
