import { Component, OnInit } from '@angular/core';
import { RequestService } from 'src/app/common/services/request.service';
import { NgForm } from '@angular/forms';
import { GroupCreate } from 'src/app/models/groupcreate';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

declare var $: any;

@Component({
    templateUrl: 'create-group.component.html',
    styleUrls:['../../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../../assets/css/jquery-ui.css',
                '../../../../../assets/css/mdb.css',
                '../../../../../assets/css/style.css',
                '../../../../../assets/css/responsive.css',
    ]   
})

export class CreateGroupComponent implements OnInit{

    image : File;

    picture : string;

    group_details : GroupCreate;
    
    errorMessages : string;

    constructor(public requestService : RequestService, public router : Router) {
        this.group_details = {
            live_group_id : 0,
            name: "",
            description: "",
            picture: "",
        }

        this.picture = "../../../../../assets/img/pro-bg.jpg";
    }

    ngOnInit() {


    }

    triggerFileField() {

        $("#picture").click();

    }

    handlePicture(files: FileList) {

        this.image = files.item(0);

        var reader = new FileReader();
        
        reader.onload = (event: any) => {
          
            this.picture = event.target.result;

        }
        reader.readAsDataURL(files.item(0));

    }


    createGroup(form : NgForm) {

        if (this.image !== undefined && this.image !== null) {

            form.value['picture'] =  this.image;

        } else {

            $.toast({
                heading: 'Error',
                text: "Please choose any one of the image",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });

            return false;

        }

    
        this.requestService.postMethod('groups/save', form.value)
            .subscribe(
                (data : any ) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: data.message,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        return this.router.navigate(['/view-group'], {queryParams : {id : data.group_id}})

                    } else {

                        this.errorMessages = data.error_messages;

                        $.toast({
                            heading: 'Error',
                            text: this.errorMessages,
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });
                        
                    }

                },

                (err : HttpErrorResponse) => {

                    this.errorMessages = 'Oops! Something Went Wrong';

                    $.toast({
                        heading: 'Error',
                        text: this.errorMessages,
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });

                }

            );
    }

}