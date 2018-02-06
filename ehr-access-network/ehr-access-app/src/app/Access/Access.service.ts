import { Injectable } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs/Observable';
import { Access } from '../org.acme.biznet';
import 'rxjs/Rx';

// Can be injected into a constructor
@Injectable()
export class AccessService {

	
		private NAMESPACE: string = 'Access';
	



    constructor(private dataService: DataService<Access>) {
    };

    public getAll(): Observable<Access[]> {
        return this.dataService.getAll(this.NAMESPACE);
    }

    public getAsset(id: any): Observable<Access> {
      return this.dataService.getSingle(this.NAMESPACE, id);
    }

    public addAsset(itemToAdd: any): Observable<Access> {
      return this.dataService.add(this.NAMESPACE, itemToAdd);
    }

    public updateAsset(id: any, itemToUpdate: any): Observable<Access> {
      return this.dataService.update(this.NAMESPACE, id, itemToUpdate);
    }

    public deleteAsset(id: any): Observable<Access> {
      return this.dataService.delete(this.NAMESPACE, id);
    }

}
