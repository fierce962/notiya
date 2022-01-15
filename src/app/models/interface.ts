export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
}

export interface UserData{
    uid: string;
    fullName: string;
    userName: string[];
    subsCriptions: number;
}
