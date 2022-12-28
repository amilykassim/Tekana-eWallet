export interface UserDTO {
    id?: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
    trackId?: string;
}
