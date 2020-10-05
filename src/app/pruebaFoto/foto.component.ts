import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular';

import * as imagepicker from "nativescript-imagepicker";
import * as imageSourceModule from "tns-core-modules/image-source";
import * as fs from "tns-core-modules/file-system";
import { ImageSource } from 'tns-core-modules/image-source';
import { AuthService } from '../utils/servicios/auth.service';
import * as bghttp from "nativescript-background-http";
import { Config } from '../utils/config';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'foto',
    templateUrl: './foto.component.html',
    styleUrls: ['./foto.component.css']
})

export class FotoComponent implements OnInit {
	constructor(private routerEx: RouterExtensions,  private authService: AuthService, private http: HttpClient) { }

	ngOnInit() { }

public bstring ="";
public saveImage = "";
public picHeight = 0; 
public imagen = null;

isBusy: boolean = false;
	BtnDispo: boolean = true;

    getPicture() { 
        var milliseconds = (new Date).getTime();
        var that = this;
        let context = imagepicker.create({
            mode:"single"
        });
        context
        .authorize()
        .then(function() {
            return context.present();
        }).then(function(selection) {
                selection.forEach(function(selected) {
                    const imgPhoto = new ImageSource();
                    imgPhoto.fromAsset(selected).then((imgSrc) => {
                        if(imgSrc) {
                            that.bstring  = imgSrc.toBase64String("jpg");
                            const mil = new Date().getTime();
                            const folder = fs.knownFolders.documents();
                            const path = fs.path.join(folder.path, `SaveImage${mil}.png`);
                            that.imagen = imgPhoto.saveToFile(path, "png");
                            console.log(that.imagen);
                            that.saveImage = path;
                            that.picHeight = imgSrc.height;  
                            that.savePicture(folder)
                        } else {
                            alert("Image source is bad.");
                        }
                         
                    });
                });
            }).catch(function (e) {
                 console.log(e);
            });
    } 

    savePicture(e)
    {
        this.isBusy = true;
        const imageString =  e;

        
        const data = {
            foto: imageString,
            Description: "ff",
        };

        var session = bghttp.session("file-upload");
        var request = {
        url: Config.apiUrl + '/foto',
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
            "File-Name": "Test.png"
        },
        description: "{ 'uploading': " + "Test.png" + " }"
            };
        let params = [{
            name: "foto", mimeType: "image/jpeg", filename: this.saveImage
        }, {
            name: "dd", value: "Aqui esta la data"
        },
        ];
        var task = session.multipartUpload(params, request);
        task.on("progress", logEvent);
        task.on("error", logEvent);
        task.on("complete", logEvent);
        task.on("responded", logEvent);
        task.on("cancelled", logEvent);
        function logEvent(e) 
        {
            console.log(e);
            console.log("----------------");
            console.log('Status: ' + e.eventName);
            if (e.totalBytes !== undefined) 
            {
                console.log('current bytes transfered: ' + e.currentBytes);
                console.log('Total bytes to transfer: ' + e.totalBytes);
            }
            this.isBusy = false;
        }
} 

}