import { Button, Card, notification, Popconfirm, Space, Statistic } from "antd";
import React from "react";
import { backendBaseUrl } from "../config";
import DepositView from "./DepositView";
import ProductBuyView from "./ProductBuyView";
import ProductList from "./ProductList";

const BuyerView = ({ userId, logout }) => {
  const [products, setProducts] = React.useState([]);
  const [inBuyView, setInBuyView] = React.useState(false);
  const [inDepositView, setInDepositView] = React.useState();
  const [productToBuy, setProductToBuy] = React.useState(null);
  const [currentDeposit, setCurrentDeposit] = React.useState(null);
  const [sendNotification, notificationContextHolder] = notification.useNotification();

  const closeBuyViewAndNotifyUserOfChange = (change) => {
    setInBuyView(false);
    setTimeout(() => {
      sendNotification['success']({
        message: 'Thanks for your purchase!',
        description: change.length === 0 ? null : `Here is your change: ${change.join(',')}`,
        duration: null
      })
    }, 1000);
  }

  const loadProducts = () => {
    fetch(`${backendBaseUrl}/products`)
      .then((response) => response.json())
      .then((products) => setProducts(products));
  };

  const loadDeposit = async () => {
    const response = await fetch(`${backendBaseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.ok) {
      const { deposit } = await response.json();
      setCurrentDeposit(deposit);
    }
  };

  const resetDeposit = async () => {
    await fetch(`${backendBaseUrl}/reset`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    await loadDeposit();
  };

  const openBuyView = (productId) => {
    setProductToBuy(productId);
    setInBuyView(true);
  };

  React.useEffect(() => {
    loadProducts();
    loadDeposit();
  }, [userId, inBuyView, inDepositView]);

  return inBuyView ? (
    <ProductBuyView productId={productToBuy} setInBuyView={setInBuyView} closeAndNotifyUserOfChange={closeBuyViewAndNotifyUserOfChange} />
  ) : inDepositView ? (
    <DepositView setInDepositView={setInDepositView}/>
  ) : (
    <Space size="large" direction="vertical">
      {notificationContextHolder}
      <ProductList
        products={products}
        userId={userId}
        isBuyer={true}
        openBuyView={(productId) => openBuyView(productId)}
      />
      <Card>
        <Space size="small" direction="vertical">
          <Statistic
            title="Deposit"
            value={currentDeposit}
            loading={currentDeposit == null}
          />
          <Space>
            <Popconfirm
              title="Confirm deposit reset?"
              description="Are you sure you want to reset your deposit?"
              onConfirm={resetDeposit}
              okText="Yes"
              cancelText="No"
            >
              <Button>Reset</Button>
            </Popconfirm>
            <Button type="primary" onClick={() => setInDepositView(true)}>
              Deposit
            </Button>
          </Space>
        </Space>
      </Card>
      <Card>
        <Button onClick={logout}>Logout</Button>
      </Card>
    </Space>
  );
};

export default BuyerView;
