import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { Role } from '../role/model/role';
import { User, Manager } from './model/user';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class UserComponent implements OnInit {
  addUserDialogBox: boolean = false;
  editUserDialog: boolean = false;
  uploadDialog: boolean = false;
  checked!: boolean;

  userForm!: FormGroup;
  allUsers: any[] = [];
  userData!: User;

  roles: Role[] = [];
  roles1: any[] = [];
  managers: Manager[] = [];
  partners: Manager[] = [];

  selectedFiles?: FileList;
  selectedRole!: Role;
  selectedManager!: string;
  selectedPartner!: string;
  selectedAccess1: string[] = [];
  selectedAccess2: string[] = [];
  selectedAccess3: string[] = [];
  selectedUser: any[] = [];

  access1: any[] = [
    { access: 'View' },
    { access: 'Edit' },
    { access: 'Download' },
    { access: 'Comment' },
  ];

  access2: any[] = [
    { access: 'View' },
    { access: 'Edit' },
    { access: 'Download' },
    { access: 'Comment' },
  ];

  access3: any[] = [
    { access: 'View' },
    { access: 'Edit' },
    { access: 'Approve Request' },
  ];

  firstNamePattern = '^[a-zA-Z ]{3,155}$';
  lastNamePattern = '^[a-zA-Z ]{3,155}$';
  // pwdPattern = "^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,12}$";
  mobnumPattern = '^((\\+91-?)|0)?[5,6,7,8,9]{1}[0-9]{9}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';

  userId!: string;
  userFormEditable: boolean = false;
  before!: boolean;
  isLoading: boolean = false;

  constructor(
    private vendorService: UserService,
    private roleService: RoleService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService
  ) {
    // this.roles = [
    //   { role: 'Super Admin' },
    //   { role: 'Admin' },
    //   { role: 'client' },
    //   { role: 'Business User' },
    // ];

    this.managers = [
      {
        name: 'Aniruddha Chakraborty',
        email: 'aniruddha.chakraborty@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Manjunathv Gowda',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Pranjal Nolakha',
        email: 'eshan.bhatt.tpr@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Rohit Sharma',
        email: 'eshan.bhatt.tpr@pwc.com',
        designation: 'Manager',
        location: 'Kolkata',
        LOS: 'Advisory',
      },

      {
        name: 'Sachin Madhukar Khaire',
        email: 'sachin.madhukar.khaire.tpr@pwc.com',
        designation: 'Manager',
        location: 'Gurugram',
        LOS: 'Advisory',
      },

      {
        name: 'Samson Daniel',
        email: 'aniruddha.chakraborty@pwc.com',
        designation: 'Manager',
        location: 'MUMBAI',
        LOS: 'Advisory',
      },
      {
        name: 'Subhajit Saha',
        email: 'eshan.bhatt.tpr@pwc.com',
        designation: 'Manager',
        location: 'Kolkata',
        LOS: 'Advisory',
      },
      {
        name: 'Sounak Sarkar',
        email: 'aniruddha.chakraborty@pwc.com',
        designation: 'Manager',
        location: 'BENGALURU',
        LOS: 'Advisory',
      },
      {
        name: 'Shruti  Solanki',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Manager',
        location: 'BENGALURU',
        LOS: 'Advisory',
      },
      {
        name: 'Vikas Batra',
        email: 'vikas.batra@pwc.com',
        designation: 'Manager',
        location: 'Gurugram',
        LOS: 'Advisory',
      },
    ];

    this.partners = [
      {
        name: 'Ashootosh Chand',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Partner',
        location: 'BENGALURU',
        LOS: '',
      },
      {
        name: 'Mihir Gandhi',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Partner',
        location: 'MUMBAI',
        LOS: '',
      },
      {
        name: 'Rameshwar Solange',
        email: 'rameshwar.solange.tpr@pwc.com',
        designation: 'Partner',
        location: 'MUMBAI',
        LOS: '',
      },
    ];
  }

  currentTime!: Date;
  intervalId: any;

  ngOnInit(): void {

    // this.intervalId = setInterval(() => {
    //   this.currentTime = new Date();
    //   console.log(this.currentTime);
      
    // }, 1000); // Update every 1 second


    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    for (let i = 0; i < this.roles1.length; i++) {
      this.roles1 = this.roles1.sort((a: any, b: any) => {
        if (a.role < b.role) return -1;
        if (a.role > b.role) return 1;
        return 0;
      });
    }

    this.spinner.isLoading.next(true);

    this.userForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.firstNamePattern),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(this.lastNamePattern),
      ]),
      mobileNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.mobnumPattern),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      role: new FormControl(''),
      manager: new FormControl(''),
      partner: new FormControl(''),
      userStatus: new FormControl(''),
      createdOn: new FormControl(''),
      createdBy: new FormControl(''),
      editedBy: new FormControl(''),
    });

    // to fetch all roles

    this.roleService.getRoles().subscribe(
      (data: any) => {
        this.before = true;
        this.roles1=[];
        this.getActiveRoles(data);
        this.before = false;
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // to fetch all users
    this.vendorService.getuUser().subscribe(
      (data: any) => {
        this.allUsers = data;
        this.allUsers.reverse();
        // console.log(this.allUsers, ' all Users');
        this.spinner.isLoading.next(false);
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }


  getActiveRoles(data:any){
    for (let i = 0; data.length; i++) {
      if (data[i].roleStatus === 'Active') {
        const activeRoles = data[i];
        this.roles1.push(activeRoles);
      }
    }
  }


  onClickAddUser() {
    this.checked = true;
    this.addUserDialogBox = true;
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  onClickSave() {
    if (this.checked) {
      this.userForm.value.userStatus = 'Active';
    } else {
      this.userForm.value.userStatus = 'Inactive';
    }
    
    // get role by roleName

    this.roleService.getRoleByName(this.userForm.value.role).subscribe(
      (data: any) => {
        // console.log(data," get role by rolename");

        this.userForm.value.role = data;
        this.userForm.value.editedBy=sessionStorage.getItem('email');
        this.userForm.value.createdBy=sessionStorage.getItem('email');


        // this.userForm.value.createdBy=sessionStorage.getItem('email');
        // this.userForm.value.editedBy=sessionStorage.getItem('email');
        // console.log(this.userForm.value," before service");

        this.vendorService.addUser(this.userForm.value).subscribe(
          (data: any) => {
            this.addUserDialogBox = false;

            this.spinner.isLoading.next(true);
            // console.log(data);
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'user addedd successfully',
            });

            this.userForm.reset();
            this.ngOnInit();
          },
          (error: HttpErrorResponse) => {
            if (error.status === 406) {
              this.messageService.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'Email or Mobile number should not be duplicate',
              });
              this.spinner.isLoading.next(false);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'error..!!',
                detail: 'Something went wrong, please try again',
              });
              this.spinner.isLoading.next(false);

              this.addUserDialogBox = false;
              this.ngOnInit();
            }
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );

    // this.userForm.value.userStatus = this.checked;
    // console.log(this.userForm.value, ' all data to be post');
  }

  onClickUpdate() {
    this.userForm.value.editedBy=sessionStorage.getItem('email');

    // console.log(JSON.stringify(this.userForm.value), ' data to be updated');

    // this.userData.status = this.checked;
    if (this.checked) {
      this.userForm.value.userStatus = 'Active';
    } else {
      this.userForm.value.userStatus = 'Inactive';
    }
    this.roleService
      .getRoleByName(this.userForm.value.role)
      .subscribe((data: any) => {
        this.userForm.value.role = data;
        this.confirmationService.confirm({
          message: 'Are you sure that you want to edit this user?',
          accept: () => {
            this.spinner.isLoading.next(true);
            this.addUserDialogBox = false;
            this.vendorService
              .updateUser(this.userForm.value, this.userId)
              .subscribe(
                (data: any) => {
                  // console.log('User Updated' + data);
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'user updated Successfully',
                  });
                  this.spinner.isLoading.next(false);

                  this.userForm.reset();
                  this.ngOnInit();
                },
                (error: HttpErrorResponse) => {
                  if (error.status === 500) {
                    this.messageService.add({
                      severity: 'warn',
                      summary: 'Warning',
                      detail: 'Email or Mobile number shuould be duplicate',
                    });
                    this.spinner.isLoading.next(false);
                  } else {
                    this.messageService.add({
                      severity: 'error',
                      summary: 'error..!!',
                      detail: 'Something went wrong, please try again..!!',
                    });
                    this.spinner.isLoading.next(false);
                  }
                }
              );
          },

          reject: () => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Cancelled',
              detail: 'user not updated',
            });
          },
        });
      });
  }

  onClickCancle() {
    this.userFormEditable = false;
    this.addUserDialogBox = false;
    this.editUserDialog = false;
    this.uploadDialog = false;
    this.userForm.reset();
  }

  editUser(id: string) {
    this.vendorService.getUserById(id).subscribe(
      (data: any) => {
        this.userData = data;
        // console.log(this.userData, ' user data by id');

        if (this.userData.userStatus === 'Active') {
          this.checked = true;
        } else {
          this.checked = false;
        }

        this.userId = this.userData.id;
        this.userForm.get('firstName')?.patchValue(this.userData.firstName);
        this.userForm.get('lastName')?.patchValue(this.userData.lastName);
        this.userForm
          .get('mobileNumber')
          ?.patchValue(this.userData.mobileNumber);
        this.userForm.get('email')?.patchValue(this.userData.email);
        this.userForm.get('role')?.patchValue(this.userData.role.roleName);
        // this.selectedRole=this.userData.role;
        this.userForm.get('manager')?.patchValue(this.userData.manager);
        this.userForm.get('partner')?.patchValue(this.userData.partner);
        this.userForm.get('userStatus')?.patchValue(this.userData.userStatus);
        this.userForm.get('createdOn')?.patchValue(this.userData.createdOn);
        this.userForm.get('createdBy')?.patchValue(this.userData.createdBy);
        this.userForm.get('editedBy')?.patchValue(sessionStorage.getItem('email'));
        this.userFormEditable = true;

        this.addUserDialogBox = true;
      },
      (error: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'Danger',
          summary: 'Error',
          detail: 'Something went wrong while adding user..!!',
        });
      }
    );
  }

  deleteUser() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete User?',
      accept: () => {
        for (let user of this.selectedUser) {
          this.vendorService.deleteUser(user.id).subscribe(
            (data: any) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'user deleted successfully',
              });
              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              this.messageService.add({
                severity: 'Danger',
                summary: 'Error',
                detail: 'Something went wrong while deleting user..!!',
              });
            }
          );
        }
        this.selectedUser = [];
        this.ngOnInit();
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'user not deleted',
        });
      },
    });
  }

  uploadUsers() {
    this.uploadDialog = true;
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  uploadFile() {
    alert('file uploaded successfully');
    this.uploadDialog = false;
  }

  roleSelection() {
    // alert(this.selectedRole)
  }

  getStatusClass(status: any) {
    // console.log('status: ', status);
    switch (status) {
      case 'Active':
        return 'status-badge status-badge-active';
        break;
      case 'Inactive':
        return 'status-badge status-badge-pending';
      }
    return '';
  }
}
