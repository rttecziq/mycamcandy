import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../../../common/services/request.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

declare var $:any;

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.css']
})
export class CollectionDetailsComponent implements OnInit {

  errorMessages : string;
  model_name : string;
  collectionData : any;
  isUserExists : string;
  model : object;

  // collection
  collection_id : number;
  is_purchased : number;
  collection_discount : string;
  collection_album_count : number;

  constructor(private requestService: RequestService, private router: Router, private route: ActivatedRoute) {
    this.collectionData = [];
    this.model_name = "";
    this.model = {};
    this.collection_album_count = 0;

    this.isUserExists = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.model_name = params['username'];
      let details = {name : this.model_name};
      this.collection_id = params['collection_id'];
      let album_params = {model_id : this.isUserExists, collection_id : this.collection_id, skip : 0};
      this.collectionDataListFn('model_end_list_collections', album_params);
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

  collectionDataListFn(url, object) {
    this.requestService.postMethod(url,object) 
        .subscribe(
            (data : any) => {
                if (data.success == true) {
                  this.collectionData = data.data[0];
                  this.collection_album_count = data.data[0].collection_albums.length ? data.data[0].collection_albums.length : 0;
                } else {                  
                    this.errorMessages = data.error_messages;
                    this.toast_message("Error", this.errorMessages);
                }
            },

            (err : HttpErrorResponse) => {
                this.errorMessages = 'Oops! Something Went Wrong';
                this.toast_message("Error", this.errorMessages);
            }
        );
  }

  view_collection_data(album) {
    // check album && user is VIP
    if(this.isUserExists) {
     this.router.navigate(['/candy-club/'+this.model_name+'/album/'+album.id]);
   } else if(!this.isUserExists) {
     this.toast_message("Warning", "Login to proceed");
   }
 }

}