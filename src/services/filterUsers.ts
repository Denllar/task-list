import { ApiRoutes } from './constants';

export const filterUsers = async (key: string, search: string) => { 
  return await fetch(`https://dummyjson.com/users${ApiRoutes.FILTER_USERS}${key}&value=${search}`).then((res) => {
    return res.json() 
  });
};