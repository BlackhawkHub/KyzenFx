import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ConfigsService } from '../services/configs.service';
import { TransactionsService } from '../services/transactions.service';
declare var $: any;

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  clientId: string;
  transactions: any;
  transaction: any;
  receipient: any;
  currentPage: any;
  countries: any;
  searchParams: string;
  searchForm: FormGroup;
  cancelForm: FormGroup;
  loader: boolean;

  constructor(
    private transactionService: TransactionsService,
    private toast: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    private configService: ConfigsService
  ) { }

  ngOnInit(): void {
    this.clientId = this.authService.getClientId();
    // this.searchParams = '?search=clientId%3A' + this.clientId;
    
    this.getTransactions();
    this.getCountries();

    this.searchForm = this.fb.group({
      type: '',
      value: ''
    });

    this.cancelForm = this.fb.group({
      reasonForCancellation: ''
    });

  }

  getCountries(){
    this.configService.getAllApprovedCountries()
    .subscribe(
      data => {
        // console.log(data);
        this.countries = data;
        
      },
      err => {
        console.log(err);
        
      }
    )
  }

  getCountryName(ref){
    var cname;

    this.countries.forEach(rc => {
      if(rc.countryCode == ref){
        cname = rc.name;
      }
    });

    return cname;
  }

  enableSearch(){
    // console.log(this.searchForm.value.type);
    
    if(this.searchForm.value.type == 'all'){
      $('#searchValue').attr('disabled', true);
      $('#searchValue').val('');

      this.searchParams = null;
      this.getTransactions();
    }
    else{
      $('#searchValue').attr('disabled', false);
    }
  }

  handleSearch(){
    if(this.searchForm.value.value.length >= 2){
      this.searchParams = '?search=clientId%3A' + this.clientId +'%2C' + this.searchForm.value.type + '%3A' + this.searchForm.value.value;

      this.getTransactions();
    } 
    
    // console.log(this.searchParams);
    
  }

  pageChanged(event){
    this.currentPage = event;
  }

  getTransactions(){
    this.transactionService.getManipulatedClientTransactions(this.searchParams, this.clientId)
    .subscribe(
      data => {
        // console.log(data);
        this.transactions = data.content;

        
      },
      error => {
        console.log(error);
        this.toast.error('Oops. Failed to get transactions.');
      }
    )
  }

  showRevoke(para){
    if(para){
      $('#transactionArea').hide();
      $('#revokeArea').show();
    }
    else{
      $('#transactionArea').show();
      $('#revokeArea').hide();
    }
  }

  revokeTransaction(form: FormGroup){
    // console.log(form.value);

    if(!form.value.reasonForCancellation){
      this.toast.warning('Enter Reason.!');
      return false;
    }

    this.loader = true;
    this.transactionService.cancelTransaction(form.value, this.transaction.id, this.clientId)
    .subscribe(
      resp => {
        // console.log(resp);
        this.toast.success('Transaction Revoked.');
        $('#info').modal('hide');
        this.loader = false;
        $('.modal-backdrop').hide();
        this.getTransactions();
      },
      err => {
        console.log(err);
        this.toast.error('Oops. Something Happened.!');
        this.loader = false;
      }
    )
    
  }

  loadDetails(ref){
    this.showRevoke(false);

    this.transactions.forEach(r => {
      if(r.id == ref){
        this.transaction = r;
      }
    });

    // console.log(this.transaction);

    if(this.transaction){
      this.receipient = this.transaction.recipient;
    }
    
  }

  maskText(plainCreditCard: string, visibleDigits: number = 4): string {
    if(plainCreditCard){
      //const visibleDigits = 4;
      let maskedSection = plainCreditCard.slice(0, -visibleDigits);
      let visibleSection = plainCreditCard.slice(-visibleDigits);
      
      return maskedSection.replace(/./g, '*') + visibleSection;
    }
  }

}
