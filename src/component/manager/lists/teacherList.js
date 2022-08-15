/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
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
  Col,
  Rate,
} from "antd";
import { throttle } from "lodash";
import { post, get, put, apiDelete } from "../../../apiService";
import { useNavigate } from "react-router-dom";
import { FormRow } from "../../courseStep1";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Search } = Input;

const TeacherList = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState([]);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editTeacher, setEditTeacher] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 300,
  });
  const [loading, setLoading] = useState(false);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  let navigate = useNavigate();

  const skillLevel = ["Know", "Practiced", "Comprehend", "Expert", "Master"];

  const getParams = (params) => ({
    pageSize: params.pagination?.pageSize,
    current: params.pagination?.current,
    ...params,
  });

  const getData = (params = {}) => {
    setLoading(true);
    get(
      `teachers?page=${getParams(params).current}&limit=${
        getParams(params).pageSize
      }`
    )
      .then((response) => {
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
        setEditTeacher();
        setIsModalVisible(false);
      });
  };

  const onFinish = (values) => {
    setIsLoading(true);
    post("teachers", {
      name: values.name,
      country: values.country,
      email: values.email,
      phone: values.phone,
      skills: values.skills,
    })
      .then((response) => {
        message.success(response.msg);
        getData({ pagination });
      })
      .finally(() => setIsLoading(false));
  };

  const edit = (values) => {
    put("teachers", {
      id: values.id,
      name: values.name,
      country: values.country,
      email: values.email,
      skills: values.skills,
    })
      .then((res) => {
        message.success(res.msg);
      })
      .then(() => {
        setEditTeacher();
      })
      .then(() => {
        setIsModalVisible(false);
        getData({ pagination });
      });
  };

  const onChange = useCallback(
    throttle((e) => {
      get("teachers", {
        params: {
          query: e.target.value,
          page: pagination.current,
          limit: pagination.pageSize,
        },
      }).then((response) => {
        setDataSource(response.data);
      });
    }, 1500),
    []
  );

  const handleDelete = (id) => {
    apiDelete(`teachers/${id}`).then((response) => {
      message.success("Deleted !");
      getData({ pagination });
    });
  };

  const defaultColumns = [
    {
      title: "Id",
      dataIndex: "id",
      editable: false,
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      editable: true,
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      render: (name, teacher) => {
        return (
          <a
            key={name}
            onClick={() => {
              navigate(`${teacher.id}`);
            }}
          >
            {name}
          </a>
        );
      },
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      filters: [
        {
          text: "China",
          value: "China",
        },
        {
          text: "New Zealand",
          value: "New Zealand",
        },
        {
          text: "Canada",
          value: "Canada",
        },
        {
          text: "Australia",
          value: "Australia",
        },
      ],
      filteredValue: filteredInfo.type || null,
      onFilter: (value, record) => {
        if (record.type && record.type.includes(value)) return record;
      },
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Skill",
      dataIndex: "skills",
      key: "skills",
      render(skills) {
        return skills?.map((item) => (
          <span style={{ margin: "10px" }} key={item.name}>
            {item.name}
          </span>
        ));
      },
    },
    {
      title: "Course Amount",
      dataIndex: "courseAmount",
      key: "courseAmount",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Action",
      key: "operation",
      render: (_, teacher) =>
        dataSource.teachers.length >= 1 ? (
          <div>
            <a
              key="edit"
              style={{ padding: "5px", marginRight: "10px" }}
              onClick={() => {
                setEditTeacher(teacher);
                setIsModalVisible(true);
                setIsEdit(true);
              }}
            >
              Edit
            </a>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(teacher.id)}
            >
              <a key="delete" style={{ padding: "5px" }}>
                Delete
              </a>
            </Popconfirm>
          </div>
        ) : null,
    },
  ];

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
        title={isEdit ? "Edit Teacher" : "Add Teacher"}
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
          initialValues={isEdit ? editTeacher : {}}
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
                message: "please select a country!",
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
            label="Phone"
            name="phone"
            key="phone"
            rules={[
              {
                required: true,
                message: "please input a phone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item layout="horizontal" key="skills" label="Skill">
            <Form.List name="skills" initialValue={[1]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name }) => (
                    <FormRow>
                      <Col span={8}>
                        <Form.Item
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing the skill name",
                            },
                          ]}
                          key={key}
                        >
                          <Input
                            placeholder="Skill Name"
                            style={{
                              marginRight: "20px",
                              height: "40px",
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "level"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing the skill level",
                            },
                          ]}
                          key="level"
                        >
                          <Rate tooltips={skillLevel} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(name);
                            } else {
                              message.warning(
                                "You must set at least one skill"
                              );
                            }
                          }}
                          style={{ marginTop: "10px" }}
                        />
                      </Col>
                    </FormRow>
                  ))}
                  <Col span={20}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                        style={{ height: "40px" }}
                      >
                        Add Skill
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
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
        dataSource={dataSource.teachers}
        columns={defaultColumns}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
      />
    </div>
  );
};

export default TeacherList;
