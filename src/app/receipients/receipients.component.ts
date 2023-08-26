import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import { ConfigsService } from '../services/configs.service';
import { ReceipientsService } from '../services/receipients.service';
declare var $: any;

@Component({
  selector: 'app-receipients',
  templateUrl: './receipients.component.html',
  styleUrls: ['./receipients.component.css']
})
export class ReceipientsComponent implements OnInit {

  clientId: string;
  receipients: any;
  receipient: any;
  addForm: FormGroup;
  editForm: FormGroup;
  loader: boolean;
  nloader: boolean;
  rloader: boolean;
  countries: any;
  prefix: any;

  countryCodes: { name: string; dial_code: string; code: string }[] = [
    { name: 'Israel', dial_code: '972', code: 'IL' },
    { name: 'Afghanistan', dial_code: '93', code: 'AF' },
    { name: 'Albania', dial_code: '355', code: 'AL' },
    { name: 'Algeria', dial_code: '213', code: 'DZ' },
    { name: 'AmericanSamoa', dial_code: '1 684', code: 'AS' },
    { name: 'Andorra', dial_code: '376', code: 'AD' },
    { name: 'Angola', dial_code: '244', code: 'AO' },
    { name: 'Anguilla', dial_code: '1 264', code: 'AI' },
    { name: 'Antigua and Barbuda', dial_code: '1268', code: 'AG' },
    { name: 'Argentina', dial_code: '54', code: 'AR' },
    { name: 'Armenia', dial_code: '374', code: 'AM' },
    { name: 'Aruba', dial_code: '297', code: 'AW' },
    { name: 'Australia', dial_code: '61', code: 'AU' },
    { name: 'Austria', dial_code: '43', code: 'AT' },
    { name: 'Azerbaijan', dial_code: '994', code: 'AZ' },
    { name: 'Bahamas', dial_code: '1 242', code: 'BS' },
    { name: 'Bahrain', dial_code: '973', code: 'BH' },
    { name: 'Bangladesh', dial_code: '880', code: 'BD' },
    { name: 'Barbados', dial_code: '1 246', code: 'BB' },
    { name: 'Belarus', dial_code: '375', code: 'BY' },
    { name: 'Belgium', dial_code: '32', code: 'BE' },
    { name: 'Belize', dial_code: '501', code: 'BZ' },
    { name: 'Benin', dial_code: '229', code: 'BJ' },
    { name: 'Bermuda', dial_code: '1 441', code: 'BM' },
    { name: 'Bhutan', dial_code: '975', code: 'BT' },
    { name: 'Bosnia and Herzegovina', dial_code: '387', code: 'BA' },
    { name: 'Botswana', dial_code: '267', code: 'BW' },
    { name: 'Brazil', dial_code: '55', code: 'BR' },
    { name: 'Bulgaria', dial_code: '359', code: 'BG' },
    { name: 'Burkina Faso', dial_code: '226', code: 'BF' },
    { name: 'Burundi', dial_code: '257', code: 'BI' },
    { name: 'Cambodia', dial_code: '855', code: 'KH' },
    { name: 'Cameroon', dial_code: '237', code: 'CM' },
    { name: 'Canada', dial_code: '1', code: 'CA' },
    { name: 'Cape Verde', dial_code: '238', code: 'CV' },
    { name: 'Cayman Islands', dial_code: ' 345', code: 'KY' },
    { name: 'Chad', dial_code: '235', code: 'TD' },
    { name: 'Chile', dial_code: '56', code: 'CL' },
    { name: 'China', dial_code: '86', code: 'CN' },
    { name: 'Christmas Island', dial_code: '61', code: 'CX' },
    { name: 'Colombia', dial_code: '57', code: 'CO' },
    { name: 'Comoros', dial_code: '269', code: 'KM' },
    { name: 'Congo', dial_code: '242', code: 'CG' },
    { name: 'Cook Islands', dial_code: '682', code: 'CK' },
    { name: 'Costa Rica', dial_code: '506', code: 'CR' },
    { name: 'Croatia', dial_code: '385', code: 'HR' },
    { name: 'Cuba', dial_code: '53', code: 'CU' },
    { name: 'Cyprus', dial_code: '537', code: 'CY' },
    { name: 'Czech Republic', dial_code: '420', code: 'CZ' },
    { name: 'Denmark', dial_code: '45', code: 'DK' },
    { name: 'Djibouti', dial_code: '253', code: 'DJ' },
    { name: 'Dominica', dial_code: '1 767', code: 'DM' },
    { name: 'Dominican Republic', dial_code: '1 849', code: 'DO' },
    { name: 'Ecuador', dial_code: '593', code: 'EC' },
    { name: 'Egypt', dial_code: '20', code: 'EG' },
    { name: 'El Salvador', dial_code: '503', code: 'SV' },
    { name: 'Equatorial Guinea', dial_code: '240', code: 'GQ' },
    { name: 'Eritrea', dial_code: '291', code: 'ER' },
    { name: 'Estonia', dial_code: '372', code: 'EE' },
    { name: 'Ethiopia', dial_code: '251', code: 'ET' },
    { name: 'Fiji', dial_code: '679', code: 'FJ' },
    { name: 'Finland', dial_code: '358', code: 'FI' },
    { name: 'France', dial_code: '33', code: 'FR' },
    { name: 'Gabon', dial_code: '241', code: 'GA' },
    { name: 'Gambia', dial_code: '220', code: 'GM' },
    { name: 'Georgia', dial_code: '995', code: 'GE' },
    { name: 'Germany', dial_code: '49', code: 'DE' },
    { name: 'Ghana', dial_code: '233', code: 'GH' },
    { name: 'Gibraltar', dial_code: '350', code: 'GI' },
    { name: 'Greece', dial_code: '30', code: 'GR' },
    { name: 'Greenland', dial_code: '299', code: 'GL' },
    { name: 'Grenada', dial_code: '1 473', code: 'GD' },
    { name: 'Guadeloupe', dial_code: '590', code: 'GP' },
    { name: 'Guam', dial_code: '1 671', code: 'GU' },
    { name: 'Guatemala', dial_code: '502', code: 'GT' },
    { name: 'Guinea', dial_code: '224', code: 'GN' },
    { name: 'Guinea-Bissau', dial_code: '245', code: 'GW' },
    { name: 'Guyana', dial_code: '595', code: 'GY' },
    { name: 'Haiti', dial_code: '509', code: 'HT' },
    { name: 'Honduras', dial_code: '504', code: 'HN' },
    { name: 'Hungary', dial_code: '36', code: 'HU' },
    { name: 'Iceland', dial_code: '354', code: 'IS' },
    { name: 'India', dial_code: '91', code: 'IN' },
    { name: 'Indonesia', dial_code: '62', code: 'ID' },
    { name: 'Iraq', dial_code: '964', code: 'IQ' },
    { name: 'Ireland', dial_code: '353', code: 'IE' },
    { name: 'Israel', dial_code: '972', code: 'IL' },
    { name: 'Italy', dial_code: '39', code: 'IT' },
    { name: 'Jamaica', dial_code: '1 876', code: 'JM' },
    { name: 'Japan', dial_code: '81', code: 'JP' },
    { name: 'Jordan', dial_code: '962', code: 'JO' },
    { name: 'Kazakhstan', dial_code: '7 7', code: 'KZ' },
    { name: 'Kenya', dial_code: '254', code: 'KE' },
    { name: 'Kiribati', dial_code: '686', code: 'KI' },
    { name: 'Kuwait', dial_code: '965', code: 'KW' },
    { name: 'Kyrgyzstan', dial_code: '996', code: 'KG' },
    { name: 'Latvia', dial_code: '371', code: 'LV' },
    { name: 'Lebanon', dial_code: '961', code: 'LB' },
    { name: 'Lesotho', dial_code: '266', code: 'LS' },
    { name: 'Liberia', dial_code: '231', code: 'LR' },
    { name: 'Liechtenstein', dial_code: '423', code: 'LI' },
    { name: 'Lithuania', dial_code: '370', code: 'LT' },
    { name: 'Luxembourg', dial_code: '352', code: 'LU' },
    { name: 'Madagascar', dial_code: '261', code: 'MG' },
    { name: 'Malawi', dial_code: '265', code: 'MW' },
    { name: 'Malaysia', dial_code: '60', code: 'MY' },
    { name: 'Maldives', dial_code: '960', code: 'MV' },
    { name: 'Mali', dial_code: '223', code: 'ML' },
    { name: 'Malta', dial_code: '356', code: 'MT' },
    { name: 'Marshall Islands', dial_code: '692', code: 'MH' },
    { name: 'Martinique', dial_code: '596', code: 'MQ' },
    { name: 'Mauritania', dial_code: '222', code: 'MR' },
    { name: 'Mauritius', dial_code: '230', code: 'MU' },
    { name: 'Mayotte', dial_code: '262', code: 'YT' },
    { name: 'Mexico', dial_code: '52', code: 'MX' },
    { name: 'Monaco', dial_code: '377', code: 'MC' },
    { name: 'Mongolia', dial_code: '976', code: 'MN' },
    { name: 'Montenegro', dial_code: '382', code: 'ME' },
    { name: 'Montserrat', dial_code: '1664', code: 'MS' },
    { name: 'Morocco', dial_code: '212', code: 'MA' },
    { name: 'Myanmar', dial_code: '95', code: 'MM' },
    { name: 'Namibia', dial_code: '264', code: 'NA' },
    { name: 'Nauru', dial_code: '674', code: 'NR' },
    { name: 'Nepal', dial_code: '977', code: 'NP' },
    { name: 'Netherlands', dial_code: '31', code: 'NL' },
    { name: 'New Caledonia', dial_code: '687', code: 'NC' },
    { name: 'New Zealand', dial_code: '64', code: 'NZ' },
    { name: 'Nicaragua', dial_code: '505', code: 'NI' },
    { name: 'Niger', dial_code: '227', code: 'NE' },
    { name: 'Nigeria', dial_code: '234', code: 'NG' },
    { name: 'Niue', dial_code: '683', code: 'NU' },
    { name: 'Norfolk Island', dial_code: '672', code: 'NF' },
    { name: 'Norway', dial_code: '47', code: 'NO' },
    { name: 'Oman', dial_code: '968', code: 'OM' },
    { name: 'Pakistan', dial_code: '92', code: 'PK' },
    { name: 'Palau', dial_code: '680', code: 'PW' },
    { name: 'Panama', dial_code: '507', code: 'PA' },
    { name: 'Papua New Guinea', dial_code: '675', code: 'PG' },
    { name: 'Paraguay', dial_code: '595', code: 'PY' },
    { name: 'Peru', dial_code: '51', code: 'PE' },
    { name: 'Philippines', dial_code: '63', code: 'PH' },
    { name: 'Poland', dial_code: '48', code: 'PL' },
    { name: 'Portugal', dial_code: '351', code: 'PT' },
    { name: 'Puerto Rico', dial_code: '1 939', code: 'PR' },
    { name: 'Qatar', dial_code: '974', code: 'QA' },
    { name: 'Romania', dial_code: '40', code: 'RO' },
    { name: 'Rwanda', dial_code: '250', code: 'RW' },
    { name: 'Samoa', dial_code: '685', code: 'WS' },
    { name: 'San Marino', dial_code: '378', code: 'SM' },
    { name: 'Saudi Arabia', dial_code: '966', code: 'SA' },
    { name: 'Senegal', dial_code: '221', code: 'SN' },
    { name: 'Serbia', dial_code: '381', code: 'RS' },
    { name: 'Seychelles', dial_code: '248', code: 'SC' },
    { name: 'Sierra Leone', dial_code: '232', code: 'SL' },
    { name: 'Singapore', dial_code: '65', code: 'SG' },
    { name: 'Slovakia', dial_code: '421', code: 'SK' },
    { name: 'Slovenia', dial_code: '386', code: 'SI' },
    { name: 'Solomon Islands', dial_code: '677', code: 'SB' },
    { name: 'South Africa', dial_code: '27', code: 'ZA' },
    { name: 'Spain', dial_code: '34', code: 'ES' },
    { name: 'Sri Lanka', dial_code: '94', code: 'LK' },
    { name: 'Sudan', dial_code: '249', code: 'SD' },
    { name: 'Suriname', dial_code: '597', code: 'SR' },
    { name: 'Swaziland', dial_code: '268', code: 'SZ' },
    { name: 'Sweden', dial_code: '46', code: 'SE' },
    { name: 'Switzerland', dial_code: '41', code: 'CH' },
    { name: 'Tajikistan', dial_code: '992', code: 'TJ' },
    { name: 'Thailand', dial_code: '66', code: 'TH' },
    { name: 'Togo', dial_code: '228', code: 'TG' },
    { name: 'Tokelau', dial_code: '690', code: 'TK' },
    { name: 'Tonga', dial_code: '676', code: 'TO' },
    { name: 'Trinidad and Tobago', dial_code: '1 868', code: 'TT' },
    { name: 'Tunisia', dial_code: '216', code: 'TN' },
    { name: 'Turkey', dial_code: '90', code: 'TR' },
    { name: 'Turkmenistan', dial_code: '993', code: 'TM' },
    { name: 'Tuvalu', dial_code: '688', code: 'TV' },
    { name: 'Uganda', dial_code: '256', code: 'UG' },
    { name: 'Ukraine', dial_code: '380', code: 'UA' },
    { name: 'United Arab Emirates', dial_code: '971', code: 'AE' },
    { name: 'United Kingdom', dial_code: '44', code: 'GB' },
    { name: 'United States', dial_code: '1', code: 'US' },
    { name: 'Uruguay', dial_code: '598', code: 'UY' },
    { name: 'Uzbekistan', dial_code: '998', code: 'UZ' },
    { name: 'Vanuatu', dial_code: '678', code: 'VU' },
    { name: 'Yemen', dial_code: '967', code: 'YE' },
    { name: 'Zambia', dial_code: '260', code: 'ZM' },
    { name: 'Zimbabwe', dial_code: '263', code: 'ZW' },
  ];

  constructor(
    private receipientService: ReceipientsService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private configService: ConfigsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.clientId = this.authService.getClientId();

    this.getReceipients();

    this.addForm = this.fb.group({
      clientId: this.clientId,
      nationalId: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      gender: ['', Validators.required],
      relationship: ['', Validators.required],
      countryId: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: 0,
      phoneNumber: ['', Validators.required],
      relationship: ['', Validators.required]
    });

  }

  getCountries(){
    this.configService.getAllApprovedCountries()
    .subscribe(
      data => {
        // console.log(data);
        this.countries = data;
      },
      error => {
        console.log(error);  
      }
    )
  }

  onChangeRegion(ele) {
    this.countryCodes.forEach((code) => {
      if (code.name === ele.target.value) {
        this.prefix = code.dial_code;
      }
    });

    // console.log(this.prefix);
    
  }

  switch(areaToShow){
    if(areaToShow == 'add'){
      if(!this.countries){
        this.getCountries();
      }
      $('#viewSection').hide();
      $('#addSection').show();
    }
    else if(areaToShow == 'view'){
      $('#viewSection').show();
      $('#addSection').hide();
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

  addReceipient(form: FormGroup){

    if($('#phoneNumber').val() && this.prefix){
      this.addForm.patchValue({
        phoneNumber: this.prefix + $('#phoneNumber').val()
      });
    }
    else{
      this.toast.warning('Enter phone number');
      return false;
    }

    // console.log(form.value);
    
    if(form.valid){
      this.loader = true;
      this.receipientService.createReceipient(form.value)
      .subscribe(
        resp => {
          // console.log(resp);
          this.loader = false;
          this.toast.success('Receipient Created.!');
          this.getReceipients();
          this.switch('view');
        },
        error => {
          console.log(error);
          this.loader = false;
          if(error.error.message){
            this.toast.error(error.error.message);
          }
          else{
            this.toast.error('Oops. Something Happened.!');
          }
        }
      )
    }
    else{
      this.toast.warning('Missing required infomation.');
    }
  }

  loadRecipient(ref, targ){
    this.receipients.forEach(r => {
      if(r.id == ref){
        this.receipient = r;
      }
    });

    // console.log(this.receipient);
    this.editForm = this.fb.group({
      id: this.receipient.id,
      phoneNumber: [this.receipient.phoneNumber, Validators.required],
      relationship: [this.receipient.relationship, Validators.required]
    });

    $('#' + targ).modal('show');
  }

  updateNumber(form: FormGroup){
    // console.log(form.value);

    if(form.valid){
      this.nloader = true;
      this.receipientService.updateReceipientPhone(form.value.id, form.value.phoneNumber)
      .subscribe(
        resp => {
          // console.log(resp);
          this.toast.success('Phone Number Updated.!');
          $('#editNumber').modal('hide');
          this.getReceipients();
          this.nloader = false;
        },
        err => {
          console.log(err);
          if(err.error.message){
            this.toast.error(err.error.message);
          }
          else{
            this.toast.error('Failed to update Number.');
          }
          this.nloader = false;
        }
      )
    }
    else{
      this.toast.warning('Missing Info.')
    }
    
  }

  updateRelation(form: FormGroup){
    // console.log(form.value);

    if(form.valid){
      this.rloader = true;
      this.receipientService.updateReceipientRelation(form.value.id, form.value.relationship)
      .subscribe(
        resp => {
          // console.log(resp);
          this.toast.success('Relation Updated.!');
          $('#editRelation').modal('hide');
          this.getReceipients();
          this.rloader = false;
        },
        err => {
          console.log(err);
          if(err.error.message){
            this.toast.error(err.error.message);
          }
          else{
            this.toast.error('Failed to update Relation.');
          }
          this.rloader = false;
        }
      )
    }
    else{
      this.toast.warning('Missing Info.')
    }
    
  }

}
