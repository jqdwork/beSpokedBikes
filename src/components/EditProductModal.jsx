import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

const EditProductModal = ({
  show,
  selectedProduct,
  handleClose,
  handleSave,
  updating,
  error,
  products,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: "",
      manufacturer: "",
      style: "",
      purchasePrice: "",
      salePrice: "",
      qtyOnHand: "",
      commissionPercentage: "",
    },
  });

  useEffect(() => {
    if (!show) return;
    reset({
      name: selectedProduct?.name ?? "",
      manufacturer: selectedProduct?.manufacturer ?? "",
      style: selectedProduct?.style ?? "",
      purchasePrice: selectedProduct?.purchasePrice ?? "",
      salePrice: selectedProduct?.salePrice ?? "",
      qtyOnHand: selectedProduct?.qtyOnHand ?? "",
      commissionPercentage: selectedProduct?.commissionPercentage ?? "",
    });
  }, [show, selectedProduct, reset]);

  const normalize = (v) => (v ?? "").trim().toLowerCase();
  const isDuplicateName = (products, currentId, name) =>
    (products ?? []).some(
      (product) =>
        product.id !== currentId && normalize(product.name) === normalize(name),
    );

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Product</DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name is required",
              validate: (value) =>
                !isDuplicateName(products, selectedProduct?.id, value) ||
                "Name already exists",
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="manufacturer"
            control={control}
            rules={{ required: "Manufacturer is required" }}
            render={({ field }) => (
              <TextField label="Manufacturer" {...field} />
            )}
          />
          <Controller
            name="style"
            control={control}
            rules={{ required: "Style is required" }}
            render={({ field }) => <TextField label="Style" {...field} />}
          />
          <Controller
            name="purchasePrice"
            control={control}
            rules={{
              required: "Purchase price is required",
              validate: (v) => (!isNaN(Number(v)) ? true : "Must be a number"),
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Purchase Price"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="salePrice"
            control={control}
            rules={{
              required: "Sale price is required",
              validate: (v) => (!isNaN(Number(v)) ? true : "Must be a number"),
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Sale Price"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="qtyOnHand"
            control={control}
            rules={{
              required: "Qty is required",
              validate: (v) =>
                Number.isInteger(Number(v)) ? true : "Must be an integer",
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Quantity On Hand"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="commissionPercentage"
            control={control}
            rules={{
              required: "Commission % is required",
              validate: (v) => (!isNaN(Number(v)) ? true : "Must be a number"),
            }}
            render={({ field, fieldState }) => (
              <TextField
                label="Commission Percentage"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {!!error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={updating}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit((values) => handleSave(values))}
          disabled={updating || !selectedProduct || !isDirty}
        >
          {updating ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductModal;
