import { Component, AfterViewInit } from '@angular/core';
import { RequestService } from '../../../../common/services/request.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

declare var $: any ;
const YEAR_VALUES = ['2020', '2021', '2022', '2023', '2024', '2025', '2026',
'2027', '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035'];
const DATE_VALUES = [
  '1 Jan - 15 Jan', '16 Jan - 31 Jan', '1 Feb - 15 Feb', '16 Feb - 29 Feb',
  '1 Mar - 15 Mar', '16 Mar - 31 Mar', '1 Apr - 15 Apr', '16 Apr - 30 Apr',
  '1 May - 15 May', '16 May - 31 May', '1 Jun - 15 Jun', '16 Jun - 30 Jun',
  '1 Jul - 15 Jul', '16 Jul - 31 Jul', '1 Aug - 15 Aug', '16 Aug - 31 Aug',
  '1 Sep - 15 Sep', '16 Sep - 30 Sep', '1 Oct - 15 Oct', '16 Oct - 31 Oct',
  '1 Nov - 15 Nov', '16 Nov - 30 Nov', '1 Dec - 15 Dec', '16 Dec - 31 Dec'
];

@Component({
  selector: 'app-earning-history',
  templateUrl: './earning-history.component.html',
  styleUrls: ['./earning-history.component.css']
})
export class EarningHistoryComponent implements AfterViewInit {
  errorMessages : string;
  transactions : any[];
  balance: number;
  total_spend: number;
  year_values: string[];
  date_values: string[];
  current_year : number;
  current_month: number;
  current_date : number;
  filterForm = new FormGroup({
    date: new FormControl(''),
    year: new FormControl(''),
  });
  
  
  constructor(private requestService : RequestService, private router : Router) {
    this.errorMessages = "";
    this.balance = 0;
    this.total_spend = 0;
    this.transactions = [];
    this.year_values = YEAR_VALUES;
    this.date_values = DATE_VALUES;
    this.current_year = new Date().getFullYear();
    this.current_month = new Date().getMonth() + 1;
    this.current_date = new Date().getDate();
  }

   ngAfterViewInit() {
    this.transactionsFn('candies_transactions', "");
  }

  // Load Details
  transactionsFn(url, object) {
    this.requestService.postMethod(url, object).subscribe(
      (data : any) => {
        if (data.success == true) {
          this.transactions = data.data.transactions;
          this.balance = data.data.balance;
        } else {
          this.errorMessages = data.error_messages;
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
      },
      (err : HttpErrorResponse) => {
        this.errorMessages = 'Oops! Something Went Wrong';
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
