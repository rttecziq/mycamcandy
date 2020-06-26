import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from 'src/app/common/services/request.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/models/group';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any;

@Component({
    templateUrl: 'view-group.component.html',
    styleUrls:['../../../../../assets/css/bootstrap/css/bootstrap.css',
                '../../../../../assets/css/font-awesome/css/font-awesome.min.css',
                '../../../../../assets/css/jquery-ui.css',
                '../../../../../assets/css/mdb.css',
                '../../../../../assets/css/style.css',
                '../../../../../assets/css/responsive.css'
    ],
    /*host: {
        '(document:click)': 'onClick($event)',
    },*/
})

export class ViewGroupComponent{

    group_id : number;

    group_view : Group;

    errorMessages : string;
    
    group_members : any[];

    search_users : any;

    key_term : string;

    skipCount : number;

    constructor(public requestService : RequestService, public route : ActivatedRoute, public router : Router) {

        this.errorMessages = '';

        this.group_view = {
            live_group_id : 0,
            owner_id: 0,
            live_group_name: "",
            live_group_description: "",
            live_group_picture: "",
            live_group_status: 0,
            owner_name: "",
            picture: "",
            total_members: 0,
            is_owner: 0,
            date : ""

        }

        this.search_users = [];

        this.key_term = "";

        this.skipCount = 0;

        this.group_members = [];

        this.route.queryParams.subscribe(params => {

            this.group_id = params['id'];

            let details = {live_group_id : params['id']};

            this.loadGroup('groups/view', details);

        });

    }

    loadGroup(url, object) {

        this.requestService.postMethod(url, object)
        .subscribe(
            (data : any ) => {

                if (data.success == true) {

                    this.group_view = data.data.group_details; 

                    this.group_members = data.data.members; 

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

    clearParticipent() {

        console.log("participant..!");

    }

    deleteGroup(group_id) {

        this.requestService.postMethod("groups/delete", {live_group_id : group_id})
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

                    return this.router.navigate(['/create-group'])

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

    deleteRemoveMember(member_id, group_id) {

        this.requestService.postMethod("groups/members/remove", {member_id : member_id, live_group_id : group_id})
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

                    $("#close_member_"+member_id).click();

                    $("#member_"+member_id).remove();

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

    onKeyEnterParticipant(searchValue : string, skipCount = 0) { 

        this.skipCount  = skipCount;
        
        this.key_term = searchValue;

        this.requestService.postMethod("searchUser", {term : searchValue , skip : this.skipCount, live_group_id : this.group_id})
        .subscribe(

            (data : any) =>  {

                if(data.success) {

                    if (this.skipCount > 0) {

                        this.search_users = [...this.search_users, ...data.data];
                    
                    } else {

                        this.search_users = data.data;
                    
                    }

                    this.skipCount += data.data.length;

                } else {

                    this.search_users = [];
                    
                }

            },

            (err : HttpErrorResponse) => {

                console.log("Search! Oops something went wrong..!");

            }
            
        );

    }

    onKeyEscSearch(event) {

        if (event.keyCode === 27) {

            this.search_users = [];

            $("#group_search_results").val("");

        }
    }

    onClick(event) {

        this.search_users = [];

        $("#group_search_results").val("");
        
    }

    addMemberDetails(user_id, idx) {

        this.requestService.postMethod("groups/members/add", {member_id : user_id , live_group_id : this.group_id})
        .subscribe(

            (data : any) =>  {

                if(data.success) {

                    this.search_users[idx]['is_member'] = 1;

                } else {

                    console.log("Add Member error");
                }

            },

            (err : HttpErrorResponse) => {

                console.log("Search! Oops something went wrong..!");

            }
            
        );

    }

    removeMemberDetails(user_id,idx) {

        this.requestService.postMethod("groups/members/remove", {member_id : user_id , live_group_id : this.group_id})
        .subscribe(

            (data : any) =>  {

                if(data.success) {

                    this.search_users[idx]['is_member'] = 0;

                } else {

                    console.log("Remove Member error");
                    
                }

            },

            (err : HttpErrorResponse) => {

                console.log("Search! Oops something went wrong..!");

            }
            
        );

    }

    showMoreMembers() {

        this.onKeyEnterParticipant(this.key_term, this.skipCount);
    }
}