import { Button, Space } from "antd";
import React from "react";
import { backendBaseUrl } from "../config";
import ProductList from "./ProductList";
import ProductEditView from "./ProductEditView";

const SellerView = ({ userId, logout }) => {
  const [products, setProducts] = React.useState([]);
  const [inEditView, setInEditView] = React.useState(false);
  const [productToEdit, setProductToEdit] = React.useState(null);

  const loadProducts = () => {
    fetch(`${backendBaseUrl}/products`)
      .then((response) => response.json())
      .then((products) => setProducts(products));
  };

  const openEditView = (productId) => {
    setProductToEdit(productId);
    setInEditView(true);
  };

  React.useEffect(() => {
    if (!inEditView) loadProducts();
  }, [userId, inEditView]);

  return inEditView ? (
    <ProductEditView productId={productToEdit} setInEditView={setInEditView} />
  ) : (
    <Space size="large" direction="vertical">
      <ProductList
        products={products}
        userId={userId}
        openEditView={(productId) => openEditView(productId)}
        reloadProducts={loadProducts}
      />
      <Button onClick={() => openEditView(null)}>Create new product</Button>
      <Button onClick={logout}>Logout</Button>
    </Space>
  );
};

export default SellerView;
