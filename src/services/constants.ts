import { user } from "@/constants";

export const ApiRoutes = {
    SELECT_USERS: `?select=${user.join()}`,
    FILTER_USERS: `/filter?select=${user.join()}&key=`,
}