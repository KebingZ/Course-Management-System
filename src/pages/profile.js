import {
  Card,
  Descriptions,
  Divider,
  Upload,
  Tooltip,
  Input,
  Form,
  DatePicker,
  Radio,
  message,
  Select,
  Cascader,
  InputNumber,
} from "antd";
import { get, put } from "../apiService";
import { useEffect, useState } from "react";
import { user } from "../App";
import { FormRow } from "../component/courseStep1";
import { genderList } from "../component/studentDetail";
import { QuestionCircleOutlined } from "@ant-design/icons";
import EditForm from "../component/teacher/editForm";
import moment from "moment";
import address from "../address.json";
import TeacherProfile from "../component/teacher/pages/teacherProfile";
import StudentProfile from "../component/student/pages/studentProfile";

const Profile = () => {
  const [data, setData] = useState([]);
  const [country, setCountry] = useState([]);
  const [file, setFile] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: null,
    },
  ]);
  const handleImgChange = ({ fileList: newFileList }) => setFile(newFileList);

  useEffect(() => {
    get(`profile?userId=${user.userId}`).then((response) => {
      setData(response.data);
      setFile((file) => [
        {
          ...file[0],
          url: response?.data?.avatar,
        },
      ]);
    });

    get("countries").then((response) => {
      setCountry(response.data);
    });
  }, []);

  const onPreview = async (file) => {
    let src = file.url;

    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);

        reader.onload = () => resolve(reader.result);
      });
    }

    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const onSave = (value) => {
    if (value.birthday) {
      value.birthday = value.birthday.format("YYYY-MM-DD");
    }

    put(`profile/${user.role}/${user.userId}`, {
      id: user.userId,
      ...value,
    }).then((response) => {
      if (response.data) {
        message.success("Successfully changed !");
        setData(response.data);
      } else return;
    });
  };

  return (
    <div>
      <Card
        title="My Profile"
        extra={
          <Tooltip placement="left" title="Double click content to edit">
            <QuestionCircleOutlined />
          </Tooltip>
        }
      >
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          multiple={false}
          fileList={file}
          onPreview={onPreview}
          onChange={handleImgChange}
          className="uploadImg"
        >
          {file.length < 1 && "+ Upload"}
        </Upload>
        <Divider />
        <Descriptions title="Basic Info">
          <Descriptions.Item label="Name">
            <FormRow style={{ marginLeft: 0, height: "25px" }}>
              <EditForm
                content={data?.name}
                layout="horizontal"
                onSave={onSave}
              >
                <Form.Item name="name" initialValue={data?.name}>
                  <Input placeholder="Name" />
                </Form.Item>
              </EditForm>
            </FormRow>
          </Descriptions.Item>
          <Descriptions.Item label="Birthday">
            <EditForm
              content={user.role === "teacher" ? data?.birthday : data?.age}
              layout="horizontal"
              onSave={onSave}
            >
              <Form.Item
                name={user.role === "teacher" ? "birthday" : "age"}
                initialValue={
                  user.role === "teacher" ? moment(data?.birthday) : data?.age
                }
              >
                {user.role === "teacher" ? (
                  <DatePicker
                    format="YYYY-MM-DD"
                    showTime="true"
                    style={{ width: "100%" }}
                  />
                ) : (
                  <InputNumber min={0} max={100} />
                )}
              </Form.Item>
            </EditForm>
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            <EditForm
              content={genderList[data?.gender]}
              layout="horizontal"
              onSave={onSave}
            >
              <Form.Item name="gender" initialValue={data?.gender}>
                <Radio.Group>
                  <Radio value={1}>Male</Radio>
                  <Radio value={2}>Female</Radio>
                </Radio.Group>
              </Form.Item>
            </EditForm>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <EditForm content={data?.phone} layout="horizontal" onSave={onSave}>
              <Form.Item name="phone" initialValue={data?.phone}>
                <Input placeholder="Phone" />
              </Form.Item>
            </EditForm>
          </Descriptions.Item>
          <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>

          <Descriptions.Item label="Country">
            <EditForm
              content={data?.country}
              layout="horizontal"
              onSave={onSave}
            >
              <Form.Item name="country" initialValue={data?.country}>
                <Select>
                  {country?.map((item) => (
                    <Select.Option value={item.en} key={item.en}>
                      {item.en}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </EditForm>
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            <EditForm
              content={data?.address?.map((item) => item)}
              layout="horizontal"
              onSave={onSave}
            >
              <Form.Item
                name="address"
                initialValue={data?.address?.map((item) => item)}
              >
                <Cascader
                  options={address}
                  fieldNames={{
                    label: "name",
                    value: "name",
                    children: "children",
                  }}
                />
              </Form.Item>
            </EditForm>
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        {user.role === "teacher" ? (
          <TeacherProfile data={data} onSave={onSave} />
        ) : (
          <StudentProfile data={data} onSave={onSave} />
        )}
      </Card>
    </div>
  );
};

export default Profile;
