import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ConfigsService } from '../services/configs.service';
import { ReceipientsService } from '../services/receipients.service';
import { TransactionsService } from '../services/transactions.service';
import { StorageService } from '../shared/storage.service';
declare var $: any;

var slidePage: any;
var progressText: any;
var progressCheck: any;
var bullet: any;
let current = 1;

@Component({
  selector: 'app-send-money',
  templateUrl: './send-money.component.html',
  styleUrls: ['./send-money.component.css']
})
export class SendMoneyComponent implements OnInit {

  receipients: any;
  loader: boolean;
  loader2: boolean;
  clientId: string;
  clientCurrencies: any;
  preAuthForm: FormGroup;
  currencies: any;
  receiver: string = '';
  receiverAmount: string = '';
  amount: string = '';
  colCur: string = '';
  reference: string = '';
  countries: any;
  calcLoader: boolean;

  constructor(
    private receipientService: ReceipientsService,
    private fb: FormBuilder,
    private configService: ConfigsService,
    private transactionService: TransactionsService,
    private toast: ToastrService,
    private authService: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.clientId = this.authService.getClientId();

    let sdata = this.storageService.getName();    

    // console.log(sdata);    

    slidePage = $(".slide-page");
    progressText = $(".step p");
    progressCheck = $(".step .check");
    bullet = $(".step .bullet");
    
    this.getReceipients();
    this.getCountries(sdata[0]);
    // this.getCurrencies();
    

    if(sdata[3] && sdata[1] && sdata[2]){
      this.preAuthForm = this.fb.group({
        amountSend: [sdata[3], Validators.required],
        collectionAmount: ['', Validators.required],
        sourceCountryCode: [sdata[0], Validators.required],
        destinationCountryCode: ['', Validators.required],
        currencyCodeSend: [sdata[1], Validators.required],
        clientId: this.clientId,
        collectionCurrencyCode: [sdata[2], Validators.required],
        recipientId: ['', Validators.required],
        reasonForTransfer: ['', Validators.required]
      });
    }
    else{
      this.preAuthForm = this.fb.group({
        amountSend: ['', Validators.required],
        collectionAmount: ['', Validators.required],
        sourceCountryCode: ['', Validators.required],
        destinationCountryCode: ['', Validators.required],
        currencyCodeSend: ['', Validators.required],
        clientId: this.clientId,
        collectionCurrencyCode: ['', Validators.required],
        recipientId: ['', Validators.required],
        reasonForTransfer: ['', Validators.required]
      });
    }

  }

  getReceipients(){
    this.receipientService.getAllReceipients(this.clientId)
    .subscribe(
      data => {
        // console.log(data);
        this.receipients = data;
      },
      error => {
        console.log(error);
        
      }
    )
  }

  selectedCountry(){
    // console.log(name);
    
    this.showCurrencies(this.preAuthForm.value.sourceCountryCode);    
  }

  showCurrencies(ref){
    // console.log(targ);
    
    if(ref){
      this.countries.forEach(rc => {
        if(rc.countryCode == ref){
          this.clientCurrencies = rc.currencies;
        }
      });
    }
  }

  selectedReceipt(ref, name){
    // console.log(ref);

    this.getRecipientCountry(ref);
    this.receiver = name;

    this.preAuthForm.patchValue({
      recipientId: ref
    });
    
    $('#receipts').hide();
    $('#amounts').show();

    this.stepForward();
  }

  stepForward() {
    slidePage.css('marginLeft', "-25%");
    $(bullet[current - 1]).addClass('active');
    $(progressCheck[current - 1]).addClass('active');
    $(progressText[current - 1]).addClass('active');
    current += 1;
  }

  stepBack() {
    slidePage.css('marginLeft', "0%");
    $(bullet[current - 2]).removeClass("active");
    $(progressCheck[current - 2]).removeClass("active");
    $(progressText[current - 2]).removeClass("active");
    current -= 1;
  }

  showRecipients(){
    $('#receipts').show();
    $('#amounts').hide();

    this.stepBack();
  }

  confirmDetails(){
    if(!this.preAuthForm.value.currencyCodeSend || !this.preAuthForm.value.collectionCurrencyCode || !this.preAuthForm.value.amountSend || !this.preAuthForm.value.collectionAmount){
      this.toast.warning('Enter required info.');
      return false;
    }

    this.amount = this.preAuthForm.value.currencyCodeSend + this.preAuthForm.value.amountSend;
    this.colCur = this.preAuthForm.value.collectionCurrencyCode;

    $('#amounts').hide();
    $('#confirm').show();

    this.stepForward();
    
  }

  showAmounts(){
    $('#amounts').show();
    $('#confirm').hide();

    this.stepBack();
  }

  sendPreAuth(form: FormGroup){
    // console.log(form.value);

    if(!this.preAuthForm.value.reasonForTransfer){
      this.toast.warning('Enter reason for transfer.');
      return false;
    }
    
    if(form.valid){
      this.loader = true;
      this.transactionService.sendPreAuth(form.value)
      .subscribe(
        resp => {
          // console.log(resp);
          this.toast.success('Pre Auth Successful.!');
          this.loadResponseArea(resp);
          this.stepForward();
          this.loader = false;
        },
        error => {
          console.log(error);
          this.toast.error('Oops. Pre Auth Failed.');
          this.loader = false;
        }
      )
    }
  }

  getCurrencies(){
    this.configService.getAllApprovedCurrencies()
    .subscribe(
      resp => {
        // console.log(resp);
        this.clientCurrencies = resp;
      },
      err => {
        console.log(err);
        
      }
    )
  }

  getCountries(ref){
    this.configService.getAllApprovedCountries()
    .subscribe(
      resp => {
        // console.log(resp);
        this.countries = resp;
        this.showCurrencies(ref);
      },
      err => {
        console.log(err);
        
      }
    )
  }

  getRecipientCountry(ref){
    var count: any;
    this.receipients.forEach(rr => {
      if(rr.id == ref){
        count = rr.countryId
      }
    });
    // console.log(count);
    
    this.configService.getCountryById(count)
    .subscribe(
      data => {
        // console.log(data);
        
        this.preAuthForm.patchValue({
          destinationCountryCode: data.countryCode
        });

        this.currencies = data.currencies;
        // console.log(this.currencies);
        
      },
      error => {
        console.log(error);
        
      }
    )
  }

  loadResponseArea(data){
    this.preAuthForm.addControl(
      'preauthId', new FormControl(data.preauthId)
    )

    this.receiverAmount = data.collectionCurrencyCode + data.collectionAmount;

    $('#resAmount').html(data.currencyCodeSend + data.amount);
    $('#resFees').html(data.currencyCodeSend + data.fees);
    $('#resTotal').html(data.currencyCodeSend + data.totalAmount);
    
    $('#confirm').hide();
    $('#finish').show();

    localStorage.clear();

    this.stepForward();
  }

  cancelTrans(){
    $('#finish').hide();
    $('#confirm').show();

    this.stepBack();
  }

  makeTransaction(){
    // console.log(this.preAuthForm.value);

    this.loader2 = true;
    this.transactionService.sendMoney(this.preAuthForm.value)
    .subscribe(
      data => {
        // console.log(data);
        this.reference = data.transactionReference;
        $('#resTotal2').html(this.preAuthForm.value.currencyCodeSend + (Number(this.preAuthForm.value.amountSend) + Number(data.fees)).toFixed(2));
        // $('#resFee2').html(data.fees);
        this.loader2 = false;
        this.toast.success('Transaction Successful.');
        $('#finish').hide();
        $('#message').show();
        this.stepForward();
      },
      error => {
        console.log(error);
        this.toast.error('Oops. Transaction Failed.');
        this.loader2 = false;
      }
    )
  }

  determineCalc(){

    var samt = this.preAuthForm.value.amountSend;
    var ramt = this.preAuthForm.value.collectionAmount;

    if(samt && ramt){
      this.toast.warning('Enter one Amount.');
      return false;
    }

    this.calcLoader = true;
    // console.log(this.preAuthForm.value);
    

    var scur = this.preAuthForm.value.currencyCodeSend;
    var rcur = this.preAuthForm.value.collectionCurrencyCode;

    var sci = 0, rci = this.preAuthForm.value.destinationCountryCode;
    this.countries.forEach(r => {
      if(r.countryCode == this.preAuthForm.value.sourceCountryCode){
        sci = r.id;
      }
      
    });

    // console.log(scur, rcur, samt, sci);
    

    if(samt && scur && rcur && sci && !ramt){
      var fdat = {
        "convertToCurrencyCode": rcur,
        "convertFromCurrencyCode": scur,
        "fromAmount": samt,
        "toAmount": 0,
        "countryId": sci,
        "toCountryCode": rci,
        "activeInput": "sender"
      };

      this.newCalculation(fdat, 'send');
    }
    else if(!samt && scur && rcur && sci && ramt){
      var fdat2 = {
        "convertToCurrencyCode": scur,
        "convertFromCurrencyCode": rcur,
        "fromAmount": 0,
        "toAmount": ramt,
        "countryId": sci,
        "toCountryCode": rci,
        "activeInput": "receiver"
      };

      this.newCalculation(fdat2, 'receive');
    }
    else{
      this.toast.warning('Missing Info.');
      this.calcLoader = false;
    }
    
  }

  clearField(targ){
    $('#' + targ).val('');

    if(targ == 'sendingAmount'){
      this.preAuthForm.patchValue({
        amountSend: ''
      });
    }
    else if(targ == 'collectionAmount'){
      this.preAuthForm.patchValue({
        collectionAmount: ''
      });
    }
  }

  getCalculation(from, to, amt, country){

    var fdata = {
      "convertToCurrencyCode": to,
      "convertFromCurrencyCode": from,
      "amount": amt,
      "countryId": country
    };

    // console.log(fdata);

    this.configService.convertCurrenciesWithFees(fdata)
    .subscribe(
      data => {
        // console.log(data);
        // $('#collectionAmount').val(data.amount);
        $('#myFee').html(from + data.fee);
        this.preAuthForm.patchValue({
          collectionAmount: data.amount
        });

        this.calcLoader = false;
      },
      err => {
        console.log(err);
        if(err.error.message){
          this.toast.error(err.error.message);
        }
        else{
          this.toast.error('Oops. Something Happened.!');
        }
        this.calcLoader = false;
      }
    )
    
  }

  newCalculation(fdata, type){

    // console.log(fdata);

    this.configService.newConvertCurrenciesCalculations(fdata)
    .subscribe(
      data => {
        // console.log(data);
        $('#paidAmount').val(data.senderAmount);
        // $('#collectionAmount').val(data.receiverAmount);
        $('#myFee').html(fdata.convertFromCurrencyCode + data.fee);

        this.preAuthForm.patchValue({
          collectionAmount: data.receiverAmount
        });

        if(type != "send"){
          // console.log('lol');
          
          this.preAuthForm.patchValue({
            amountSend: (Number(data.senderAmount) - Number(data.fee))
          });
        }

        this.calcLoader = false;
      },
      err => {
        console.log(err);
        if(err.error.message){
          this.toast.error(err.error.message);
        }
        else{
          this.toast.error('Oops. Something Happened.!');
        }
        this.calcLoader = false;
      }
    )
    
  }

}
