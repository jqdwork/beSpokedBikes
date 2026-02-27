import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditSalespersonModal = ({
  show,
  selectedPerson,
  handleClose,
  handleSave,
  updating,
  error,
  salesPersons,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      startDate: "",
      terminationDate: "",
      manager: "",
    },
  });
  const toDateInputValue = (value) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

  useEffect(() => {
    if (!show) return;
    if (!selectedPerson) return;

    reset({
      firstName: selectedPerson.firstName ?? "",
      lastName: selectedPerson.lastName ?? "",
      address: selectedPerson.address ?? "",
      phone: selectedPerson.phone ?? "",
      startDate: toDateInputValue(selectedPerson.startDate) ?? "",
      terminationDate: toDateInputValue(selectedPerson.terminationDate) ?? "",
      manager: selectedPerson.manager ?? "",
    });
  }, [show, selectedPerson, reset]);

  const normalize = (v) => (v ?? "").trim().toLowerCase();
  const isDuplicateSalesperson = (firstName, lastName) => {
    const currentId = selectedPerson?.id;

    return (salesPersons ?? []).some((sp) => {
      if (sp.id === currentId) return false;

      return (
        normalize(sp.firstName) === normalize(firstName) &&
        normalize(sp.lastName) === normalize(lastName)
      );
    });
  };

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Edit Sales Person
        <IconButton
          onClick={handleClose}
          aria-label="close"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="firstName"
            control={control}
            rules={{
              required: "First name is required",
              validate: () => {
                const { firstName, lastName } = getValues();
                return (
                  !isDuplicateSalesperson(firstName, lastName) ||
                  "Salesperson already exists"
                );
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="First Name"
                {...field}
                value={field.value ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{
              required: "Last name is required",
              validate: () => {
                const { firstName, lastName } = getValues();
                return (
                  !isDuplicateSalesperson(firstName, lastName) ||
                  "Salesperson already exists"
                );
              },
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Last Name"
                {...field}
                value={field.value ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            rules={{
              required: "address is required",
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Address"
                {...field}
                value={field.value ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            name="phone"
            control={control}
            rules={{ required: "Phone number is required" }}
            render={({ field }) => (
              <TextField
                label="Phone"
                {...field}
                value={field.value ?? ""}
                fullWidth
              />
            )}
          />
          <Controller
            name="startDate"
            control={control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <TextField
                label="Start Date"
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                {...field}
                value={field.value ?? ""}
                fullWidth
              />
            )}
          />
          <Controller
            name="terminationDate"
            control={control}
            rules={{ required: "Termination date is required" }}
            render={({ field }) => (
              <TextField
                label="Termination Date"
                slotProps={{ inputLabel: { shrink: true } }}
                type="date"
                {...field}
                value={field.value ?? ""}
                fullWidth
              />
            )}
          />
          <Controller
            name="manager"
            control={control}
            render={({ field }) => (
              <TextField
                label="Manager"
                {...field}
                value={field.value ?? ""}
                fullWidth
              />
            )}
          />
          {!!error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}{" "}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={updating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit((values) => handleSave(values))}
          disabled={updating || !selectedPerson || !isDirty}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSalespersonModal;
