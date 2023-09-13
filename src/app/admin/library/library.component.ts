import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LibraryService } from 'src/app/services/library.service';
import { LoadingSpinnerService } from 'src/app/services/loading-spinner.service';

export interface lineItemType {
  type: string;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class LibraryComponent implements OnInit {
  selectedProducts: any[] = [];
  isLoading: boolean = false;
  editLineItemForm: boolean = false;
  // lineItemId!:string;
  lineItemId!: string;
  categoryForm!: FormGroup;
  categoriesData: any[] = [];
  addCategoryDialogBox: boolean = false;
  editCategoryForm: boolean = false;
  lineItemtypes: lineItemType[] = [];
  selectedType!: string;
  closable:boolean = false
  // valuePattern = "^[a-zA-Z .,]{3,155}$";


  constructor(
    private masterRepoService: LibraryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private spinner: LoadingSpinnerService
  ) {
    this.lineItemtypes = [
      { type: 'Business' },
      { type: 'Category' },
      { type: 'Industry' },
      { type: 'Parameter' },
      { type: 'Subcategory' },
     
    ];
  }

  ngOnInit(): void {
    this.spinner.isLoading.subscribe((val) => {
      this.isLoading = val;
    });

    this.spinner.isLoading.next(true);

    this.categoryForm = new FormGroup({
      value: new FormControl('', [Validators.required,Validators.minLength(2),Validators.maxLength(255)]),
      type: new FormControl('', Validators.required),
    });

    this.masterRepoService.getCategories().subscribe(
      (data: any) => {
        this.categoriesData = data;
        // console.log(this.categoriesData, ' data');
        this.spinner.isLoading.next(false);
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
  }

  onClickAdd() {
    this.addCategoryDialogBox = true;
    this.categoryForm.reset();
  }

  onClickCancle() {
    this.addCategoryDialogBox = false;
    this.editCategoryForm = false;
  }

  onClickSave() {
    this.addCategoryDialogBox = false;
    this.spinner.isLoading.next(true);

    this.masterRepoService.addCategory(this.categoryForm.value).subscribe(
      (data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'success...!!',
          detail: 'Line Item added',
        });
        this.spinner.isLoading.next(false);
        this.categoryForm.reset();
        this.ngOnInit();
      },
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.messageService.add({
            severity: 'warn',
            summary: 'error...!!',
            detail: 'Line Item already present',
          });
          this.spinner.isLoading.next(false);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'error...!!',
            detail: 'something went wrong, try again',
          });
        }
        this.spinner.isLoading.next(false);
      }
    );
  }

  onClickEdit(category: any) {
    // console.log(category);

    this.lineItemId = category.id;
    this.categoryForm.get('value')?.patchValue(category.value);
    this.categoryForm.get('type')?.patchValue(category.type);

    this.editCategoryForm = true;
    this.addCategoryDialogBox = true;
  }

  onClickUpdate() {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to edit this Line Item?',
      accept: () => {
        this.addCategoryDialogBox = false;
        this.spinner.isLoading.next(true);

        this.masterRepoService
          .editLineItem(this.lineItemId, this.categoryForm.value)
          .subscribe(
            (data: any) => {
              // console.log(data, ' updated successfully');
              this.messageService.add({
                severity: 'success',
                summary: 'success...!!',
                detail: 'Line Item Updated successfully',
              });
              this.spinner.isLoading.next(false);
              this.categoryForm.reset();
              this.ngOnInit();
            },
            (error: HttpErrorResponse) => {
              if (error.status === 406) {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'error...!!',
                  detail: 'Line Item already present',
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
          detail: 'Line Item not updated',
        });
      },
    });
  }

  onClickDelete() {
    // console.log(this.selectedProducts);
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected Line Items?',
      accept: () => {
        for (let i = 0; i < this.selectedProducts.length; i++) {
          this.masterRepoService
            .deleteLineItem(this.selectedProducts[i].id)
            .subscribe(
              (data: any) => {
                 this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Line Item deleted successfully',
              });
                // console.log(this.selectedProducts[i], ' deleted successfully');
                this.selectedProducts = [];
                this.ngOnInit();
              },
              (error: HttpErrorResponse) => {
                // alert(error);
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: "Error while deleting...!!",
                });
              }
            );
        }
      },
      reject: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Cancelled',
          detail: 'Line Item not deleted',
        });
      },
    });
  }

  editLineItem(data:any){

    this.lineItemId = data.id;

    this.categoryForm.get('value')?.patchValue(data.value);
        this.categoryForm.get('type')?.patchValue(data.type);

        this.editLineItemForm=true;
  }
}
