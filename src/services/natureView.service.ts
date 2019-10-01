import { NatureView } from "../models/NatureView.model";
import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Storage } from '@ionic/storage';

@Injectable()
export class NatureViewService{
    
    private natureViewList: NatureView[];
    natureViewList$ = new Subject<NatureView[]>();

    constructor(public storage: Storage){}

    emitList(){
        this.natureViewList$.next(this.natureViewList);
    }

    addNatureView(view: NatureView){
        this.natureViewList.push(view);
        this.saveList();
        this.emitList();
    }

    saveList(){
        this.storage.set('views', this.natureViewList);
    }

    fetchList(){
        this.storage.get('views').then(
        (list) => {
            if(list && list.length){
                this.natureViewList = list.slice();
            }
            this.emitList();
        });
    }
}