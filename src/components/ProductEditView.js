import { Alert, Button, Input, Space, Typography } from "antd";
import React from "react";
import { backendBaseUrl } from "../config";

const ProductEditView = ({ productId, setInEditView }) => {
  const [productName, setProductName] = React.useState(null);
  const [amountAvailable, setAmountAvailable] = React.useState(null);
  const [cost, setCost] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState(null);

  React.useEffect(() => {
    if (productId) {
      fetch(`${backendBaseUrl}/products/${productId}`)
        .then((response) => response.json())
        .then((product) => {
          setProductName(product.productName);
          setAmountAvailable(product.amountAvailable);
          setCost(product.cost);
        });
    }
  }, [productId]);

  const save = async () => {
    const payload = {
      productName,
      amountAvailable: Number(amountAvailable),
      cost: Number(cost),
    };
    const response = productId
      ? await fetch(`${backendBaseUrl}/products/${productId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        })
      : await fetch(`${backendBaseUrl}/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(payload),
        });
    if (response.ok) {
      setInEditView(false);
    } else {
      const { message } = await response.json();
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
  };

  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical" size="small">
        <Typography.Text className="label">Product name</Typography.Text>
        <Input
          size="large"
          value={productName}
          onChange={(event) => setProductName(event.target.value)}
        />
      </Space>
      <Space direction="vertical" size="small">
        <Typography.Text className="label">Amount available</Typography.Text>
        <Input
          size="large"
          value={amountAvailable}
          onChange={(event) => setAmountAvailable(event.target.value)}
        />
      </Space>
      <Space direction="vertical" size="small">
        <Typography.Text className="label">Cost</Typography.Text>
        <Input
          size="large"
          value={cost}
          onChange={(event) => setCost(event.target.value)}
        />
      </Space>
      {errorMessage && <Alert message={errorMessage} type="error" showIcon/>}
      <Button type="primary" onClick={save}>
        Save
      </Button>
    </Space>
  );
};

export default ProductEditView;
