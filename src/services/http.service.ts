import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {IAppointment} from './appointment.service';
import {from, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    const;
    url = '/appointment';

    constructor(public http: HttpClient) {
    }

    findAll() {
        return this.http.get(this.url, {});
    }

    add(item: IAppointment) {
        return this.http.post(this.url + '/add', item);
    }

    delete(id) {
        const path = `${1}/`;
        console.log('path', `${this.url}/delete/${id}`);
        return this.http.get(`${this.url}/delete/${id}`);
    }

    update(app) {
        const path = `${1}/`;
        const id = app._id;
        console.log('path...', `${this.url}/update/${id}`);
        return this.http.post(`${this.url}/update/${id}`, app);
    }

}


