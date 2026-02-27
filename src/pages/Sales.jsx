import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import salesApi from "../api/salesApi.js";
import productsApi from "../api/productsApi.js";
import customersApi from "../api/customersApi.js";
import salespersonsApi from "../api/salesPersonsApi.js";
import Table from "../components/Table.jsx";
import { Box, Typography, Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CreateModal from "../components/CreateModal.jsx";
import Notify from "../components/Notify.jsx";

const Sales = () => {
  const queryClient = useQueryClient();
  const [show, setShow] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [successM, setSuccessM] = useState("");

  const {
    data: sales,
    isLoading: loadingList,
    error: errorList,
  } = useQuery({
    queryFn: salesApi.getSales,
    queryKey: ["sales"],
  });
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: productsApi.getProducts,
  });
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getCustomers,
  });
  const { data: salespersons } = useQuery({
    queryKey: ["salespersons"],
    queryFn: salespersonsApi.getSalesPersons,
  });
  const createSaleMutation = useMutation({
    mutationFn: (body) => salesApi.createSale(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      setSuccessM("Sale created successfully");
      setShow(false);
    },
  });

  const handleCreateSale = (body) => {
    createSaleMutation.mutate(body);
  };

  const columns = [
    {
      key: "product",
      header: "Product",
      render: (row) => row.product?.name,
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) => `${row.customer?.firstName} ${row.customer?.lastName}`,
    },
    {
      key: "date",
      header: "Date",
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => `$${Number(row.product?.salePrice).toFixed(2)}`,
    },
    {
      key: "salesPerson",
      header: "Salesperson",
      render: (row) =>
        `${row.salesPerson?.firstName} ${row.salesPerson?.lastName}`,
    },
    {
      key: "commission",
      header: "Commission",
      render: (row) => {
        const price = row.product?.salePrice ?? 0;
        const percent = row.product?.commissionPercentage ?? 0;
        const commission = (price * percent) / 100;
        return `$${commission.toFixed(2)}`;
      },
    },
  ];
  const filteredSales = useMemo(() => {
    const start = from ? new Date(`${from}T00:00:00`) : null;
    const end = to ? new Date(`${to}T23:59:59.999`) : null;

    return (sales ?? []).filter((row) => {
      const d = new Date(row.date);
      if (start && d < start) return false;
      if (end && d > end) return false;
      return true;
    });
  }, [sales, from, to]);

  if (loadingList) return <p>Loading...</p>;
  if (errorList) return <p>{errorList.message}</p>;

  return (
    <Box>
      <Box display="grid" alignItems="center" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{ justifySelf: "start" }}
          onClick={() => setShow(true)}
        >
          Create Sale
        </Button>

        <Typography variant="h3" textAlign="center">
          Sales
        </Typography>

        <Box />
      </Box>
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          label="From"
          type="date"
          size="small"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="To"
          type="date"
          size="small"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Button
          variant="outlined"
          onClick={() => {
            setFrom("");
            setTo("");
          }}
        >
          Clear
        </Button>
      </Box>
      <Table columns={columns} data={filteredSales} />
      <Notify message={successM} onClose={() => setSuccessM("")} />
      <CreateModal
        show={show}
        handleClose={() => setShow(false)}
        products={products}
        customers={customers}
        salespersons={salespersons}
        createError={
          createSaleMutation?.error ? createSaleMutation?.error.message : ""
        }
        handleCreateSale={handleCreateSale}
      />
    </Box>
  );
};
export default Sales;
