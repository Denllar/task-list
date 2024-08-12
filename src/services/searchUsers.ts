import { ApiRoutes } from './constants';

export const searchUsers = async () => { 
  return await fetch(`https://dummyjson.com/users${ApiRoutes.SELECT_USERS}`).then((res) => {
    return res.json()
  });
};