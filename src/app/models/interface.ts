export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    playerId?: string;
}

export interface UserData{
    uid: string;
    fullName: string;
    userName: string[];
    subsCriptions: number;
    subscribe?: boolean;
    playerId?: string;
}

export interface SubsCriptions{
    uid: string;
    subsCriptions: Subscription[];
}

export interface Subscription{
    uid: string;
    date: Date;
    notificationId: string;
}

export interface ListNotification{
    uidUser: string;
    uidCreator: string;
    token: string;
}

export interface SendNotification{
    uid: string;
    title: string;
    message: string;
    url: string;
}
export interface ReceivedNotification{
    title: string;
    message: string;
    url: string;
    userName: string;
}
