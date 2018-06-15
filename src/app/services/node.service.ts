import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Headers } from "@angular/http"
import { Observable, Observer} from "rxjs";
import { catchError } from 'rxjs/operators';
import { Node } from '../../models/node.model';
import * as io from 'socket.io-client'

@Injectable()
export class NodeService {

    readonly serverURL = "http://18.233.151.213/";
    socket;
    observer: Observer<Array<Node>>;

    constructor(private http: HttpClient){ }

    getDataStream(): Observable<Array<Node>>{
        this.socket = io.connect(this.serverURL);
        this.socket.on('data', (res) => {
            this.observer.next(res);
        });

        return this.createObservable();
    }

    getNodes(): Observable<Array<Node>> {
        return this.http.get<Array<Node>>(this.serverURL+'api/getnodes')
        .pipe(
            catchError((err, caught) => {console.error(err); return Observable.throw(err.error || 'Server error')})
        );
        
    }

    updateNode(node): Observable<any>{
        let httpOptions = {
            headers: new HttpHeaders()
                .set('Accept', 'application/json')
        }
        return this.http.put(this.serverURL+'api/updatenode', node, httpOptions)
        .pipe(
            catchError((err, caught) => {console.error(err); return Observable.throw(err || 'Server error')})
        );
    }

    createObservable() : Observable<Array<Node>> {
        return new Observable(observer => {
          this.observer = observer;
        });
    }

    closeResources(): void {
        this.socket.close();
        io.disconnect();
    }

}