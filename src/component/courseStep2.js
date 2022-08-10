import React, { useEffect, useState } from "react";
import { Col, Form, Input, message, Button, Select, TimePicker } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { FormRow } from "./courseStep1";
import { put } from "../apiService";

const { Option } = Select;

const days = [
  { label: "Sunday", value: "Sunday" },
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];
const SecondStep = (props = null) => {
  const [form] = Form.useForm();
  const [selectVal, setSelectVal] = useState({});
  const [status, setStatus] = useState({});
  useEffect(() => {
    if (props.isEdit) {
      form.setFieldsValue(props.scheduleData);
      props.scheduleData?.time?.forEach((item) =>
        setSelectVal((selectVal) => ({
          ...selectVal,
          [props.scheduleData?.time.indexOf(item)]: item.day,
        }))
      );
      setStatus({
        current: props?.step2Param?.current,
        status: props?.step2Param?.status,
      });
    } else return;
  }, [form, props.isEdit, props.scheduleData, props.step2Param]);
  const onFinish = (value) => {
    put("courses/schedule", {
      scheduleId: props.step2Param?.scheduleId,
      courseId: props.step2Param?.courseId,
      chapters: value.chapter?.map((item, index) => {
        return { ...item, order: index + 1 };
      }),
      classTime: value.time?.map(
        (item) => `${item.day} ${moment(item.time).format("HH:mm:ss")}`
      ),
      ...status,
    }).then((response) => {
      if (response.msg === "success") {
        if (!props.isEdit) {
          props.setCurrentStep(props.currentStep + 1);
        }
        message.success("Create the detail of course successfully!");
      } else {
        message.error("Please check your detail of course!");
        throw new Error();
      }
    });
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      style={{ marginTop: "20px" }}
      onFinish={onFinish}
    >
      <FormRow>
        <Col span={12}>
          <h2>Chapters</h2>

          <Form.Item layout="horizontal">
            <Form.List name="chapter" initialValue={[1]}>
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
                              message: "Missing the chapter name",
                            },
                          ]}
                          key={key}
                        >
                          <Input
                            placeholder="Chapter Name"
                            style={{
                              marginRight: "20px",
                              height: "40px",
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          name={[name, "content"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing the chapter content",
                            },
                          ]}
                          key="content"
                        >
                          <Input
                            placeholder="Chapter Content"
                            style={{ height: "40px" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
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
                        Add Chapter
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Col>
        <Col span={12}>
          <h2>Class Time</h2>
          <Form.List name="time" initialValue={[1]} className="time">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <FormRow>
                    <Col span={8}>
                      <Form.Item
                        name={[name, "day"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing first name",
                          },
                        ]}
                        key={key}
                      >
                        <Select
                          className="day"
                          onChange={(value) => {
                            setSelectVal({
                              ...selectVal,
                              [name]: value,
                            });
                          }}
                          style={{ height: "100%" }}
                          placeholder="Select days"
                        >
                          {days.map((item) => (
                            <Option
                              disabled={Object.values(selectVal).includes(
                                item.value
                              )}
                              key={item.label}
                              value={item.value}
                            >
                              {item.value}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name={[name, "time"]}
                        rules={[
                          {
                            required: true,
                            message: "Missing first name",
                          },
                        ]}
                        key="time"
                      >
                        <TimePicker
                          style={{ width: "100%", height: "40px" }}
                          format={(value) => moment(value).format("HH:mm:ss")}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(name);
                            const newSelect = selectVal;
                            delete newSelect[name];
                            setSelectVal(newSelect);
                          } else {
                            message.warning(
                              "You must set at least one class time"
                            );
                          }
                        }}
                        style={{ marginTop: "10px" }}
                      />
                    </Col>
                  </FormRow>
                ))}
                <Col span={23}>
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      style={{
                        marginLeft: "-15px",
                        width: "90%",
                        height: "40px",
                      }}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </Col>
              </>
            )}
          </Form.List>
        </Col>
      </FormRow>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="form-button">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SecondStep;
