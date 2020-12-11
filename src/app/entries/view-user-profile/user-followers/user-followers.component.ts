import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../../common/services/request.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-user-followers',
  templateUrl: './user-followers.component.html',
  styleUrls: ['./user-followers.component.css']
})
export class UserFollowersComponent implements OnInit {

  errorMessages : string;
  member_name : string;
  member : object;
  user_profile_picture : string;  
  user_cover_picture : string;

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute) {
    this.member_name = "";
    this.member = {};
    this.user_profile_picture = "../../../../assets/img/pro-img.jpg";  
    this.user_cover_picture = "../../../../assets/img/bg-image.jpg";
  }
        ngOnInit(){
          this.route.params.subscribe(params => {
            this.member_name = params['username'];
            let details = {name : this.member_name};
            this.model_profiles_fn("user_profile_details", details);
      
         });
        }
        toast_message(heading, message) {
          $.toast({
              heading: heading,
              text: message,
              position: 'top-right',
              stack: false,
              textAlign: 'left',
              loader : false,
              showHideTransition: 'slide'
          });
        }
      
        model_profiles_fn(url, object) {
          this.requestService.postMethod(url,object) 
              .subscribe(
                  (data : any) => {
                      if (data.success == true) {
                        this.member = data;
                        this.user_cover_picture = data.cover;
                        this.user_profile_picture = data.picture;
                        console.log(this.member);
                      } else if(data.error_messages == 'Model not found') {
                        this.router.navigate(['error']);
                      } else {
                        this.toast_message("Error", data.error_messages);  
                      }
                  },
                  (err : HttpErrorResponse) => {
                      this.errorMessages = 'Oops! Something Went Wrong';
                      this.toast_message("Error", this.errorMessages);
                  }
              );
        }

}
