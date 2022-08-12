import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Descriptions,
  Form,
  Input,
  message,
  Rate,
  Tag,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { FormRow } from "../../courseStep1";
import { colorArr } from "../../studentDetail";
import EditForm from "../editForm";

const TeacherProfile = (props) => {
  return (
    <div>
      <Descriptions title="Other" column={4}>
        <Descriptions.Item
          label="Skills"
          span={2}
          style={{ paddingBottom: "25px" }}
        />
        <Descriptions.Item label="Intro" span={2} />
      </Descriptions>
      <FormRow>
        <Col span={12}>
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
            initialValues={{ skills: props.data?.skills }}
          >
            <Form.List name="skills">
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
                              message: "Missing the skill content",
                            },
                          ]}
                          key="skill"
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
                                "You must set at least one skill"
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
                        Add Skill
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
            </Form.List>
          </EditForm>
        </Col>
        <Col span={12} style={{ marginLeft: "-15px" }}>
          <EditForm
            content={props.data?.description}
            layout="vertical"
            onSave={props.onSave}
          >
            <Form.Item
              name="description"
              initialValue={props.data?.description}
              style={{ width: "100%", marginLeft: "-5px" }}
            >
              <TextArea />
            </Form.Item>
          </EditForm>
        </Col>
      </FormRow>
    </div>
  );
};

export default TeacherProfile;
