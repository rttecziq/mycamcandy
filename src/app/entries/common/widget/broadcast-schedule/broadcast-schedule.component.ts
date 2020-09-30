import { Component, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RequestService } from '../../../../common/services/request.service';
import { HttpErrorResponse } from '@angular/common/http';

declare var $: any ;
@Component({
  selector: 'app-broadcast-schedule',
  templateUrl: './broadcast-schedule.component.html',
  styleUrls: ['./broadcast-schedule.component.css']
})
export class BroadcastScheduleComponent implements AfterViewInit {
  errorMessages : string;
  uType : string; 
  schedule_date : string; 
  start_hour : string; 
  start_minute : string; 
  start_ampm : string; 
  end_hour : string; 
  end_minute : string; 
  end_ampm : string; 
  endTime:string;
  endDateTime:Date;
  startTime:string;
  startDateTime:Date;
  model_id:string;
  timezone:string
  note:string;
  nrStartSelect='12';
  nrEndSelect='12';
  nrStartMinute='00';
  nrEndMinute='00';
  nrStartAmPm='AM';
  nrEndAmPm='AM';
  schedule_data:object;
  
  constructor(private requestService : RequestService, private router : Router, private route : ActivatedRoute) { 
    this.errorMessages = '';  
    this.uType = "creator";
    this.schedule_date='';
    this.start_hour='';
    this.start_minute='';
    this.start_ampm='';
    this.end_hour='';
    this.end_minute='';
    this.end_ampm='';
    this.timezone;
    this.startTime
    this.endTime;
    this.note='';
    this.schedule_data={};
    this.model_id = (localStorage.getItem('userId') != '' && localStorage.getItem('userId') != null && localStorage.getItem('userId') != undefined) ? localStorage.getItem('userId') : '';
  }

  ngAfterViewInit() {
    let data={model_id:this.model_id,listData:'getScheduleList'};
    this.getModelSchedule('modelSchedule',data);
  }
  getModelSchedule(url,object){
    this.requestService.postMethod('model_schedule', object)
    .subscribe((data : any ) => {
        if (data.success == true) {
          this.schedule_data=data.data;
          console.log(data);
        } else {
          this.errorMessages = data.error_messages;
          this.toast_message("Error", this.errorMessages);
      }
    },
    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
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
  modelSchedule(form : NgForm){
    if((form.value['schedule_date']!='') && (form.value['schedule_date'] !=null)){
        this.schedule_date=form.value['schedule_date'];
    }else{
      this.toast_message('Error','Schedule date can not empty !');
      return false;
    }

    if((form.value['start_hour']!='') && (form.value['start_hour'] !=null)){
      this.start_hour=form.value['start_hour'];
    }else{
      this.toast_message('Error','Schedule Start hour can not empty !');
      return false;
    }
    if((form.value['start_minute']!='') && (form.value['start_minute'] !=null)){
      this.start_minute=form.value['start_minute'];
    }else{
      this.toast_message('Error','Schedule Start Minute can not empty !');
      return false;
    }
    if((form.value['start_ampm']!='') && (form.value['start_ampm'] !=null)){
      this.start_ampm=form.value['start_ampm'];
    }else{
      this.toast_message('Error','Schedule start am/pm can not empty !');
      return false;
    }

    
    if((form.value['end_hour']!='') && (form.value['end_hour'] !=null)){
      this.end_hour=form.value['end_hour'];
    }else{
      this.toast_message('Error','Schedule end hour can not empty !');
      return false;
    }
    if((form.value['end_minute']!='') && (form.value['end_minute'] !=null)){
      this.end_minute=form.value['end_minute'];
    }else{
      this.toast_message('Error','Schedule end minute can not empty !');
      return false;
    }
    if((form.value['end_ampm']!='') && (form.value['end_ampm'] !=null)){
      this.end_ampm=form.value['end_ampm'];
    }else{
      this.toast_message('Error','Schedule end am/pm can not empty !');
      return false;
    }
    if((form.value['timezone']!='') && (form.value['timezone'] !=null)){
      this.timezone=form.value['timezone'];
    }else{
      this.toast_message('Error','Schedule time zone can not empty !');
      return false;
    }

    this.endDateTime = new Date(this.schedule_date + ' ' + this.end_hour + ':' + this.end_minute + ' ' + this.end_ampm);
    this.startDateTime =new Date( this.schedule_date + ' '+ this.start_hour + ':' + this.start_minute + ' ' + this.start_ampm);
    
    if (this.startDateTime.getTime() < this.endDateTime.getTime()){
      console.log(this.startDateTime.getTime());
    }else{
      this.toast_message('Error','Schedule start time should be lest than end time');
      return false;
    } 
    this.endTime = this.end_hour + ':' + this.end_minute + ' ' + this.end_ampm;
    this.startTime =this.start_hour + ':' + this.start_minute + ' ' + this.start_ampm;
    this.note=form.value['note'];
    let data = {
      model_id: this.model_id,
      schedule_date :this.schedule_date,
      startTime : this.startTime,
      endTime : this.endTime,
      timezone: this.timezone,
      note : this.note,
      endDateTime:this.endDateTime
    };
    //console.log(data);
    

    this.requestService.postMethod('model_schedule', data)
    .subscribe((data : any ) => {
        if (data.success == true) {
          this.toast_message("Success", "Model Schedule has been updated successfully")
        } else {
          this.errorMessages = data.error_messages;
          this.toast_message("Error", this.errorMessages);
      }
    },

    (err : HttpErrorResponse) => {
      this.errorMessages = 'Oops! Something Went Wrong';
      this.toast_message("Error", this.errorMessages);
    });
  }

}
