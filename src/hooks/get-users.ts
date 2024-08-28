import {Api} from "@/services/api-client";
import { column } from "@/constants";

export type AddressType = {
    address: string,
    city: string,
    state: string,
    stateCode: string,
    postalCode: string,
    coordinates: {
        lat: number,
        lng: number,
    },
    country: string
}
export type UsersType = {
    id: number,
    firstName: string,
    lastName: string,
    maidenName: string,
    age: number,
    gender: string,
    phone: string,
    address: AddressType | string
    height: number,
    weight: number,
    email: string,
}
export const getUsers = async (search: string) => {
    const filterUsers = [];
    try {
        if (search) {
            for (const key of column.slice(1)) {
                const {users} = await Api.filterUsers.filterUsers(key, search);
                filterUsers.push(...users)
            }
        }

        const {users} = await Api.searchUsers.searchUsers(search);
        filterUsers.push(...users)
        filterUsers.map((item: UsersType) => {
            if (item.address && typeof item.address === 'object') {
                item.address = `${item.address.city} ${item.address.address}`
            }
        })
        return filterUsers;
    } catch (err) {
        console.error(err);
    }
}