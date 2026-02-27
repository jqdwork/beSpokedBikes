import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";

const CreateModal = ({
  show,
  handleClose,
  products = [],
  customers = [],
  salespersons = [],
  createError = "",
  handleCreateSale,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      productId: "",
      customerId: "",
      salesPersonId: "",
    },
  });

  useEffect(() => {
    if (show) {
      reset({
        productId: "",
        customerId: "",
        salesPersonId: "",
      });
    }
  }, [show, reset]);

  const onSubmit = (values) => {
    const body = {
      id: 0,
      productId: Number(values.productId),
      customerId: Number(values.customerId),
      salesPersonId: Number(values.salesPersonId),
      date: new Date().toISOString(),
    };

    handleCreateSale(body);
  };

  return (
    <Dialog open={show} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ pr: 6 }}>
        Create Sale
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
          <FormControl fullWidth>
            <InputLabel>Product</InputLabel>
            <Controller
              name="productId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} label="Product">
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name} — ${product.salePrice}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Customer</InputLabel>
            <Controller
              name="customerId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} label="Customer">
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Sales Person</InputLabel>
            <Controller
              name="salesPersonId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select {...field} label="Salesperson">
                  {salespersons.map((sp) => (
                    <MenuItem key={sp.id} value={sp.id}>
                      {sp.firstName} {sp.lastName}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {!!createError && (
            <Typography color="error" variant="body2">
              {createError}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateModal;
