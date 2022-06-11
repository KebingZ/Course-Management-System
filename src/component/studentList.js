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

const StudentList = () => {
  const user = JSON.parse(window.localStorage.getItem("user"));
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

  const getData = (params = {}) => {
    setLoading(true);
    axios
      .get(
        endPoint +
          `students?page=${pagination.current}&limit=${pagination.pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        response.data.data.students = response.data.data.students.map(
          (student) => {
            student.courseList = student.courses.map((course) => {
              return course.name;
            });
            delete student.courses;
            return student;
          }
        );
        response.data.data.students = response.data.data.students.map(
          (student) => {
            student.type = student.type.name;
            student.createdAt = formatDistanceToNow(
              new Date(student.updatedAt),
              {
                addSuffix: true,
              }
            );
            return student;
          }
        );
        setDataSource(response.data.data);
        setPagination({
          ...params.pagination,
          total: dataSource.total,
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
    // form.submit();
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
      .then(() =>{form.submit();})
      .finally(() => {
        
        setEditStudent();
        setIsModalVisible(false);
      });
  };

  const onFinish = (values) => {
    setIsLoading(true);
    axios
      .post(
        endPoint + "students",
        {
          name: values.name,
          country: values.country,
          email: values.email,
          type: values.type,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      .then((response) => {
        message.success(response.msg);
        getData({ pagination });
      })
      .catch((error) => {
        message.error(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const edit = (values) => {
    axios
      .put(
        endPoint + "students",
        {
          id: values.id,
          name: values.name,
          country: values.country,
          email: values.email,
          type: values.type,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
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
      axios
        .get(
          endPoint + "students",
          {
            params: {
              query: e.target.value,
              page: 1,
              limit: 20,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
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
    axios
      .delete(endPoint + `students/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        message.success(response.msg);
        getData({ pagination });
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const defaultColumns = [
    {
      title: "id",
      dataIndex: "id",
      editable: false,
    },
    {
      title: "name",
      dataIndex: "name",
      sorter: true,
      editable: true,
    },
    {
      title: "country",
      dataIndex: "country",
    },
    {
      title: "email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: `courseList`,
    },
    {
      title: "Student Type",
      dataIndex: "type",
      filters: [
        {
          text: "tester",
          value: 1,
        },
        {
          text: "developer",
          value: 2,
        },
      ],
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
    },
    {
      title: "operation",

      render: (_, student) =>
        dataSource.students.length >= 1
          ? [
              <a
                style={{ padding: "5px" }}
                onClick={() => {
                  setEditStudent(student);
                  setIsModalVisible(true);
                  setIsEdit(true);
                  console.log(student);
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

  const handleTableChange = (newPagination, filters, sorter) => {
    getData({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
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
          form.resetFields();
        }}
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
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
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
        // components={components}
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
