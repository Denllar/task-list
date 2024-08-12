import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { gridClasses } from "@mui/x-data-grid";
import { columns, useChangeAddress } from "@/hooks";

export const DataTable: React.FC = () => {
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const changeAddress = useChangeAddress();

  React.useEffect(() => {
    const fetchUsers = async () => {
      const data = await changeAddress;
      setUsers(data);
      setIsLoading(false);
    };
    fetchUsers();
  }, [changeAddress]);

  return (
    <div className="mt-10">
      <DataGrid
        rows={users}
        columns={columns}
        disableColumnMenu={true}
        hideFooter={true}
        loading={isLoading}
        autoHeight={true}
        onRowClick={(row) => console.log(row)} // модальное окно
        onColumnResize={(params) => console.log(params)}
        sx={{
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

          [`& .${gridClasses.cell}:focus, & .${gridClasses.cell}:focus-within`]:
            {
              outline: "none",
            },
          [`& .${gridClasses.columnHeader}:focus, & .${gridClasses.columnHeader}:focus-within`]:
            {
              outline: "none",
            },

          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#1b1816",
          },
        }}
      />
    </div>
  );
};
