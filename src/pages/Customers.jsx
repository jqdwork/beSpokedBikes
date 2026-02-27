import customersApi from "../api/customersApi";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import Table from "../components/Table";

const Customer = () => {
  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryFn: customersApi.getCustomers,
    queryKey: ["customers"],
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (row) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: "address",
      header: "Address",
    },
    {
      key: "phone",
      header: "Phone Number",
    },
    {
      key: "startDate",
      header: "Start Date",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
  ];

  return (
    <Box>
      <Box display="grid" alignItems="center" mb={3}>
        <Typography variant="h3" textAlign="center">
          Customers
        </Typography>

        <Box />
      </Box>

      <Table columns={columns} data={customers} />
    </Box>
  );
};
export default Customer;
