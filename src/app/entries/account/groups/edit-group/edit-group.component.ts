import { Component, AfterViewInit } from '@angular/core';
import { GroupCreate } from 'src/app/models/groupcreate';
import { RequestService } from 'src/app/common/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

declare var $: any;

@Component({
    templateUrl: 'edit-group.component.html',
    styleUrls:['../../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../../assets/css/jquery-ui.css',
                '../../../../../assets/css/mdb.css',
                '../../../../../assets/css/style.css',
                '../../../../../assets/css/responsive.css'
    ]   
})

export class EditGroupComponent{

    group_id : number;

    group_details : GroupCreate;

    errorMessages : string;

    image : File;

    picture : string;
    
    constructor(public requestService : RequestService, public route : ActivatedRoute, public router : Router) {

        this.errorMessages = '';

        this.group_details = {
            live_group_id : 0,
            name: "",
            description: "",
            picture: "",
        }

        this.route.queryParams.subscribe(params => {

            this.group_id = params['id'];

            let details = {live_group_id : params['id']};

            this.loadGroup('groups/view', details);

        });

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

    loadGroup(url, object) {

        this.requestService.postMethod(url, object)
        .subscribe(
            (data : any ) => {

                if (data.success == true) {
                    console.log(data.data.group_details);

                    this.group_details = {
                        live_group_id : data.data.group_details.live_group_id,
                        name: data.data.group_details.live_group_name,
                        description: data.data.group_details.live_group_description,
                        picture: "",
                    }

                    this.picture = data.data.group_details.live_group_picture;

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


    editGroup(form : NgForm) {
    
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