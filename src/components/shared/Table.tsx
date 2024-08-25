import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "@/hooks";
import { UsersType } from "@/hooks/get-users";
import { TableStyles } from "./TableStyles";

interface DataTableProps {
  users: UsersType[];
  isLoading: boolean;
}
export const DataTable: React.FC<DataTableProps> = ({ users, isLoading }) => {
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
        sx={TableStyles}
      />
    </div>
  );
};
