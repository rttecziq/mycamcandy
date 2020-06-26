import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $ :any;

@Component({
    templateUrl: 'search.component.html',
    styleUrls:['../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../assets/css/jquery-ui.css',
                '../../../assets/css/style.css',
                '../../../assets/css/responsive.css',
                '../../../assets/css/component.css',
    ]   
})

export class SearchComponent{

    errorMessages : string;

    searchUsers : any[];

    searchLiveTV : any[];

    searchVideos : any[];

    term : string;

    datasAvailable : number;

    constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) {

        this.errorMessages = "";

        this.searchUsers = [];

        this.searchLiveTV = [];

        this.searchVideos = [];

        this.datasAvailable = 0;

        this.route.queryParams.subscribe(params => {

            this.term = params['term'];

            let details = {term : this.term, skip : 0};

            this.searchUsers = [];

            this.searchLiveTV = [];

            this.searchVideos = [];

            this.searchAll('search', details);
    

        });

    }

    ngOnInit() {

        

    }

    searchAll(url, object) {

        this.requestService.postMethod(url, object) 
        .subscribe(

            (data : any) => {

                if (data.success == true) {
                    
                    this.searchUsers = data.data.users.data;
                    
                    this.searchLiveTV = data.data['live-tv'].data;

                    this.searchVideos = data.data['live-videos'].data;

                    if (data.data.length <= 0) {

                        this.datasAvailable = 0;

                    }


                } else {

                    this.errorMessages = data.error_messages;

                
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

            },
            
        );

    }


}