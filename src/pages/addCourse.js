import {
  Button,
  message,
  Steps,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Modal,
  Upload,
  Space,
  TimePicker,
  Result,
} from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { throttle } from "lodash";
import { get } from "../apiService";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import ImgCrop from "antd-img-crop";
import {
  InboxOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Step } = Steps;
const { Option } = Select;
const { Dragger } = Upload;
const FormRow = styled(Row).attrs({
  gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
})``;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const days = [
  { label: "Sunday", value: "Sunday" },
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];

const AddCourse = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [search, setSearch] = useState([]);
  const [skill, setSkill] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [image, setImage] = useState([]);
  const [formValue, setFormValue] = useState([])
  const selectVal = {}

  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option key="year" value="year">Year</Option>
        <Option key="month" value="month">Month</Option>
        <Option key="week" value="week">Week</Option>
        <Option key="day" value="day">Day</Option>
        <Option key="hour" value="hour">Hour</Option>
      </Select>
    </Form.Item>
  );
  const onSearch = useCallback(
    throttle((value) => {
      get(`teachers?query=${value}`).then((response) => {
        setSearch(response.data);
      });
    }, 1500),
    []
  );

  const onFinish = (values) => {
    
    console.log("Received values of form:", values);
  };

  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setImage(newFileList);
  useEffect(() => {
    get("statistics/teacher").then((response) => {
      setSkill(response.data.skills);
    });
  }, []);
  const keys = skill ? Object.keys(skill) : null;

  const firstPage = (
    <div>
      <FormRow>
        <Col span={8}>
          <Form.Item
          name="courseName"
            label="Course Name"
            rules={[
              {
                required: true,
                message: "please add a course!",
              },
            ]}
          >
            <Input placeholder="course name" />
          </Form.Item>
        </Col>
        <Col span={16}>
          <FormRow>
            <Col span={8} style={{ width: "100%" }}>
              <Form.Item
              name="teacher"
                label="Teacher"
                rules={[
                  {
                    required: true,
                    message: "please choose a teacher!",
                  },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select a teacher"
                  onSearch={onSearch}
                >
                  {search?.teachers?.map((item) => (
                    <Option key={item.name} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
              name="type"
                label="Type"
                rules={[
                  {
                    required: true,
                    message: "please choose a type!",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  style={{
                    width: "100%",
                  }}
                  placeholder="Select a type"
                  
                >
                  {keys.map((item) => (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="courseCode" label="Course Code">
                <Input disabled placeholder={uuidv4()} />
              </Form.Item>
            </Col>
          </FormRow>
        </Col>
      </FormRow>
      <FormRow>
        <Col span={8}>
          <Form.Item
          name="startDate"
            label="Start Date"
            rules={[
              {
                required: true,
                message: "A date is required!",
              },
            ]}
          >
            <DatePicker
              format="YYYY-MM-DD"
              disabledDate={disabledDate}
              showTime="false"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
          name="price"
            label="Price"
            rules={[
              {
                required: true,
                message: "A price is required!",
              },
            ]}
          >
            <InputNumber
              min={0}
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
          name="studentLimit"
            label="Student Limit"
            rules={[
              {
                required: true,
                message: "The number of student is required!",
              },
            ]}
          >
            <InputNumber
              min={0}
              max={10}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
          name="duration"
            label="Duration"
            rules={[
              {
                required: true,
                message: "The duration is required!",
              },
            ]}
          >
            <InputNumber
              min={0}
              addonAfter={suffixSelector}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              allowClear
              maxLength={1000}
              showCount
              placeholder="Course Detail"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="cover" label="Cover">
            <ImgCrop rotate>
              <Upload
                multiple={false}
                onPreview={handlePreview}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={image}
                onChange={handleChange}
              >
                {image.length < 1 ? (
                  <div>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">
                      Click or drag file to this area to upload
                    </p>
                  </div>
                ) : null}
              </Upload>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImage}
                />
              </Modal>
            </ImgCrop>
          </Form.Item>
        </Col>
      </FormRow>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          onClick={() => {
            setCurrentStep(currentStep + 1);
          }}
        >
          Update Course
        </Button>
      </Form.Item>
    </div>
  );
  const secondPage = (
    <div>
        <FormRow>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.Item>
              <Form.List name="chapter" initialValue={[1]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing the chapter name",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Chapter Name"
                            style={{
                              width: "250px",
                              marginRight: "20px",
                              height: "40px",
                            }}
                          />
                        </Form.Item>
                        <Form.Item
                          name={[name, "content"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing the chapter content",
                            },
                          ]}
                        >
                          <Input
                            placeholder="Chapter Content"
                            style={{ width: "500px", height: "40px" }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(name);
                            } else {
                              message.warning(
                                "You must set at least one chapter"
                              );
                            }
                          }}
                        />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                        style={{ width: "780px", height: "40px" }}
                      >
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Col>
          <Col span={12}>
            <h2>Class Time</h2>
              <Form.List name="time" initialValue={[1]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 8,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          name={[name, "day"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing first name",
                            },
                          ]}
                        >
                          <Select
                            listItemHeight="40px"
                            style={{
                              width: "250px",
                              marginRight: "20px",
                            }}
                            onChange={(value) => {selectVal[name]=value}}
                          >
                            {days.map(item => <Option disabled={Object.values(selectVal).includes(item.value)} key={item.label} value={item.value}>{item.value}</Option>)}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          name={[name, "time"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing first name",
                            },
                          ]}
                        >
                          <TimePicker
                            style={{ width: "500px", height: "40px" }}
                          />
                        </Form.Item>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(name);
                              delete selectVal[name]
                            } else {
                              message.warning(
                                "You must set at least one class time"
                              );
                            }
                          }}
                        />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                        style={{ width: "780px", height: "40px" }}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
          </Col>
        </FormRow>
        <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="login-form-button"
          onClick={() => {
            setCurrentStep(currentStep + 1);
            form.submit()
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </div>
  );
  const thirdPage = (
    <Result
    status="success"
    title="The Course Successfully Created!"
    extra={[
      <Button type="primary" key="console" onClick={() => {
        // get(`courses?name=${}`).then((response))
      }}>
        Go Course
      </Button>,
      <Button key="buy"><Link to="/dashboard/manager/courses/add-course">Create Again</Link></Button>,
    ]}
  />
  )
  const steps = [
    {
      title: "Course Detail",
      content: firstPage,
    },
    {
      title: "Course Schedule",
      content: secondPage,
    },
    {
      title: "Success",
      content: thirdPage,
    },
  ];
  return (
    <div>
      <Steps current={currentStep} type="navigation">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} onClick={() => 
            steps.indexOf(item) < currentStep ? setCurrentStep(steps.indexOf(item)) : null
          }></Step>
        ))}
      </Steps>
      <Form
        form={form}
        layout={currentStep === 0 ? "vertical" : "horizontal"}
        style={{ marginTop: "20px" }}
        onFinish={onFinish}
      >
        {steps[currentStep].content}
      </Form>
    </div>
  );
};

export default AddCourse;
