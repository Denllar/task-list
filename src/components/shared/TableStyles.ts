import { gridClasses } from "@mui/x-data-grid";
export const TableStyles = () => {
  
  const tableStyles = {
    boxShadow: 2,
    border: 2,
    borderColor: "#292524",
    "& .MuiDataGrid-cell": {
      color: "white",
      borderColor: "#292524",
    },
    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#0c0a09",
      color: "#75706c",
      fontWeight: "bold",
    },
    "& .MuiDataGrid-sortIcon": {
      opacity: 1,
      color: "white",
    },
    "& .MuiDataGrid-filler": {
      backgroundColor: "#0c0a09",
      color: "#75706c",
    },

    [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]: {
      outline: "none",
    },
    [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
      {
        outline: "none",
      },

    "& .MuiDataGrid-row:hover": {
      backgroundColor: "#1b1816",
    },
  };

  return tableStyles;
};
