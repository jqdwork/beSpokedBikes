import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import salesApi from "../api/salesApi";
import Table from "../components/Table";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import { BarChart } from "@mui/x-charts";

const quarterKey = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
};

const commissionOf = (sale) => {
  const price = Number(sale.product?.salePrice ?? 0);
  const percent = Number(sale.product?.commissionPercentage ?? 0);
  return (price * percent) / 100;
};

const buildReport = (sales, selectedQuarter) => {
  const list = Array.isArray(sales) ? sales : [];

  const quarterSet = new Set();
  const totalsByPerson = new Map();

  for (const s of list) {
    const q = quarterKey(s.date);
    if (!q) continue;
    quarterSet.add(q);

    if (selectedQuarter && q !== selectedQuarter) continue;

    const sp = s.salesPerson;
    const name = sp ? `${sp.firstName} ${sp.lastName}` : "Unknown";
    const commission = commissionOf(s);

    if (!totalsByPerson.has(name)) {
      totalsByPerson.set(name, { name, salesCount: 0, totalCommission: 0 });
    }

    const row = totalsByPerson.get(name);
    row.salesCount += 1;
    row.totalCommission += commission;
  }

  const summaryRows = Array.from(totalsByPerson.values())
    .map((r) => ({
      ...r,
      totalCommission: Number(r.totalCommission.toFixed(2)),
    }))
    .sort((a, b) => b.totalCommission - a.totalCommission);

  return {
    quarters: Array.from(quarterSet).sort(),
    labels: summaryRows.map((r) => r.name),
    values: summaryRows.map((r) => r.totalCommission),
    summaryRows,
  };
};

const Report = () => {
  const [quarter, setQuarter] = useState("");

  const { data: sales = [] } = useQuery({
    queryKey: ["sales"],
    queryFn: salesApi.getSales,
  });

  const { quarters, labels, values, summaryRows } = useMemo(
    () => buildReport(sales, quarter),
    [sales, quarter],
  );

  const columns = [
    {
      key: "name",
      header: "Sales Person",
    },
    {
      key: "salesCount",
      header: "Number of Sales",
    },
    {
      key: "totalCommission",
      header: "Total Commission ($)",
      render: (row) => `$${row.totalCommission.toFixed(2)}`,
    },
  ];

  return (
    <Box mt={4}>
      <Box
        mb={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">Quarterly Commission Report</Typography>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Quarter</InputLabel>
          <Select
            label="Quarter"
            value={quarter}
            onChange={(e) => setQuarter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {quarters.map((quarter) => (
              <MenuItem key={quarter} value={quarter}>
                {quarter}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {labels.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No sales for this period.
        </Typography>
      ) : (
        <BarChart
          height={360}
          xAxis={[{ scaleType: "band", data: labels }]}
          series={[{ data: values, label: "Commission ($)" }]}
        />
      )}
      <Divider sx={{ my: 4 }} />
      <Box mt={3}>
        <Typography variant="h6" mb={1} textAlign="center">
          Summary
        </Typography>{" "}
        <Table columns={columns} data={summaryRows} />
      </Box>
    </Box>
  );
};

export default Report;
