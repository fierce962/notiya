import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BackButtonEmitter } from '@ionic/angular/providers/platform';
import { Observable } from 'rxjs';
import { HistoryActions, HistoryValue } from 'src/app/models/interface';

@Injectable({
  providedIn: 'root'
})
export class HistoryBackButtonService {

  private historyActions: HistoryActions = {};

  constructor(private platform: Platform) { }

  getListener(): BackButtonEmitter{
    return this.platform.backButton;
  }

  test(currentUrl: string, thisObject: object, optionalAction: HistoryValue = undefined){
    let historyAction: HistoryValue;
    if(optionalAction === undefined){
      const history = this.historyActions[currentUrl];
      historyAction = history.pop();
    }else{
      historyAction = optionalAction;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    thisObject[historyAction.nameVar] = historyAction.valueInitial;
    if(historyAction.action !== 'none'){
      //agregar la funcion que ara el focues
    }
    if(historyAction.optionalAction !== undefined){
      this.test(currentUrl, thisObject, historyAction.optionalAction);
    }
  }

  setHistory(currentUrl: string,
    variableName: string,
    initialValue: any,
    throwAction: 'none' | 'setFocus',
    optionalActions?: HistoryValue): void{

    if(this.historyActions[currentUrl] === undefined){
      this.historyActions[currentUrl] = [
        this.buildHistyObject(variableName, initialValue, throwAction, optionalActions)
      ];
    }else{
      this.historyActions[currentUrl].push(
        this.buildHistyObject(variableName, initialValue, throwAction, optionalActions)
      );
    };
    console.log(this.historyActions);
  }

  private buildHistyObject(varName: string,
    initialValue: any,
    throwAction: 'none' | 'setFocus',
    optionalActions?: HistoryValue): HistoryValue{

    return {
      nameVar: varName,
      valueInitial: initialValue,
      action: throwAction,
      // eslint-disable-next-line object-shorthand
      optionalAction: optionalActions
    };
  };
}
