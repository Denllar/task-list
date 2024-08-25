import { ApiRoutes } from './constants';

export const searchUsers = async (search: string) => { 
  return await fetch(`https://dummyjson.com/users${search ? ApiRoutes.FILTER_USERS + search : ApiRoutes.SELECT_USERS}`).then((res) => {
    return res.json() 
  });
};