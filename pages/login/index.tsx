import React from 'react';
import 'antd/dist/antd.css';
import './index.sass';
import { Form, Input, Button, Checkbox, PageHeader } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { doLogin } from '../../api/login';
import Link from 'next/link'

const Login = () => {
  
  return (
    <div className="form-wrapper">
    <Form
      name="normal_login"
      className="login-form"
      onFinish={doLogin}
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
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>

      <Form.Item>
        <Button style={{marginBottom: '10px' }} type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        Or <Link href="/register">don't have account?</Link>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Login