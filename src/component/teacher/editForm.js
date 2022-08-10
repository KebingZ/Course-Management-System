import { Button, Form } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useState } from "react";
import { FormRow } from "../courseStep1";

const EditForm = (props) => {
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  return (
    <div>
      {isEdit ? (
        <Form
          form={form}
          onFinish={(value) => {
            props.onSave(value);
            setIsEdit(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              form.submit();
            }
          }}
          initialValues={props.initialValues}
        >
          <FormRow style ={{marginTop: "-3px", marginLeft: "5px"}}>
            {props.children}
            <Button
              type={props.layout === "vertical" ? "default" : "link"}
              onClick={() => setIsEdit(false)}
              style={{marginRight: "10px", color: "red"}}
            >
              {props.layout === "vertical" ? "Cancel" : <CloseOutlined style={{color: "red"}}/>}
            </Button>
            <Button htmlType="submit" type={props.layout === "vertical" ? "default" : "link"} style={{marginLeft: "10px"}}>
              {props.layout === "vertical" ? "Save" : <CheckOutlined style={{color: "green", marginLeft: "-50px"}}/>}
            </Button>
          </FormRow>
        </Form>
      ) : (
        <div onDoubleClick={() => setIsEdit(true)}>{props.content}</div>
      )}
    </div>
  );
};

export default EditForm;
