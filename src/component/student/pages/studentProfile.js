import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Rate,
  Select,
  Tag,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FormRow } from "../../courseStep1";
import { colorArr } from "../../studentDetail";
import EditForm from "../../teacher/editForm";

const StudentProfile = (props) => {
  return (
    <div>
      <Descriptions title="Member">
        <Descriptions.Item label="Duration">
          <b>From:</b>
          <pre> </pre>
          {props.data?.memberStartAt}
          <pre> </pre>
          <b>to:</b>
          <pre> </pre>
          {props.data?.memberEndAt}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Descriptions title="Other" column={3}>
        <Descriptions.Item label="Degree" span={1}>
          <EditForm
            content={props.data?.education}
            layout="horizontal"
            onSave={props.onSave}
          >
            <Form.Item name="education" initialValue={props.data?.education}>
              <Select style={{ width: "100%" }}>
                <Select.Option value="B.E." key="B.E.">
                  B.E.
                </Select.Option>
                <Select.Option value="B.S." key="B.S.">
                  B.S.
                </Select.Option>
                <Select.Option value="B.A." key="B.A.">
                  B.A.
                </Select.Option>
                <Select.Option value="BEd" key="BEd">
                  BEd
                </Select.Option>
                <Select.Option value="BBA" key="BBA">
                  BBA
                </Select.Option>
                <Select.Option value="MA.Sc" key="MA.Sc">
                  MA.Sc
                </Select.Option>
                <Select.Option value="MA.Eng" key="MA.Eng">
                  MA.Eng
                </Select.Option>
                <Select.Option value="MBA" key="MBA">
                  MBA
                </Select.Option>
                <Select.Option value="Ph.D" key="Ph.D">
                  Ph.D
                </Select.Option>
              </Select>
            </Form.Item>
          </EditForm>
        </Descriptions.Item>
        <Descriptions.Item label="Interest" span={2}>
          <EditForm
            content={props.data?.skills?.map((item) => (
              <FormRow style={{ margin: "-8px -3px 8px" }} key={item?.name}>
                <Col span={4} style={{ marginLeft: "-12px" }} key={item?.name}>
                  <Tag
                    key={item.name}
                    color={
                      colorArr[Math.floor(Math.random() * colorArr.length)]
                    }
                    style={{ padding: "5px 10px", marginBottom: "20px" }}
                  >
                    {item?.name}
                  </Tag>
                </Col>
                <Col span={8} key={item?.name + item?.level}>
                  <Rate disabled defaultValue={item?.level} />
                </Col>
              </FormRow>
            ))}
            layout="vertical"
            onSave={props.onSave}
            initialValues={{ interest: props.data?.interest }}
          >
            <Form.List name="interest">
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
                              message: "Missing the interest name",
                            },
                          ]}
                          key={key}
                        >
                          <Input
                            placeholder="Interest Name"
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
                              message: "Missing the interest level",
                            },
                          ]}
                          key="level"
                        >
                          <Rate />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <MinusCircleOutlined
                          onClick={() => {
                            if (fields.length > 1) {
                              remove(name);
                            } else {
                              message.warning(
                                "You must set at least one interest"
                              );
                            }
                          }}
                          style={{ marginTop: "10px" }}
                        />
                      </Col>
                    </FormRow>
                  ))}
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                        }}
                        block
                        icon={<PlusOutlined />}
                        style={{
                          height: "40px",
                          width: "80%",
                          marginLeft: "-15px",
                        }}
                      >
                        Add Interest
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
          </EditForm>
        </Descriptions.Item>
        <Descriptions.Item label="Intro" span={2}>
          <EditForm
            content={props.data?.description}
            layout="vertical"
            onSave={props.onSave}
          >
            <Form.Item
              name="description"
              initialValue={props.data?.description}
              style={{ width: "100%" }}
            >
              <TextArea style={{ width: "600px" }} />
            </Form.Item>
          </EditForm>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default StudentProfile;
