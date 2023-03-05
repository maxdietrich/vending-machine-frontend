import { Alert, Button, Input, Select, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import React from "react";
import { backendBaseUrl } from "../config";

const Signup = ({ closeSignupView, handleSignup }) => {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [role, setRole] = React.useState("BUYER");
  const [errorMessage, setErrorMessage] = React.useState();

  const performSignupRequest = async () => {
    const response = await fetch(`${backendBaseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, role }),
    });
    if (response.ok) {
      handleSignup();
    } else {
      const { message } = await response.json();
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <form onSubmit={performSignupRequest}>
      <Space direction="vertical" size="middle">
        <Input
          size="large"
          placeholder="Username"
          prefix={<UserOutlined />}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input.Password
          size="large"
          placeholder="Password"
          prefix={<LockOutlined />}
          onChange={(event) => setPassword(event.target.value)}
        />
        <Select
          size="large"
          defaultValue="BUYER"
          options={[
            { value: "BUYER", label: "Buyer" },
            { value: "SELLER", label: "Seller" },
          ]}
          style={{ width: '100%' }}
          onChange={(value) => setRole(value)}
        />
        {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
        <Space size="middle">
          <Button onClick={closeSignupView}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Signup
          </Button>
        </Space>
      </Space>
    </form>
  );
};

export default Signup;
