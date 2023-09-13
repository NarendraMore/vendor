import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VendorMngServiceService } from 'src/app/vendor-mng-service.service';
import { Template } from './newtemplate/template-details/model/template';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css'],
})
export class TemplateComponent implements OnInit {
  templateDetails: Template[] = [];
  allData: any[] = [];
  projects:any;
  selectedProject!: string;
  projectList1:any[]=[];

  constructor(
    private router: Router,
    private service: VendorMngServiceService,
    private projectService: ProjectService
  ) {}
  ngOnInit(): void {

    this.projectService.getClients().subscribe(
      (data: any) => {
        this.projects = data;
        // console.log(this.projects,'projects');
        
      
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
    this.service.getTemplateDetails().subscribe(
      (data: any) => {
        // this.templateDetails = data;
       
        this.templateDetails =this.transformTempalteClientuserData(data);
        this.projectList1 = this.transformDraftProjectList(
          this.templateDetails      
        );
        this.templateDetails.reverse();
        // console.log( this.templateDetails ,' this.templateDetails...  ');
      },
      (error: HttpErrorResponse) => {
        window.location.reload();

      }
    );
  }


  transformTempalteClientuserData(inputData: any) {
    this.allData=[];
    // console.log(inputData, 'inputData1');
    const categoryData = inputData.filter((data: any) => {
      // console.log(data, "data of single project");
      for (let i = 0; i < data.project.businessUser.length; i++) {
        // console.log(data.project.businessUser[i]);

        if (data.project.businessUser[i] === sessionStorage.getItem('email')) {
          this.allData.push(data)
          console.log(this.allData,'all data');
        }
      }
    });
    return this.allData;
    
    
  }


  transformDraftProjectList(inputData: any) {
    
    
    let projectData = inputData
      .filter((data: any) => {
        // console.log('all project data????????????', data);

        return data.project.projectName;
      })
      .map((data: any) => {
        return { projectName: data.project.projectName };
      });
      projectData = Array.from(new Set(projectData.map((data: any) => JSON.stringify(data))))
      .map((data: any) => JSON.parse(data));

      projectData.sort((a:any, b:any) => {
        const nameA = a.projectName.toLowerCase();
        const nameB = b.projectName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

    return projectData;
  }





  onClickAddTemplate() {
    this.router.navigate(['/ClientUser/create-template']);
  }

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }

  getStatusClass(status: any) {
    switch (status) {
      case 'Pending':
        return 'status-badge status-badge-pending';
        break;
      case 'In Progress':
        return 'status-badge status-badge-progress';
      case 'Done':
        return 'status-badge status-badge-success';
    }
    return '';
  }

  navigateTemplateDetails(templateId: any) {
    this.service.templateDetails = this.templateDetails.filter((data: any) => {
      return data.templateId == templateId;
    });
    // console.log('TD: ', this.service.templateDetails);
    // console.log('this.service.templateDetails: ', this.service.templateDetails);
    this.router.navigate(['/ClientUser/template-list/' + templateId]);
  }
}
