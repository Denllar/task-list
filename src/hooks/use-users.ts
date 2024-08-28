import React from "react";
import {useDebounce} from "react-use";
import { getUsers } from "@/hooks";

export const useUsers = (search: string) => {
  const [users, setUsers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useDebounce(
    () => {
      const fetchUsers = async () => {
        setIsLoading(true);
        const data = await getUsers(search);
        setUsers(data);
        setIsLoading(false);
      };
      fetchUsers();
    },
    300,
    [search]
  );

  return { users, isLoading };
};
