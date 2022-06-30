export type RowDataLogin = {
    id: number
    email: string
    password: string
    id_user: number
};
export type ResultLoginData = RowDataLogin[];

export type RowDataUser = {
    id_user: number
    name: string
    expires_in: number
    access_token: string
};
export type ResultUserData = RowDataUser[];