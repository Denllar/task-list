import {Api} from "@/services/api-client";

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
}
export const getUsers = async (search: string) => {
    try {
        const {users} = await Api.searchUsers.searchUsers(search);
        users.map((item: UsersType) => {
            if (item.address && typeof item.address === 'object') {
                item.address = `${item.address.city} ${item.address.address}`
            }
        })
        return users;
    } catch (err) {
        console.error(err);
    }
}