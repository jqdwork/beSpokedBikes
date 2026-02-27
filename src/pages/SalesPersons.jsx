import salesPersonApi from "../api/salesPersonsApi";
import { useQuery } from "@tanstack/react-query";
import { Box, Typography } from "@mui/material";
import Table from "../components/Table";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import EditSalesPersonModal from "../components/EditSalesPersonsModal";
import Notify from "../components/Notify";

const SalesPerson = () => {
  const [show, setShow] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [successM, setSuccessM] = useState("");

  const queryClient = useQueryClient();

  const {
    data: salesPersons,
    isLoading,
    error,
  } = useQuery({
    queryFn: salesPersonApi.getSalesPersons,
    queryKey: ["salesPersons"],
  });

  const {
    reset,
    isPending,
    error: mutateError,
    mutate,
  } = useMutation({
    mutationFn: ({ id, body }) => salesPersonApi.updateSalesPerson(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesPersons"] });
      setSuccessM("Sales Person updated successfully");
      setSelectedPerson(null);
      setShow(false);
    },
  });

  const handleEdit = (row) => {
    setSelectedPerson(row);
    setShow(true);
  };

  const handleClose = () => {
    reset();
    setShow(false);
    setSelectedPerson(null);
  };

  const handleSave = (values) => {
    if (!selectedPerson) return;

    const body = {
      ...values,
      id: selectedPerson.id,
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      phone: values.phone,
      startDate: values.startDate,
      terminationDate: values.terminationDate,
      manager: values.manager,
    };

    mutate({ id: selectedPerson.id, body });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

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
    {
      key: "terminationDate",
      header: "Termination Date",
      render: (row) => new Date(row.terminationDate).toLocaleDateString(),
    },
    {
      key: "manager",
      header: "Manager",
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
          Sales Persons
        </Typography>

        <Box />
      </Box>

      <Table columns={columns} data={salesPersons} />
      <Notify message={successM} onClose={() => setSuccessM("")} />
      <EditSalesPersonModal
        show={show}
        selectedPerson={selectedPerson}
        handleClose={handleClose}
        handleSave={handleSave}
        updating={isPending}
        error={mutateError?.error ? mutateError?.error.message : ""}
        salesPersons={salesPersons}
      />
    </Box>
  );
};
export default SalesPerson;
