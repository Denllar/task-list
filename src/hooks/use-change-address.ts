import {Api} from "../services/api-client";

type adressType = {
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
export type usersType = {
    id: number,
    firstName: string,
    lastName: string,
    maidenName: string,
    age: number,
    gender: string,
    phone: string,
    address: adressType | string
}
export const useChangeAddress = async () => {
    try {
        const {users} = await Api.users.searchUsers();
        users.map((item: usersType) => {
            if (item.address && typeof item.address === 'object') {
                item.address = `${item.address.city} ${item.address.address}`
            }
        })
        return users;
    } catch (err) {
        console.error(err);
    }
}