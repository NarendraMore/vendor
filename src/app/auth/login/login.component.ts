import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppModuleConstants } from 'src/app/app-constants';
import { AppComponent } from 'src/app/app.component';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import jwt_decode from 'jwt-decode';
import { AuthserviceService } from './authservice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService, ConfirmationService],

})
export class LoginComponent implements OnInit {
  project: FormGroup;
  data: any;

  constructor(
    private router: Router,
    private vendorService: VendorMngServiceService,
    private authservice: AuthserviceService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
    this.project = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    
  }

  getDecodedAccessToken(token: string): any {
    try {
      const data: any = jwt_decode(token);
      // console.log(data, 'all token data');

      sessionStorage.setItem('token', data.openIdToken);
      return data.openIdToken;
    } catch (Error) {
      return null;
    }
  }

  getDecodedOpenIdToken(token: string): any {
    try {
      // console.log('openId token');
      // console.log(jwt_decode(token));

      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  // onLogin() {
  //   this.data = this.project.value;
  //   console.log(this.data);

  //   if (
  //     this.data.username === 'admin@gmail.com' &&
  //     this.data.password === 'Admin@123'
  //   ) {
  //     sessionStorage.setItem(AppModuleConstants.USER, this.data.username);
  //     sessionStorage.setItem(AppModuleConstants.ROLE, '1');
  //     this.router.navigate(['/Admin']);
  //   } else if (
  //     this.data.username === 'businessuser@gmail.com' &&
  //     this.data.password === 'business@123'
  //   ) {
  //     sessionStorage.setItem(AppModuleConstants.USER, this.data.username);
  //     sessionStorage.setItem(AppModuleConstants.ROLE, '2');
  //     this.router.navigate(['/BusinessUser']);
  //   } else if (
  //     this.data.username === 'clientuser@gmail.com' &&
  //     this.data.password === 'clientuser@123'
  //   ) {
  //     sessionStorage.setItem(AppModuleConstants.USER, this.data.username);
  //     sessionStorage.setItem(AppModuleConstants.ROLE, '3');
  //     this.router.navigate(['/ClientUser']);
  //   } else {
  //     alert('Incorrect Crediantials....!!');
  //     this.project.reset();
  //     this.router.navigate(['/']);
  //   }
  // }

  onLogin() {

    this.authservice.loginUser(this.project.value).subscribe(
      (response: any) => {
        // console.log(response, 'login successfull');
        let data = this.getDecodedAccessToken(response.access_token);
        let data1 = this.getDecodedOpenIdToken(data);
        // console.log('extracted data from openID token:', data1);

        if (data1.roles[0] === 'admin') {
          sessionStorage.setItem(AppModuleConstants.USER, data1.given_name);
          sessionStorage.setItem(AppModuleConstants.LASTNAME, data1.family_name);
          sessionStorage.setItem(AppModuleConstants.ROLE, '1');
          sessionStorage.setItem(AppModuleConstants.EMAIL, data1.email);
          this.router.navigate(['/Admin']);            
     
        } else if (data1.roles[0] === 'businessuser') {
          sessionStorage.setItem(AppModuleConstants.USER, data1.given_name);
          sessionStorage.setItem(AppModuleConstants.LASTNAME, data1.family_name);
          sessionStorage.setItem(AppModuleConstants.ROLE, '2');
          sessionStorage.setItem(AppModuleConstants.USERNAME, data1.preferred_username);
          sessionStorage.setItem(AppModuleConstants.EMAIL, data1.email);

          this.router.navigate(['/BusinessUser']);

        } else if (data1.roles[0] === 'clientuser') {
          sessionStorage.setItem(AppModuleConstants.USER, data1.given_name);
          sessionStorage.setItem(AppModuleConstants.LASTNAME, data1.family_name);
          sessionStorage.setItem(AppModuleConstants.ROLE, '3');
          sessionStorage.setItem(AppModuleConstants.USERNAME, data1.preferred_username);
          sessionStorage.setItem(AppModuleConstants.EMAIL, data1.email);
          this.router.navigate(['/ClientUser']);

        } else {
          alert('Incorrect Crediantials....!!');
          this.project.reset();
          this.router.navigate(['/']);
        }

      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error..!!',
          detail: "Incorrect Credentials..!! ",
        });
      }
    );
  }

  // loginSuccess(){
  //   if (data1.roles[0] === 'admin') {
  //     sessionStorage.setItem(AppModuleConstants.USER, data1.given_name);
  //     sessionStorage.setItem(AppModuleConstants.ROLE, '1');

  //     setTimeout(() => {
  //     this.router.navigate(['/Admin']);            
  //     }, 1300);

  //   }
  // }
}
