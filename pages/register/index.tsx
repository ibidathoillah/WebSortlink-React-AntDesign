import React from 'react';
import 'antd/dist/antd.css';
import '../login/index.sass';
import { Form, Input, Button, Checkbox, PageHeader, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Link from 'next/link'
import { doRegister } from '../../api/register';

const Register = () => {
  
  return (
    <div className="form-wrapper">
    <Form
      name="normal_login"
      className="login-form"
      onFinish={doRegister}
    >
    <PageHeader
      className="site-page-header"
      title="Short.ly"
      subTitle="makes simple!"
    />
      <Form.Item
        name="email"
        rules={[
          {
            type: "email",
            required: true,
            message: 'Please input your Email!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password
          placeholder="Password"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
      </Form.Item>

      <Form.Item
        name="confirm"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('The two passwords that you entered do not match!');
            },
          }),
        ]}
      >
        <Input.Password
            placeholder="Confirm Password"
          prefix={<LockOutlined className="site-form-item-icon" />}
        />
      </Form.Item>
      <Form.Item
        name="agreement"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject('Should accept agreement'),
          },
        ]}
      >
        <Checkbox>
          I have read the <a onClick={()=>{message.info("free to register, we protect your privacy and data")}} href="#read">agreement</a>
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button  style={{marginBottom: '10px' }}  type="primary" htmlType="submit" className="login-form-button">
          Register
        </Button>
        Or <Link href="/login">already have account?</Link>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Register