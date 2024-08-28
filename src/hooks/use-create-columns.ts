import {column} from "@/constants";
import { GridColDef } from '@mui/x-data-grid';

const columns: GridColDef[] = column.map((item) => {
  return {
    field: item,
    headerName: item[0].toUpperCase() + item.slice(1).replace(/([A-Z])/g, " $1"),
    width: item === "id" || item === "age" ? 75 : 130,
    minWidth: 50,
    sortable: (item === "phone" ? false : true),
  };
});

columns.push({
  field: "fullName",
  headerName: "Full name",
  description: "This column has a value getter and is not sortable.",
  width: 160,
  valueGetter: (_, row) =>
    `${row.firstName || ""} ${row.lastName || ""} ${row.maidenName || ""}`,
});

export {columns}