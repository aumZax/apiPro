export interface RegisterPostRequest {
    type: string;
    name:          string;
    id:       number;
    username: string;
    password: string;
    conpassword : string;
    newpassword : string;
    profile : string;
}