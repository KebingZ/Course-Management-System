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
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { endPoint } from "../domain";
import throttle from "lodash/throttle";
import axiosInst from "../apiService";

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

  const getRandomUserParams = (params) => ({
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  });

  const getData = (params = {}) => {
    setLoading(true);
    axiosInst
      .get(
        endPoint +
          `students?page=${getRandomUserParams(params).current}&limit=${
            getRandomUserParams(params).pageSize
          }`
      )
      .then((response) => {
        setDataSource(response.data.data);
        setPagination({
          ...params.pagination,
          total: getRandomUserParams(params).pagination.total,
        });
      })
      .catch((error) => {
        message.error(error.message);
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
    axios
      .get(endPoint + "countries")
      .then((response) => {
        setCountries(response.data.data);
      })
      .catch((error) => {
        message.error(error.message);
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
    axiosInst
      .post(endPoint + "students", {
        name: values.name,
        country: values.country,
        email: values.email,
        type: values.type,
      })
      .then((response) => {
        message.success(response.data.msg);
        getData({ pagination });
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const edit = (values) => {
    axiosInst
      .put(endPoint + "students", {
        id: values.id,
        name: values.name,
        country: values.country,
        email: values.email,
        type: values.type,
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
      axiosInst
        .get(endPoint + "students", {
          params: {
            query: e.target.value,
            page: pagination.current,
            limit: pagination.pageSize,
          },
        })
        .then((response) => {
          message.success("changed");
          setDataSource(response.data.data);
        })
        .catch((error) => {
          message.error(error.message);
        });
    }, 1000),
    []
  );

  const handleDelete = (id) => {
    axiosInst
      .delete(endPoint + `students/${id}`)
      .then((response) => {
        message.success(response.msg);
        getData({ pagination });
      })
      .catch((error) => {
        message.error(error.message);
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
    },
    {
      title: "country",
      dataIndex: "country",
      key: "id",
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
        type = type.name;
        return type;
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
      onFilter: (value, record) => record.type.includes(value),
      ellipsis: true,
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render(createdAt) {
        createdAt = formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        });
        return createdAt;
      },
    },
    {
      title: "operation",
      key: "operation",
      render: (_, student) =>
        dataSource.students.length >= 1
          ? [
              <a
                style={{ padding: "5px" }}
                onClick={() => {
                  setEditStudent(student);
                  setIsModalVisible(true);
                  setIsEdit(true);
                }}
              >
                Edit
              </a>,
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDelete(student.id)}
              >
                <a style={{ padding: "5px" }}>Delete</a>
              </Popconfirm>,
            ]
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
