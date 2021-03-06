/* eslint-disable @typescript-eslint/naming-convention */
export interface User{
    uid: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    notification?: boolean;
    reference?: string;
}

export interface GetUserData{
    id: string;
    name: string;
    img: string;
}
export interface UserData{
    uid: string;
    fullName: string;
    userName: string[];
    subsCriptions: number;
    reference?: string;
    subscribe?: boolean;
    awaitSubscribe?: boolean;
    img?: string;
}

export interface SubsCriptions{
    uid: string;
    subsCriptions: Subscription[];
    reference?: string;
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

export interface InvalidTokenTwitch{
    error: {
        error: string;
        status: number;
        message: string;
    };
}

export interface HistoryBackBtn{
    nameHistory: string;
    nameVar: string;
    initialValue: any;
    type: 'primitive' | 'ViewChild' | 'ViewChildren';
}

export interface SendOnsignal{
    external_id: string;
    id: string;
    recipients: number;
}
