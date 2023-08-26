import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = 'adminremit263@2020';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    public name: string;

    constructor() { }

    encrypt(data) {
        // console.log(data);
        
        data = CryptoJS.AES.encrypt(data, SECRET_KEY);
        let encData = data.toString();
        return encData;
    }

    decrypt(data) {
        if(data){
            data = CryptoJS.AES.decrypt(data, SECRET_KEY);
            let decData = data.toString(CryptoJS.enc.Utf8);
            return decData;
        }
    }

    setName(data){
        localStorage.sci = data[0];
        localStorage.scur = data[1];
        localStorage.rcur = data[2];
        localStorage.samt = data[3];
    }

    getName(){
        let myData = [
            localStorage.getItem('sci'),
            localStorage.getItem('scur'),
            localStorage.getItem('rcur'),
            localStorage.getItem('samt')
        ];

        return myData;
    }
}
