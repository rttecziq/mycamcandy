import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Event } from './model/event';
import * as socketIo from 'socket.io-client';
import { AppService } from '../../app.service';

@Injectable({
    // we declare that this service should be created
    // by the root application injector. 
    providedIn: 'root',
  })

export class ChatSocketService {

    SERVER_URL : string;

    site_settings : any;

    constructor (private appService : AppService) {

        // this.site_settings = this.appService.appDetails();

        //setTimeout(()=>{

            this.site_settings = JSON.parse(localStorage.getItem('site_settings'));

            let chat_socket_url = (this.site_settings).filter(obj => {
                return obj.key === 'chat_socket_url'
            });
    
            this.SERVER_URL = chat_socket_url.length > 0 ? chat_socket_url[0].value : '';

       // }, 2000);


    }
    
    private socket;


    public initSocket(room){
        this.socket = socketIo(this.SERVER_URL, { secure: true , query: "room="+room});
    }

    public send(message){
        this.socket.emit('message', message);
    }

    public checkViewersCnt(cnt){
        this.socket.emit('check-video-streaming', cnt);
    }

    public getViewersCnt() {

        return new Observable<any>(observer => {
            this.socket.on('video-streaming-status', (data: any) => observer.next(data));
        });

    }

    public onMessage() {
        return new Observable<any>(observer => {
            this.socket.on('message', (data: any) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}