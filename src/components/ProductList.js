import { Popconfirm, Space, Table, Typography } from "antd";
import React from 'react';
import { backendBaseUrl } from "../config";

const ProductList = ({
  products,
  userId,
  openEditView,
  reloadProducts,
  isBuyer,
  openBuyView
}) => {

  const deleteProduct = async (productId) => {
    const response = await fetch(`${backendBaseUrl}/products/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.ok) {
      reloadProducts();
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "productName",
      key: "name",
    },
    {
      title: "Amount available",
      dataIndex: "amountAvailable",
      key: "amountAvailable",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <Space size="middle">
          {userId === product.sellerId && (
            <Space size="middle">
              <Typography.Link onClick={() => openEditView(product._id)}>
                Edit
              </Typography.Link>
              <Popconfirm
                title="Confirm deletion?"
                description="Are you sure you wanna delete this product?"
                onConfirm={() => deleteProduct(product._id)}
                okText="Yes"
                cancelText="No"
              >
                <Typography.Link>Delete</Typography.Link>
              </Popconfirm>
            </Space>
          )}
          {isBuyer && (
            <Typography.Link onClick={() => openBuyView(product._id)}>Buy</Typography.Link>
          )}
        </Space>
      ),
    },
  ];
  return <Table dataSource={products} columns={columns} pagination={false} />;
};

export default ProductList;
