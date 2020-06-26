import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ : any;

@Component({
    templateUrl: 'card-details.component.html',
    styleUrls:['../../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../../assets/css/jquery-ui.css',
                '../../../../../assets/css/style.css',
                '../../../../../assets/css/responsive.css'
    ]   
})

export class CardDetailsComponent implements OnInit{

    card_details : any[];

    errorMessages : string;

    constructor(private router: Router, private requestService : RequestService) {

        this.card_details = [];

        this.errorMessages = "";

    }

    ngOnInit() {

        this.cardDetails("card_details", "");

    }

    cardDetails(url, object) {

        this.requestService.postMethod(url, object) 
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        this.card_details = data.data;   
    
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

    setAsDefault(card_id) {

        if(confirm('Are you sure want to change the Card as Default ?')) {

            this.requestService.postMethod("default_card", {card_id : card_id}) 
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: "Your selected card has been changed to Default Card.",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.cardDetails("card_details", "");
    
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

    deleteCard(card_id) {

        if(confirm('Are you sure want to delete the Card ?')) {

            this.requestService.postMethod("delete_card", {card_id : card_id}) 
            .subscribe(

                (data : any) => {

                    if (data.success == true) {

                        $.toast({
                            heading: 'Success',
                            text: "Your card has been deleted successfully.",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });

                        this.cardDetails("card_details", "");
    
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
}
