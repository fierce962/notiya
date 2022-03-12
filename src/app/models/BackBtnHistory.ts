import { HistoryBackBtn } from './interface';

export class BackBtnHistory{
    private thisObject: object;

    private history: HistoryBackBtn[] = [];

    private controlUrl;

    constructor(thisObject: object, control: any){
        this.thisObject = thisObject;
        this.controlUrl = control;
    };

    backHistory(): void{
        const lastHistory = this.history.length;
        if(lastHistory !== 0){
            const lastValue = this.history[lastHistory - 1];
            this.history = this.history.filter(history=>{
                if(lastValue.nameHistory === history.nameHistory){
                    if(history.type === 'primitive'){
                        this.backHistoryPrimitive(history);
                    }else if(history.type === 'ViewChild'){
                        this.backHistoryViewChild(history);
                    }else{
                        this.backHistoryViewChildren(history);
                    }
                    return false;
                }else{
                    return true;
                }
            });
        }else{
            this.controlUrl.changeUrlwithMain();
        }
    }

    setColention(colection: HistoryBackBtn): void{
        let existColection = false;
        if(this.history.length !== 0){
            this.history.some(historyColection=>{
                if(colection.nameVar === historyColection.nameVar){
                    return existColection = true;
                }
            });
        }
        if(!existColection){
            this.history.push(colection);
        }
    }

    private backHistoryPrimitive(history: HistoryBackBtn): void{
        this.thisObject[history.nameVar] = history.initialValue;
    }

    private backHistoryViewChild(history: HistoryBackBtn): void{
        this.thisObject[history.nameVar].nativeElement.value = history.initialValue;
    }

    private backHistoryViewChildren(history: HistoryBackBtn): void{
        this.thisObject[history.nameVar].forEach(input=>{
            input.nativeElement.value = history.initialValue;
        });
    }
};
