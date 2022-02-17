/* eslint-disable @typescript-eslint/naming-convention */
export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    notification?: boolean;
}

export interface UserData{
    uid: string;
    fullName: string;
    userName: string[];
    subsCriptions: number;
    subscribe?: boolean;
}

export interface SubsCriptions{
    uid: string;
    subsCriptions: Subscription[];
}

export interface Subscription{
    uid: string;
    url: string;
    notificationId: string;
}

export interface ListNotification{
    uidCreator: string;
    token: string;
}

export interface SendNotification{
    uid?: string;
    title: string;
    message: string;
    url: string;
    userName: string;
    urlAuth?: string;
    thumbnail?: string;
    date?: string;
}

export interface CreateTokenTwitch{
    access_token: string;
    expires_in: number;
    scope: string[];
    token_type: string;
}

export interface PerfilesTwitch{
    data: PerfilesData[];
}
interface PerfilesData{
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    created_at: Date;
}
