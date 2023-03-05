import { Alert, Button, Input, Space, Typography } from "antd";
import React from "react";
import { backendBaseUrl } from "../config";

const ProductBuyView = ({ productId, setInBuyView, closeAndNotifyUserOfChange }) => {
  const [amount, setAmount] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState();

  const buyProduct = async () => {
    const response = await fetch(`${backendBaseUrl}/buy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: Number(amount), productId }),
    });
    if (response.ok) {
      const { change } = await response.json();
      closeAndNotifyUserOfChange(change);
    } else {
      const { message } = await response.json();
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical" size="small">
        <Typography.Text className="label">Amount</Typography.Text>
        <Input
          size="large"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </Space>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon />}
      <Space direction="horizontal" size="middle">
        <Button onClick={() => setInBuyView(false)}>Cancel</Button>
        <Button type="primary" onClick={buyProduct}>
          Buy
        </Button>
      </Space>
    </Space>
  );
};

export default ProductBuyView;
