import React from "react";
import {useDebounce} from "react-use";
import { getUsers } from "@/hooks";
import { UsersType } from "./get-users";

export const useUsers = (search: string) => {
  const [users, setUsers] = React.useState<UsersType[] | []>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  useDebounce(
    () => {
      const fetchUsers = async () => {
        setUsers([]);
        setIsLoading(true);

        const data = await getUsers(search);

        setUsers(prev => [...prev, ...data]);
        setIsLoading(false);
      };
      fetchUsers();
    },
    300,
    [search]
  );

  return { users, isLoading };
};
