import './Login.css';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input } from 'antd';
import { loginUser } from './api/api';
import { useNavigate } from 'react-router-dom';

const App = () => {

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      
      const data = await loginUser({
        email: values.email,
        password: values.password,
      });

      localStorage.setItem('token', data.token);

      navigate('/deviceList');

    } catch (err) {
      console.error('Login failed:', err.message);
      alert(`Login failed: ${err.message}`);
    }
  };
  return (
    <div class="Login">
    <Form
      name="login"
      initialValues={{ remember: true }}
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Please input your Email!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Log in
        </Button>
        or <a href="/Register">Register now!</a>
      </Form.Item>
    </Form>
    </div>
  );
};
export default App;