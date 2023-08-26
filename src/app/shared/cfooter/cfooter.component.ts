import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cfooter',
  templateUrl: './cfooter.component.html',
  styleUrls: ['./cfooter.component.css']
})
export class CfooterComponent implements OnInit {

  myYear: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.myYear = new Date().getFullYear();
  }

  getPath(){
    return this.router.url;
  }

}
