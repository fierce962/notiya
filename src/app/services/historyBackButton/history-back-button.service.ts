/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Injectable, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackButtonEmitter } from '@ionic/angular/providers/platform';
import { HistoryActions, HistoryValue } from 'src/app/models/interface';
import { Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HistoryBackButtonService {

  private historyActions: HistoryActions = {};

  constructor(private platform: Platform, private router: Router, private zone: NgZone) {
    this.platform.backButton.subscribe(()=>{
      this[`getListener${this.router.url}`]();
    });
  }

  getListener(): BackButtonEmitter{
    return this.platform.backButton;
  }

  createListener(): Observable<any>{
    this[`getListener${this.router.url}`] = () => {
      this[`getObservable${this.router.url}`].next();
    };
    const history: Subject<any> = new Subject();
    return this[`getObservable${this.router.url}`] = history;
  }

  backHistory(thisObject: object, optionalAction: HistoryValue = undefined): void{
    let historyAction: HistoryValue;

    if(optionalAction === undefined){
      const history = this.historyActions[this.router.url];
      historyAction = history.pop();
    }else{
      historyAction = optionalAction;
    }
    if(historyAction.typeVar === 'ViewChildren'){
      if(history.length !== 0 && this.historyActions[this.router.url] !== undefined){
        // eslint-disable-next-line radix
        const positionInput: number = parseInt(historyAction.nameVar.split('-')[1]);
        const nameVar: string = historyAction.nameVar.split('-')[0];
        let change = false;
        thisObject[nameVar].forEach((input, index)=>{
          if(index === positionInput && input.nativeElement.value !== ''){
            input.nativeElement.value = '';
            input.nativeElement.setFocus();
            change = true;
          };
        });
        if(!change){
          this.backHistory(thisObject);
        }
      }else{
        console.log('cambiar la ruta');
      }
    }else if(historyAction.typeVar !== 'ElementRef'){
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      thisObject[historyAction.nameVar] = historyAction.valueInitial;
      if(historyAction.action !== 'none'){
        //agregar la funcion que ara el focues
      }
      if(historyAction.optionalAction !== undefined){
        this.backHistory(thisObject, historyAction.optionalAction);
      }
    }else{
      thisObject[historyAction.nameVar].nativeElement.value = historyAction.valueInitial;
      thisObject[historyAction.nameVar].nativeElement.setFocus();
    };
  }

  setHistory(variableName: string,
    initialValue: any,
    throwAction: 'none' | 'setFocus',
    vartype: 'string' | 'number' | 'ElementRef' | 'boolean' | 'ViewChildren',
    optionalActions?: HistoryValue): void{

    if(this.historyActions[this.router.url] === undefined){
      this.historyActions[this.router.url] = [
        this.buildHistyObject(variableName, initialValue, throwAction, vartype, optionalActions)
      ];
    }else{
      this.historyActions[this.router.url].push(
        this.buildHistyObject(variableName, initialValue, throwAction, vartype, optionalActions)
      );
    };
  }

  private buildHistyObject(varName: string,
    initialValue: any,
    throwAction: 'none' | 'setFocus',
    vartype: 'string' | 'number' | 'ElementRef' | 'boolean' | 'ViewChildren',
    optionalActions?: HistoryValue): HistoryValue{

    return {
      nameVar: varName,
      valueInitial: initialValue,
      action: throwAction,
      typeVar: vartype,
      // eslint-disable-next-line object-shorthand
      optionalAction: optionalActions
    };
  };
}
