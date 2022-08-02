import React, { useState, useCallback, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Upload,
  Modal,
  Button,
  message,
} from "antd";
import { get, post, put } from "../apiService";
import { throttle } from "lodash";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import ImgCrop from "antd-img-crop";
import { InboxOutlined } from "@ant-design/icons";

const { Option } = Select;
export const FormRow = styled(Row).attrs({
  gutter: { xs: 8, sm: 16, md: 24, lg: 32 },
})``;

const FirstStep = (props = null) => {
  const [form] = Form.useForm();
  const [search, setSearch] = useState([]);
  const [skill, setSkill] = useState([]);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [image, setImage] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const handleChange = ({ fileList: newFileList }) => setImage(newFileList);
  useEffect(() => {
    if (props.isEdit) {
      form.setFieldsValue(props.detailData);
    }
  }, [form, props.isEdit, props.detailData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    throttle((value) => {
      if (!value) return;
      get(`teachers?query=${value}`).then((response) => {
        setSearch(response.data);
      });
    }, 1500),
    []
  );
  const onFinish = (value) => {
    const course = {
      name: value?.courseName,
      uid: value?.courseCode,
      detail: value?.description,
      startTime: value?.startDate
        ? value?.startDate.format("YYYY-MM-DD")
        : moment().format("YYYY-MM-DD"),
      price: value?.price,
      maxStudents: value?.studentLimit,
      duration: value?.duration,
      durationUnit: !isNaN(parseInt(value?.suffix))
        ? parseInt(value?.suffix)
        : parseInt(props.detailData?.suffixId),
      cover: value?.cover,
      teacherId: !isNaN(parseInt(value?.teacher))
        ? value?.teacher
        : props.detailData?.teacherId,
      type: !isNaN(parseInt(value?.type))
        ? value?.type
        : props.detailData?.typeId,
    };
    if (!props.isEdit) {
      post("courses", course).then((response) => {
        if (response.msg === "success") {
          props.setCourseId(response.data.id);
          props.setStep2Param({
            scheduleId: response.data.scheduleId,
            courseId: response.data.id,
          });
          props.setCurrentStep(props.currentStep + 1);
          message.success("Create the detail of course successfully!");
        } else {
          message.error("Please check your detail of course!");
          throw new Error();
        }
      });
    } else {
      put("courses", { ...course, id: props.detailData.id }).then(
        (response) => {
          if (response.msg === "success") {
            props.setStep2Param({
              scheduleId: response.data.scheduleId,
              courseId: response.data.id,
              current: response.data.schedule.current,
              status: response.data.schedule.status,
            });
            message.success("Update the detail of course successfully!");
          } else {
            message.error("Please check your detail of course!");
            throw new Error();
          }
        }
      );
    }
  };
  const disabledDate = (current) => {
    return current && current < moment().endOf("day");
  };
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select
        style={{
          width: 70,
        }}
        optionFilterProp="key"
      >
        <Option key="year" value="1">
          Year
        </Option>
        <Option key="month" value="2">
          Month
        </Option>
        <Option key="week" value="4">
          Week
        </Option>
        <Option key="day" value="3">
          Day
        </Option>
        <Option key="hour" value="5">
          Hour
        </Option>
      </Select>
    </Form.Item>
  );
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
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
  useEffect(() => {
    get("courses/type").then((response) => {
      setSkill(response.data);
    });
  }, []);
  const courseCode = uuidv4();

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: "20px" }}
        onFinish={onFinish}
      >
        <FormRow>
          <Col span={8}>
            <Form.Item
              required
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
                  required
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
                    optionFilterProp={"key"}
                  >
                    {search?.teachers?.map((item) => (
                      <Option key={item.name} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  required
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
                    optionFilterProp="key"
                  >
                    {skill.map((item) => (
                      <Option key={item.name} value={item.id.toString()}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  required
                  name="courseCode"
                  label="Course Code"
                  initialValue={!props.isEdit ? courseCode : null}
                >
                  <Input
                    value={courseCode}
                    disabled={
                      !props.isEdit ? courseCode : props.detailData?.courseCode
                    }
                  />
                </Form.Item>
              </Col>
            </FormRow>
          </Col>
        </FormRow>
        <FormRow>
          <Col span={8}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                showTime="false"
                style={{ width: "100%" }}
              />
            </Form.Item>
            <Form.Item
              required
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
              required
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
              required
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
            <Form.Item
              name="description"
              label="Description"
              rules={[
                { required: true },
                {
                  min: 100,
                  max: 1000,
                  message:
                    "Description length must be between 100 - 100 characters!",
                },
              ]}
            >
              <Input.TextArea
                className="description"
                allowClear
                maxLength={1000}
                showCount
                placeholder="Course Description"
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
                    <div style={{ marginTop: "-20px" }}>
                      <p
                        className="ant-upload-drag-icon"
                        style={{ fontSize: "44px", color: "rgb(24, 144, 255" }}
                      >
                        <InboxOutlined />
                      </p>
                      <p
                        className="ant-upload-text"
                        style={{
                          fontSize: "24px",
                          color: "rgb(153, 153, 153)",
                        }}
                      >
                        Click or drag file to this area to upload
                      </p>
                    </div>
                  ) : null}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </Col>
        </FormRow>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="form-button"
          >
            {props.isEdit ? "Update Course" : "Create Course"}
          </Button>
        </Form.Item>
      </Form>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img
          alt="pic"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default FirstStep;
