import { Alert, Button, Input, Space } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { backendBaseUrl } from "../config";
import React from "react";

const Login = ({ handleLogin, setInSignup }) => {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState();

  const performLoginRequest = async () => {
    const response = await fetch(`${backendBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    if (response.ok) {
      const { accessToken } = await response.json();
      localStorage.setItem("accessToken", accessToken);
      handleLogin();
    } else {
      setErrorMessage("Login failed. Please check your credentials");
    }
  };

  return (
    <form onSubmit={performLoginRequest}>
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
        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
          />
        )}
        <Space size="middle">
        <Button onClick={() => setInSignup(true)} >Create new user</Button>
        <Button type="primary" htmlType="submit">
          Login
        </Button>
        </Space>
      </Space>
    </form>
  );
};

export default Login;
