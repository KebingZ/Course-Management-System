import React, { useState, useEffect } from "react";
import 'antd/dist/antd.min.css';
import { Form, Input, Button, Checkbox, Radio, Row } from "antd";
import Icon, { UserOutlined, LockOutlined } from '@ant-design/icons';
// import { Link } from 'next/link'
import CryptoJS from "crypto-js";
import axios from "axios";

// class Login extends React.Component {
    
//     render() {
//         const { getFieldDecorator } = this.props.form;
//         const handleSubmit = (e) => {
//               e.preventDefault();
//               this.props.form.validateFields((err, values) => {
//                 if (!err) {
//                   console.log('Received values of form: ', values);
//                 }
//               });
//             }
//       return (
//         <Form onSubmit={this.handleSubmit} className="login-form">
//           <Form.Item>
//             {getFieldDecorator('userName', {
//               rules: [{ required: true, message: 'Please input your username!' }],
//             })(
//               <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
//             )}
//           </Form.Item>
//           <Form.Item>
//             {getFieldDecorator('password', {
//               rules: [{ required: true, message: 'Please input your Password!' }],
//             })(
//               <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
//             )}
//           </Form.Item>
//           <Form.Item>
//             {getFieldDecorator('remember', {
//               valuePropName: 'checked',
//               initialValue: true,
//             })(
//               <Checkbox>Remember me</Checkbox>
//             )}
//             <a className="login-form-forgot" >Forgot password</a>
//             <Button type="primary" htmlType="submit" className="login-form-button">
//               Log in
//             </Button>
//             Or <a >register now!</a>
//           </Form.Item>
//         </Form>
//       );
//     }
//   }
  
//   export default Login;

export default function Login() {
    const [form] = Form.useForm();
    const [ password, setPassword ] = useState("");
    const [ role, setRole ] = useState("Student")
    const [post, setPost] = useState(null);

    const baseURL = "http://cms.chtoma.com/api/login";

    const psChange = (e) => {
        setPassword(e.target.value);
    
        // form.setFieldsValue({password: pwd})
    }
    const roleChange = (e) => {
        setRole(e.target.value);
        
    }

    const handleSubmit = (values) => {
        values.password = CryptoJS.MD5(values.password).toString();
        values.roleValue=role;
    }

    const onFinish = (values) => {

        axios.post(baseURL, {
            "email": values.email,
            "password": values.password,
            "role": values.role
        }).then((response) => {
            setPost(response.data)
        })
        window.localStorage.setItem(`${values.email}`, {
            "email": values.email,
            "password": values.password,
            "role": values.role 
        });
        console.log(post===null ? "no post" : post)
    }
    return (
        <Row type="flex" justify="center" style={{minHeight:'100vh'}}>

                <Form form={form} className="login-form" style={{ margin:200, position:'flex', width:'40%'}} onFinish={onFinish}>
                    {/* <Form.Item name="title"> */}
                        <h2 style={{textAlign: "center", fontWeight:600, fontSize:30}} >COURSE MANAGEMENT ASSISTANT</h2>
                    {/* </Form.Item> */}
                    <Form.Item name="roleValue">
                        <Radio.Group defaultValue={role} value={role} onChange={roleChange}>
                        <Radio.Button value="Student">Student</Radio.Button>
                        <Radio.Button value="Teacher">Teacher</Radio.Button>
                        <Radio.Button value="Manager">Manager</Radio.Button>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }, {type: "email", message:"Please confirm the type of your email!"}]}>
                        <Input prefix={<UserOutlined /> } placeholder="Please input email!" />
                    </Form.Item>

                    <Form.Item name="password" rules={[{ required: true,  message: 'Please input your password!' }, { max:16,min:4, message:'The size of the password must be between 4 and 16 digits!'},
            { pattern:new RegExp('^[0-9a-zA-Z_]{1,}$','g'),message:'Only allow numbers, letters and underscores!'}]}>
                        <Input prefix={<LockOutlined />} type="password" placeholder="Please input password!" value={password} onChange={psChange}/>
                    </Form.Item>

                    <Form.Item>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{width:"100%"}} onClick={handleSubmit}>Sign in</Button>    
                    </Form.Item>
                    {/* <Form.Item>
                        <div>No account? <a href="">Sign up!</a></div>
                    </Form.Item> */}
        </Form>

</Row>
       
    )
}