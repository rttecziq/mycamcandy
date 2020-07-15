import { Component, ElementRef, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';

import {Register} from '../../../models/register';
import { BlockScrollStrategy } from '@angular/cdk/overlay';

declare var $: any ;

@Component({
    templateUrl: 'register.component.html',
    styleUrls:[
        './register.component.css'        
    ]
})

export class RegisterComponent implements AfterViewInit{

    errorMessages : string;
    model : Register;
    id_proof : File;
    id_proof_image : string;
    holding_id_proof_image : string;
    holding_id_proof : File;
    uType : string; //The user is streamer / viewer
    user_availability : string;
    formstep : string;

    constructor(private userService : UserService, private router : Router, private route : ActivatedRoute) { 
        this.formstep = '';
        this.errorMessages = '';       
        this.id_proof_image = "../../../../assets/img/pro-img.jpg";
        this.holding_id_proof_image = "../../../../assets/img/pro-img.jpg";
        this.user_availability = "";

        this.model = {
            name: "",
            modelname: "",
            dob: "",
            email: "",
            email_confirmation: "",
            password: "",
            password_confirmation :"",
            gender: "",
            first_name: "",
            last_name: "",
            othername: "",
            official_document: "",
            id_proof : null,
            holding_id_proof: null,
            payment_method: "",
            payoneer_email: "",
            payoneer_email_confirmation: "",	
            check_by_mail_address: "",
            check_by_mail_city: "",
            check_by_mail_state: "",
            check_by_mail_zip: null,
            check_by_mail_country: "",
            bank_name: "",
            routing_number: "",
            account_number: "",
            tax_id: "",
            agree_signup: "",
            performer_signup: ""
    
        };
        this.uType = 'creator';

    }

    ngAfterViewInit(){
        /*$.getScript('../../../../assets/js/script.js',function(){
        });
        $.getScript('../../../../assets/js/custom-file-input.js',function(){
        });
        $.getScript('../../../../assets/js/classie.js',function(){
        });
        $.getScript('../../../../assets/js/form.js',function(){
        }); */

        $(".payoneer-paxum").hide();
        $(".check-by-mail").hide();
        $(".direct-bank-deposit").hide();

        $('#payment_method').change(function(){
            if($('#payment_method').val() == 'Payoneer') {
               $(".payoneer-paxum").show();
               $(".check-by-mail").hide();
               $(".direct-bank-deposit").hide();
            } 
             if($('#payment_method').val() == 'Paxum') {
               $(".payoneer-paxum").show();
               $(".check-by-mail").hide();
               $(".direct-bank-deposit").hide();
            } 
            if($('#payment_method').val() == 'Check by mail') {
               $(".check-by-mail").show();
               $(".payoneer-paxum").hide();
               $(".direct-bank-deposit").hide();
            } 
            if($('#payment_method').val() == 'Direct bank deposit') {
               $(".payoneer-paxum").hide();
               $(".check-by-mail").hide();
               $(".direct-bank-deposit").show();
            }
            if($('#payment_method').val() == 'Choose payout method') {
               $(".payoneer-paxum").hide();
               $(".check-by-mail").hide();
               $(".direct-bank-deposit").hide();
            }
        });

        let current_fs, next_fs, previous_fs; //fieldsets
        let opacity;
        
        $(".next").click(function() {
            //this.formstep = $(this).attr('id');

            current_fs = $(this).parent();
            next_fs = $(this).parent().next();
            //Add Class Active
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
            
            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({opacity: 0}, {
                step: function(now) {
                // for making fielset appear animation
                opacity = 1 - now;
                
                    current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                    });
                    next_fs.css({'opacity': opacity});
                },
                duration: 600
            });
        });
        
        $(".previous").click(function() {
        
            current_fs = $(this).parent();
            previous_fs = $(this).parent().prev();
            
            //Remove class active
            $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
            
            //show the previous fieldset
            previous_fs.show();
            
            //hide the current fieldset with style
            current_fs.animate({opacity: 0}, {
                step: function(now) {
                    // for making fielset appear animation
                    opacity = 1 - now;
                    
                    current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                    });
                    previous_fs.css({'opacity': opacity});
                },
                duration: 600
            });
        });
            
            $('.radio-group .radio').click(function(){
                $(this).parent().find('.radio').removeClass('selected');
                $(this).addClass('selected');
            });

    }

    checkModelExist(name) {
        this.user_availability = '';
        this.model.name = name.toLowerCase();
            if( this.model.name.length > 3 && this.model.name.match(/^([a-z0-9]{4,})$/) ) {
                this.userService.checkModelExist(this.model.name)
                    .subscribe(
                        (data : any) => {
                            if (data.success == true) {
                                this.user_availability = "<p class='text-success'>Username Available</p>";
                            } else {
                                this.user_availability = "<p class='text-danger'>Username not available</p>";
                            }            
                        },

                        (err : HttpErrorResponse) => {
                            this.errorMessages = 'Oops! something went wrong...!';
                            $.toast({
                                heading: 'Error',
                                text: this.errorMessages,
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
    

    handleIdProof(files: FileList) {
        this.id_proof= files.item(0);
        if(!files.item(0).type.match('image')) {
            $.toast({
                heading: 'Warning',
                text: "Please choose image with extensions .png, .jpg, .jpeg",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });
            return false;
        }

        var reader = new FileReader();        
        reader.onload = (event: any) => {          
            this.id_proof_image = event.target.result;
        }
        reader.readAsDataURL(files.item(0));
    }

    handleHoldingIdProof(files: FileList) {
        this.holding_id_proof= files.item(0);
        if(!files.item(0).type.match('image')) {
            $.toast({
                heading: 'Warning',
                text: "Please choose image with extensions .png, .jpg, .jpeg",
            // icon: 'error',
                position: 'top-right',
                stack: false,
                textAlign: 'left',
                loader : false,
                showHideTransition: 'slide'
            });

            return false;
        }

        var reader = new FileReader();        
        reader.onload = (event: any) => {          
            this.holding_id_proof_image = event.target.result;
        }
        reader.readAsDataURL(files.item(0));
    }

    display_toast(title, message) {
        $.toast({
            heading: title,
            text: message,
            position: 'top-right',
            stack: false,
            textAlign: 'left',
            loader : false,
            showHideTransition: 'slide'
        });

        
    }

    

    modelRegistration(form : NgForm) {     
		
		if (form.value['name'] == undefined || form.value['name'] == '' || form.value['name'] == null) {
            this.display_toast("Error", "Enter username");
            return false;
        }

		if (form.value['modelname'] == undefined || form.value['modelname'] == '' || form.value['modelname'] == null) {
            this.display_toast("Error", "Model name field is required");
            return false;
        }
		
		if (form.value['dob'] == undefined || form.value['dob'] == '' || form.value['dob'] == null) {
            this.display_toast("Error", "DOB field is required");
            return false;
        }
		
		if (form.value['email'] == undefined || form.value['email'] == '' || form.value['email'] == null) {
            this.display_toast("Error", "Email field is required");
            return false;
        }
		
		if (form.value['email_confirmation'] == undefined || form.value['email_confirmation'] == '' || form.value['email_confirmation'] == null) {
            this.display_toast("Error", "Email Confirm field is required");
            return false;
        }
		if (form.value['password'] == undefined || form.value['password'] == '' || form.value['password'] == null) {
            this.display_toast("Error", "Password field is required");
            return false;
        }
		if (form.value['password_confirmation'] == undefined || form.value['password_confirmation'] == '' || form.value['password_confirmation'] == null) {
            this.display_toast("Error", "Password confirmation field is required");
            return false;
        }
		if (form.value['gender'] == undefined || form.value['gender'] == '' || form.value['gender'] == null) {
            this.display_toast("Error", "Gender field is required");
            return false;
        }
		if (form.value['first_name'] == undefined || form.value['first_name'] == '' || form.value['first_name'] == null) {
            this.display_toast("Error", "First name field is required");
            return false;
        }
		if (form.value['last_name'] == undefined || form.value['last_name'] == '' || form.value['last_name'] == null) {
            this.display_toast("Error", "Last name field is required");
            return false;
        }
		if (form.value['official_document'] == undefined || form.value['official_document'] == '' || form.value['official_document'] == null) {
            this.display_toast("Error", "Official document field is required");
            return false;
        }
		
		if (this.id_proof !== undefined && this.id_proof !== null) {            
            form.value['id_proof'] = this.id_proof;
        } else {
            this.display_toast("Error", "Missing ID proof");
            return false;
        }

        if (this.holding_id_proof !== undefined && this.holding_id_proof !== null) {
            form.value['holding_id_proof'] =  this.holding_id_proof;
        } else {
            this.display_toast("Error", "Missing Holding ID proof");
            return false;
        }
		
		if (form.value['payment_method'] == undefined || form.value['payment_method'] == '' || form.value['payment_method'] == null) {
            this.display_toast("Error", "Select payout method");
            return false;
        }
		
		if(form.value['payment_method'] == 'Payoneer' || form.value['payment_method'] == 'Paxum') {
            form.value['check_by_mail_address'] = ''; form.value['check_by_mail_city'] = ''; form.value['check_by_mail_state'] = ''; form.value['check_by_mail_zip'] = null; form.value['check_by_mail_country'] = ''; form.value['bank_name'] = ''; form.value['routing_number'] = ''; form.value['account_number'] = '';
            if (form.value['payoneer_email'] == undefined || form.value['payoneer_email'] == '' || form.value['payoneer_email'] == null) {
				this.display_toast("Error", "Payoneer email field is required");
				return false;
			}
			if (form.value['payoneer_email_confirmation'] == undefined || form.value['payoneer_email_confirmation'] == '' || form.value['payoneer_email_confirmation'] == null) {
				this.display_toast("Error", "Payoneer email confirm field is required");
				return false;
			}
		}

		if(form.value['payment_method'] == 'Check by mail') {
           form.value['bank_name'] = ''; form.value['routing_number'] = ''; form.value['account_number'] = ''; form.value['payoneer_email'] = '';
			if (form.value['check_by_mail_address'] == undefined || form.value['check_by_mail_address'] == '' || form.value['check_by_mail_address'] == null) {
				this.display_toast("Error", "Payout method's email field is required");
				return false;
			}
			if (form.value['check_by_mail_city'] == undefined || form.value['check_by_mail_city'] == '' || form.value['check_by_mail_city'] == null) {
				this.display_toast("Error", "City field is required");
				return false;
			}
			if (form.value['check_by_mail_state'] == undefined || form.value['check_by_mail_state'] == '' || form.value['check_by_mail_state'] == null) {
				this.display_toast("Error", "State field is required");
				return false;
			}
			if (form.value['check_by_mail_zip'] == undefined || form.value['check_by_mail_zip'] == '' || form.value['check_by_mail_zip'] == null) {
				this.display_toast("Error", "Zip/Postal field is required");
				return false;
			}
			if (form.value['check_by_mail_country'] == undefined || form.value['check_by_mail_country'] == '' || form.value['check_by_mail_country'] == null) {
				this.display_toast("Error", "Country field is required");
				return false;
			}
		}
		
		if(form.value['payment_method'] == 'Direct bank deposit') {
            form.value['check_by_mail_address'] = ''; form.value['check_by_mail_city'] = ''; form.value['check_by_mail_state'] = ''; form.value['check_by_mail_zip'] = null; form.value['check_by_mail_country'] = ''; form.value['payoneer_email'] = '';
			if (form.value['bank_name'] == undefined || form.value['bank_name'] == '' || form.value['bank_name'] == null) {
				this.display_toast("Error", "Bank name field is required");
				return false;
			}
			if (form.value['routing_number'] == undefined || form.value['routing_number'] == '' || form.value['routing_number'] == null) {
				this.display_toast("Error", "Routing number field is required");
				return false;
			}
			if (form.value['account_number'] == undefined || form.value['account_number'] == '' || form.value['account_number'] == null) {
				this.display_toast("Error", "Account number field is required");
				return false;
			}
		}

		if (form.value['tax_id'] == undefined || form.value['tax_id'] == '' || form.value['tax_id'] == null) {
            this.display_toast("Error", "Business tax ID/Social security number field is required");
            return false;
        }
		
		if (form.value['agree_signup'] == undefined || form.value['agree_signup'] == '' || form.value['agree_signup'] == null) {
            this.display_toast("Error", "Check agreement to proceed");
            return false;
        }
		if (form.value['performer_signup'] == undefined || form.value['performer_signup'] == '' || form.value['performer_signup'] == null) {
            this.display_toast("Error", "Check performer code of conduct to proceed");
            return false;
        }

        this.userService.modelRegistration(form.value)
        .subscribe(

            (data : any) => {
                if (data.success == true) {
                    // Save User Id and Token in local storage to get the values to all pages.
                    // Instead of getting and loading each page and also to restrict some pages to guest user

                    localStorage.setItem('accessToken', data.token);
                    localStorage.setItem('username', data.name);
                    localStorage.setItem('userId', data.id);

                    $.toast({
                        heading: 'Success',
                        text: "You have been registered successfully",
                    // icon: 'error',
                        position: 'top-right',
                        stack: false,
                        textAlign: 'left',
                        loader : false,
                        showHideTransition: 'slide'
                    });
                    
                    // Once successfully authenticated by user, redirect home/profile page

                    this.router.navigate(['/login']);

                } else {
                    if (data.error_code == 9001) {
                        $.toast({
                            heading: 'Success',
                            text: "You have been registered successfully",
                        // icon: 'error',
                            position: 'top-right',
                            stack: false,
                            textAlign: 'left',
                            loader : false,
                            showHideTransition: 'slide'
                        });
                        
                        // Once successfully authenticated by user, redirect home/profile page    
                        this.router.navigate(['/login']);

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
                        
                }

            },

            (err : HttpErrorResponse) => {
                this.errorMessages = 'Oops! something went wrong...!';
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