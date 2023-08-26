import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ConfigsService } from '../services/configs.service';
import { StorageService } from '../shared/storage.service';
//import { NgImageSliderModule } from 'ng-image-slider';

declare var $: any;

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  countries: any;

  sCurrency: any;
  sAmount: any;
  rCurrency: any;

  loader: boolean;
  chartUrl: string = 'https://web.whatsapp.com/send?phone=+263713111500&text=Hi,%20I%20need%20to%20send%20money%20on%20KyzenFX';

  constructor(
    private configService: ConfigsService,
    private toast: ToastrService,
    public authService: AuthService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.getCountries();
    localStorage.clear();
  }

  setVariable(){
    var scou = $('#senderCountry').val();
    var rcou = $('#receiverCountry').val();
    var sci = '';
    this.countries.forEach(r => {
      if(r.name == scou){
        sci = r.countryCode;
      }
    });    

    var scur = $('#senderCurreny').val() ? $('#senderCurreny').val() : '';
    var rcur = $('#receiverCurreny').val() ? $('#receiverCurreny').val() : '';
    
    // var samt = $('#senderAmount').val() ? $('#senderAmount').val() : '';
    var samt = this.sAmount ? this.sAmount : '';
    var ramt = $('#receiverAmount').val();

    // console.log(sci, scur, rcur, samt);
    if(sci){
      this.storageService.setName([sci, scur, rcur, samt]);
    }
    else{
      this.storageService.setName(['', scur, rcur, samt]);
    }
    
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
        this.toast.error('Oops. Something happened.!');
      }
    )
  }

  selectedCountry(name, targ){
    // console.log(name);
    
    this.showCurrencies($('#'+name).val(), targ);    
  }

  showCurrencies(ref, targ){
    // console.log(targ);
    
    this.countries.forEach(rc => {
      if(rc.name == ref){
        if(targ == 'sender'){
          this.sCurrency = rc.currencies;
        }
        else if(targ == 'receiver'){
          this.rCurrency = rc.currencies;
        }
      }
    });
  }

  isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        if(charCode != 46)
        return false;
    return true;
  }

  determineCalc(){

    if(!$('#senderCountry').val() || !$('#receiverCountry').val() || !$('#senderCurreny').val() || !$('#receiverCurreny').val()){
      this.toast.warning('Missing required Info.');
      return false;
    }

    this.loader = true;

    var scou = $('#senderCountry').val();
    var rcou = $('#receiverCountry').val();
    var sci = 0, rci = '';
    this.countries.forEach(r => {
      if(r.name == scou){
        sci = r.id;
      }
      if(r.name == rcou){
        // console.log(r);
        
        rci = r.id;
      }
    });    

    var scur = $('#senderCurreny').val();
    var rcur = $('#receiverCurreny').val();
    
    var samt = $('#senderAmount').val();
    this.sAmount = samt;
    var ramt = $('#receiverAmount').val();

    if(samt && !ramt){
      var fdat = {
        "convertToCurrencyCode": rcur,
        "convertFromCurrencyCode": scur,
        "fromAmount": samt,
        "toAmount": 0,
        "countryId": sci,
        "toCountryCode": rci,
        "activeInput": "sender"
      };

      this.newCalculation(fdat);
    }
    else if(ramt && !samt){
      var fdat2 = {
        "convertToCurrencyCode": scur,
        "convertFromCurrencyCode": rcur,
        "fromAmount": 0,
        "toAmount": ramt,
        "countryId": sci,
        "toCountryCode": rci,
        "activeInput": "receiver"
      };

      this.newCalculation(fdat2);
    }
    else{
      console.log('Nothing to do');
      this.loader = false;
      this.toast.warning('Type Amount');
    }
    
  }

  clearField(targ){
    $('#' + targ).val('');
  }

  getCalculation(from, to, amt, country, targ){

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
        $('#' + targ).val(data.amount);
        $('#senderAmount').val(data.totalAmount);
        $('#myFee').html(from + data.fee);
        $('#myExRate').html('USD$1 = ' + from + data.rate);
        this.loader = false;
      },
      err => {
        console.log(err);
        if(err.error.message){
          this.toast.error(err.error.message);
        }
        else{
          this.toast.error('Oops. Something Happened.!');
        }
        this.loader = false;
      }
    )
    
  }

  newCalculation(fdata){   
    // console.log(fdata);
    var scur = $('#senderCurreny').val();

    this.configService.newConvertCurrenciesCalculations(fdata)
    .subscribe(
      data => {
        // console.log(data);
        // $('#' + targ).val(data.amount);
        $('#senderAmount').val(data.senderAmount);
        $('#receiverAmount').val(data.receiverAmount);
        $('#myFee').html(scur + data.fee);
        // $('#myFee').html(fdata.convertFromCurrencyCode + data.fee);
        // $('#myExRate').html('USD$1 = ' + from + data.rate);
        this.loader = false;
      },
      err => {
        console.log(err);
        if(err.error.message){
          this.toast.error(err.error.message);
        }
        else{
          this.toast.error('Oops. Something Happened.!');
        }
        this.loader = false;
      }
    )
    
  }

}
