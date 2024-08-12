import { ApiRoutes } from './constants';

export const filterUsers = async () => { 
  return await fetch(`https://dummyjson.com/users${ApiRoutes.FILTER_USERS}`).then((res) => {
    return res.json()
  });
}; //пока не реализовал