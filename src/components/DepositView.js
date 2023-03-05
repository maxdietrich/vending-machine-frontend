import { Alert, Button, Input, Space, Typography} from 'antd';
import React from 'react';
import { backendBaseUrl } from '../config';

const DepositView = ({ setInDepositView }) => {

  const [amount, setAmount] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState();

  const deposit = async () => {
    const response = await fetch(`${backendBaseUrl}/deposit`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ amount: Number(amount)})
    });
    if (response.ok) {
      setInDepositView(false);
    } else {
      const { message } = await response.json();
      setErrorMessage(Array.isArray(message) ? message[0] : message);
    }
  }

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
        <Button onClick={() => setInDepositView(false)}>Cancel</Button>
        <Button type="primary" onClick={deposit}>
          Deposit
        </Button>
      </Space>
    </Space>
  )
}

export default DepositView;