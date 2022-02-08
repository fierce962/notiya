import { AppLauncher } from '@capacitor/app-launcher';

export class OpenAplications{
    private url: string;
    private authorizedUrl: string[] = ['youtube', 'twitch'];

    constructor(url: string){
        this.url = url;
        this.checkUrl();
    }

    checkUrl(): string{
        let check = '';
        this.authorizedUrl.some(authorized => {
            const include = this.url.includes(authorized);
            if(include){
                check = authorized;
                return true;
            }
        });
        return check;
    }

    async checkCanOpenUrl(checkUrl: string, urlAplication: string){
        const { value } = await AppLauncher.canOpenUrl({ url: `com.google.android.${checkUrl}` });
        if(value){
            await AppLauncher.openUrl({ url: urlAplication });
        }else{
            alert(value);
        }
    };

};
