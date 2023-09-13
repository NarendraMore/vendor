import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';
import { VendorService } from 'src/app/services/vendor.service';
import { lineOfBusiness, Vendor } from './model/vendor';
import { ProjectService } from 'src/app/services/project.service';
import { LibraryService } from 'src/app/services/library.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class VendorComponent implements OnInit {
  addVendorDialogBox: boolean = false;
  editVendorDialog: boolean = false;
  checked: boolean = true;
  vendorForm!: FormGroup;
  addlineOfBusinessForm!: FormGroup;
  allVendors: any[] = [];
  vendorData!: Vendor;
  editable:boolean=false;

  allLineOfBusiness: any [] = [];

  selectedFiles?: FileList;
  selectedLineOfBusiness!: string;
  selectedId: string[] = [];

  vendorNamePattern ='^([0-9a-zA-Z!@#$%^&*()_+ -]{3,155})$';
  spocNamePattern = '^([a-zA-Z ]{3,200})$';
  mobnumPattern = '^((\\+?)|0)?[0-9]{3,20}$';
  emailPattern = '^[A-Za-z0-9._%+-]+[@]{1}[A-Za-z0-9.-]+[.]{1}[A-Za-z]{2,4}$';

  vendorId!: string;
  editVendorForm: boolean = false;
  projects: any;
  updateButton: boolean = false;
  save: boolean = false;
  update: boolean = false;
  isLoading: boolean = false;
  flagAdding: boolean = false;

  constructor(
    private vendorService: VendorService,
    private messageService: MessageService,
    private projectService: ProjectService,
    private masterRepoService: LibraryService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService,
    private user: UserService
  ) {
    
}

  ngOnInit(): void {
    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });
    this.masterRepoService.getCategories().subscribe(
      (data: any) => {
    //  console.log(data,'data./....');
    this.allLineOfBusiness=this.transformlineofBusiness(data);
     
    
     
    });
    this.spinner.isLoading.next(true);

    // this.allLineOfBusiness = [
    //   { businessName: 'Hospitality ' },
    //   { businessName: 'IT' },
    //   { businessName: 'Logistics ' },
    //   { businessName: 'Manufacturing' },
    //   { businessName: 'Real Estate' },
    //   { businessName: 'Retailing' },
    // ];

    this.addlineOfBusinessForm = new FormGroup({
      lineOfBusiness: new FormControl('', [Validators.required]),
    });


    this.vendorForm = new FormGroup({
      vendorName: new FormControl('', [Validators.required,Validators.pattern(this.vendorNamePattern)]),
      spocName: new FormControl('', [Validators.required,Validators.pattern(this.spocNamePattern)]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      contactNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(this.mobnumPattern),
      ]),
      lineOfBusiness: new FormControl(''),
      createdBy: new FormControl(''),
      modifiedBy: new FormControl(''),
      createdOn: new FormControl(''),
      // createdOn: new FormControl(''),
      // projectId: new FormControl('',[Validators.required]),
    });

    // to fetch all users
    this.vendorService.getVendors().subscribe(
      (data: any) => {
        this.allVendors = data;
        // console.log(this.allVendors);
        this.spinner.isLoading.next(false);
   
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
        this.spinner.isLoading.next(false);
      }
    );


    //get projects
    this.projectService.getClients().subscribe(
      (data: any) => {
        this.projects = data;
      
        // console.log(this.projects);
        for (let i = 0; i < this.projects.length; i++) {
          this.projects = this.projects.sort((a: any, b: any) => {
            if (a.projectName < b.projectName) return -1;
            if (a.projectName > b.projectName) return 1;
            return 0;
          });
         
          
        }
      },
      (error: HttpErrorResponse) => {
        alert('something went wrong');
      }
    );
  }

  onClickAddVendor() {
    this.addVendorDialogBox = true;
    this.update = false;
    this.save = true;
  }

  handleChange(e: any) {
    this.checked = e.checked;
  }

  onClickSave() {
    // this.vendorForm.value.lineOfBusiness = this.selectedLineOfBusiness;

    // this.vendorService
    //   .addVendor(this.vendorForm.value)
    //   .subscribe((data: any) => {
    //    console.log(data);

    //     if (data.status === 200) {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Successfull',
    //         detail: 'Vendor addedd successfully',
    //       });
    //       console.log(data,"response...!!");
    //       this.addVendorDialogBox = false;
    //       this.ngOnInit();
    //     } else if(data.status===404) {
    //       console.log(data,"response...!!");

    //     }
    //     else{
    //       alert("xyz")
    //     }
    //   });

    // this.vendorForm.value.lineOfBusiness = this.selectedLineOfBusiness;

    this.addVendorDialogBox = false;
    this.spinner.isLoading.next(true);

    this.vendorForm.value.createdBy=sessionStorage.getItem('email');
    this.vendorForm.value.modifiedBy=sessionStorage.getItem('email');


    this.vendorService.addVendor(this.vendorForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succesful',
          detail: 'Vendor addedd successfully',
        });
        this.spinner.isLoading.next(false);

        this.vendorForm.reset();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.messageService.add({
            severity: 'warn',
            summary: 'warning  ',
            detail: 'Vender already Exist...!!',
          });
          this.spinner.isLoading.next(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'error..!!',
            detail: 'Something went wrong, please try again',
          });
          this.spinner.isLoading.next(false);

          this.vendorForm.reset();
          this.ngOnInit();
        }
      }
    );
   
  }

  onClickUpdate() {
    // console.log(this.vendorData);

    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Vendor?',
      accept: () => {
        this.addVendorDialogBox = false;
        this.spinner.isLoading.next(true);
        this.vendorForm.value.modifiedBy=sessionStorage.getItem('email');

        this.vendorService
          .updateVendor(this.vendorForm.value, this.vendorId)
          .subscribe(
            (data: any) => {
              // console.log('Vendor Updated' + data);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Vendor updated Successfully',
              });

              this.spinner.isLoading.next(false);

              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              if (error.status === 500) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Warning',
                  detail: 'Vendor Already Exist...!!',
                });
                this.spinner.isLoading.next(false);
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'error...!!',
                  detail: 'Something went wrong, please try again',
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
          detail: 'vendor not updated',
        });
      },
    });
  }

  onClickCancle() {
    this.editable=false
    this.editVendorForm = false;
    this.addVendorDialogBox = false;
    this.editVendorDialog = false;
    this.updateButton = false;
    this.vendorForm.reset();
  }

  editVendor(vendor:any) {
    // this.updateButton=true;
    this.vendorService.getVendorById(vendor.vendorId).subscribe(
      (data: any) => {

        // console.log(vendor);
        
        this.vendorData = data;
        // this.save=false;
        // this.update=true;
        // this.vendorForm.get('vendorName')?.patchValue(this.vendorData.vendorName);
        // this.vendorForm.get('spocName')?.patchValue(this.vendorData.spocName);
        // this.vendorForm.get('email')?.patchValue(this.vendorData.email);
        // this.vendorForm.get('contactNumber')?.patchValue(this.vendorData.contactNumber);
        // this.vendorForm.get('lineOfBusiness')?.patchValue(this.vendorData.lineOfBusiness);

        this.vendorId = vendor.vendorId;
        this.vendorForm
          .get('vendorName')
          ?.patchValue(vendor.vendorName);
        this.vendorForm.get('spocName')?.patchValue(vendor.spocName);
        this.vendorForm.get('email')?.patchValue(vendor.email);
        this.vendorForm
          .get('contactNumber')
          ?.patchValue(vendor.contactNumber);
        this.vendorForm
          .get('lineOfBusiness')
          ?.patchValue(vendor.lineOfBusiness);
        this.vendorForm
          .get('createdOn')
          ?.patchValue(vendor.createdOn);
        this.vendorForm
          .get('createdBy')
          ?.patchValue(vendor.createdBy);

        this.editVendorForm = true;
        this.addVendorDialogBox = true;

        this.user.getUserByMailId(vendor.createdBy).subscribe(
          (data: any) => {
            // console.log('logged in user: ', data);
            if (data.email === sessionStorage.getItem('email')) {
              this.editable = false;
            }else{
            this.editable = true;
            }
          },
          (error: HttpErrorResponse) => {
            alert('User details not found...!!');
          }
        );


        // console.log('vendor data', this.vendorData);
      },
      (error: HttpErrorResponse) => {
        alert(error);
      }
    );


    // this.projectService.getProjectById(vendor.projectId).subscribe(
    //   (data:any)=>{
    //     console.log(data,"././././");
        
    //     this.vendorForm.get('projectId')?.patchValue(data.projectId);
    //   }
    // )
  }

  onClickAddLineOfBusiness() {
    this.flagAdding = true;
  }

  onClickCancle2() {
    this.editable=false
    this.addlineOfBusinessForm.reset();
  }


  onClickSaveLineofBuisnes() {
    // console.log(this.addlineOfBusinessForm.value, 'line Of Business.....');
    const lineofBuisness ={
      value:this.addlineOfBusinessForm.value.lineOfBusiness,
      type :'Buisness'
    }
   
    this.flagAdding=false;

    this.masterRepoService.addCategory(lineofBuisness).subscribe(
      (data: any) => {
 
    this.masterRepoService.getCategories().subscribe(
      (data: any) => {
    //  console.log(data,'data./....');
     
      // console.log(this.categoriesData, ' data');
      // this.allLineOfBusiness.push(lineofBuisness) 


      this.allLineOfBusiness =this.transformlineofBusiness(data);
       

        // this.spinner.isLoading.next(false);
      },
      (error: any) => {
        // alert(error);
        // this.spinner.isLoading.next(false);
        this.messageService.add({
          severity: 'Error',
          summary: 'Error',
          detail: "Error while fetching master library details..!!",
        });
      }
    );
        this.messageService.add({
          severity: 'success',
          summary: 'success...!!',
          detail: 'Line of Business added',
        });
        // this.spinner.isLoading.next(false);
        // this.categoryForm.reset();
        // this.ngOnInit();
        // console.log(data,'data');
        

      },
      (error: HttpErrorResponse) => {
        if (error.status === 500  ) {
          this.messageService.add({
            severity: 'warn',
            summary: 'error...!!',
            detail: 'Line item already present in library',
          });
          this.spinner.isLoading.next(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'error...!!',
            detail: 'something went wrong, try again',
          });
        }
        // this.spinner.isLoading.next(false);
      }
    );
     }
lineofBusinessData :any[]=[];
// lineofBusinessData1 :any[]=[];

     transformlineofBusiness(inputData:any){
      const allLineOfBusiness = inputData
      .filter((item:any) => item.type === 'Buisness')
      .map((item:any) => ({ businessName: item.value }))
      .sort((a:any, b:any) => {
        const nameA = a.businessName.toLowerCase();
        const nameB = b.businessName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      return allLineOfBusiness;
     }

  deleteVendor(id: string) {
    //   console.log(id," id to be deleted");

    //   this.confirmationService.confirm({
    //     message: 'Are you sure that you want to Delete this Vendor?',
    //     accept: () => {
    //       this.vendorService.deleteVendor(id).subscribe(
    //         (data: any) => {
    //           this.messageService.add({
    //             severity: 'success',
    //             summary: 'Deleted',
    //             detail: 'Vendor deleted successfully',
    //           });
    //           this.editVendorDialog=false;
    //           this.ngOnInit();
    //         },
    //         (error: HttpErrorResponse) => {
    //           this.messageService.add({
    //             severity: 'danger',
    //             summary: 'Error',
    //             detail: 'Something went wrong while deleting vendor',
    //           });
    //         }
    //       );

    //       this.selectedId = [];
    //       this.ngOnInit();
    //     },
    //     reject: () => {
    //       this.messageService.add({
    //         severity: 'warn',
    //         summary: 'Cancelled',
    //         detail: 'Vendor not deleted',
    //       });
    //     },
    //   });

    this.confirmationService.confirm({
      message: 'Are you sure that you want to Delete this Vendor?',
      accept: () => {
        this.vendorService.deleteVendor(id).subscribe(
          (data: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully deleted',
              detail: 'Vendor deleted successfully',
            });
            this.addVendorDialogBox = false;
            this.ngOnInit();
          },
          (error: any) => {
            this.messageService.add({
              severity: 'success',
              summary: 'success',
              detail: 'Vendor deleted successfully',
            });
            // this.editVendorDialog = false;
            // this.ngOnInit();
          }
        );
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Vendor not deleted',
        });
      },
    });
  }

  onClickCancelLOB(){
    this.addlineOfBusinessForm.reset();
    this.flagAdding=false;

  }
}
