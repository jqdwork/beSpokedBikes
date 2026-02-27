import { useState } from "react";
import productsApi from "../api/productsApi";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Box, Typography, Button } from "@mui/material";
import Table from "../components/Table";
import EditProductModal from "../components/EditProductModal";
import Notify from "../components/Notify";

const Product = () => {
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successM, setSuccessM] = useState("");

  const queryClient = useQueryClient();
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryFn: productsApi.getProducts,
    queryKey: ["products"],
  });
  const {
    mutate,
    error: mutateError,
    reset,
    isPending,
  } = useMutation({
    mutationFn: ({ id, body }) => productsApi.updateProduct(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setSuccessM("Product updated successfully");
      setSelectedProduct(null);
      setShow(false);
    },
  });

  const handleEdit = (row) => {
    setSelectedProduct(row);
    setShow(true);
  };

  const handleClose = () => {
    reset();
    setSelectedProduct(null);
    setShow(false);
  };

  const handleSave = (values) => {
    if (!selectedProduct) return;

    const body = {
      ...values,
      id: selectedProduct.id,
      name: values.name,
      manufacturer: values.manufacturer,
      style: values.style,
      purchasePrice: Number(values.purchasePrice),
      salePrice: Number(values.salePrice),
      qtyOnHand: Number(values.qtyOnHand),
      commissionPercentage: Number(values.commissionPercentage),
    };

    mutate({ id: selectedProduct.id, body });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const columns = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "manufacturer",
      header: "Manufacturer",
    },
    {
      key: "style",
      header: "Style",
    },
    {
      key: "purchasePrice",
      header: "Purchase Price",
      render: (row) => `$${Number(row.purchasePrice ?? 0).toFixed(2)}`,
    },
    {
      key: "salePrice",
      header: "Sale Price",
      render: (row) => `$${Number(row.salePrice ?? 0).toFixed(2)}`,
    },
    {
      key: "qtyOnHand",
      header: "Quantity On Hand",
    },
    {
      key: "commissionPercentage",
      header: "Commission %",
      render: (row) => `${row.commissionPercentage}%`,
    },
    {
      key: "actions",
      render: (row) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEdit(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <Box display="grid" alignItems="center" mb={3}>
        <Typography variant="h3" textAlign="center">
          Products
        </Typography>

        <Box />
      </Box>

      <Table columns={columns} data={products} />
      <Notify message={successM} onClose={() => setSuccessM("")} />
      <EditProductModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
        selectedProduct={selectedProduct}
        updating={isPending}
        error={mutateError?.error ? mutateError?.error.message : ""}
        products={products}
      />
    </Box>
  );
};
export default Product;
