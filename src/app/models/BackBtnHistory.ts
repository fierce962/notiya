import { HistoryBackBtn } from './interface';

export class BackBtnHistory{
    private thisObject: object;

    private history: HistoryBackBtn[] = [];

    constructor(thisObject: object){
        this.thisObject = thisObject;
    };

    backHistory(): void{
        const lastHistory = this.history.length;
        if(lastHistory !== 0){
            const lastValue = this.history[lastHistory - 1];
            this.history.forEach(history=>{
                if(history.type === 'primitive'){
                    this.backHistoryPrimitive(lastValue, history);
                }else if(history.type === 'ViewChild'){
                    this.backHistoryViewChild(lastValue, history);
                }else{
                    this.backHistoryViewChildren(lastValue, history);
                }
            });
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

    private backHistoryPrimitive(lastValue: HistoryBackBtn, history: HistoryBackBtn): void{
        if(lastValue.nameHistory === history.nameHistory){
            this.thisObject[history.nameVar] = history.initialValue;
        }
    }

    private backHistoryViewChild(lastValue: HistoryBackBtn, history: HistoryBackBtn): void{
        if(lastValue.nameHistory === history.nameHistory){
            this.thisObject[history.nameVar].nativeElement.value = history.initialValue;
        }
    }

    private backHistoryViewChildren(lastValue: HistoryBackBtn, history: HistoryBackBtn): void{
        if(lastValue.nameHistory === history.nameHistory){
            this.thisObject[history.nameVar].forEach(input=>{
                input.nativeElement.value = history.initialValue;
            });
        }
    }

};
