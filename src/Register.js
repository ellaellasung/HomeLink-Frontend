import './Register.css';
import {
  Button,
  Form,
  Input,
  message
} from 'antd';
import { registerUser } from './api/api';
import { useNavigate } from 'react-router-dom';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const Register = () => {
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const onFinish = async (values) => {
    try {
      const data = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      console.log('Registration successful:', data);

      localStorage.setItem('token', data.token);

      navigate('/deviceList');

    } catch (err) {
      console.error('Registration failed:', err.message);
      message.error(`Registration failed: ${err.message}`);
    }
  };

  return (
    <div class="Register">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              type: 'name',
              message: 'The input is not valid Name',
            },
            {
              required: true,
              message: 'Please input your Name!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Register;