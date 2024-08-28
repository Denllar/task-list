import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { columns } from "@/hooks";
import { UsersType } from "@/hooks/get-users";
import { TableStyles } from "./TableStyles";
import { Modal } from "./index";

interface DataTableProps {
  users: UsersType[];
  isLoading: boolean;
}
export const DataTable: React.FC<DataTableProps> = ({ users, isLoading }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [userModal, setUserModal] = React.useState<UsersType | null>(null);

  const openModal = (row: UsersType) => {
    setIsOpen(true);
    setUserModal(row);
  }

  return (
    <div className="mt-10">
      <DataGrid
        rows={users}
        columns={columns}
        disableColumnMenu={true}
        hideFooter={true}
        loading={isLoading}
        autoHeight={true}
        onRowClick={(obj) => openModal(obj.row)} // модальное окно
        sx={TableStyles}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} userModal={userModal!}/>
    </div>
  );
};
