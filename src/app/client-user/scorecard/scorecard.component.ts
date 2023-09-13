import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScorecardService } from './scorecard.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.css'],
})
export class ScorecardComponent implements OnInit {
  scorecards: any;
  allData: any[] = [];
  projectList1: any[] = [];

  projects: any;
  selectedProject!: string;
  constructor(
    private service: ScorecardService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projectService.getClients().subscribe(
      (data: any) => {
        this.projects = data;
        // console.log(this.projects, 'projects');

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
    this.service.getScorecards().subscribe(
      (data: any) => {
        // this.scorecards = data;
        // console.log(this.scorecards, ' all scorecards');
        this.scorecards = this.transformTempalteClientuserData(data);
        this.projectList1 = this.transformDraftProjectList(this.scorecards);
        this.scorecards.reverse();
        // console.log("without reverse: ",this.scorecards);
        // console.log("with reverse:",this.scorecards.reverse());
      },
      (error: any) => {
        alert('something went wrong while getting all scorecards');
      }
    );
  }

  transformTempalteClientuserData(inputData: any) {
    this.allData = [];
    const categoryData = inputData.filter((data: any) => {
      // console.log(data, 'data of single project');
      for (let i = 0; i < data.projectData.businessUser.length; i++) {
        // console.log(data.projectData.businessUser[i]);

        if (
          data.projectData.businessUser[i] === sessionStorage.getItem('email')
        ) {
          this.allData.push(data);
        }
      }
    });
    this.allData=this.transformScorecardByVendor(this.allData);

    return this.allData;
    // return categoryData4;
  }

  transformScorecardByVendor(inputData: any) {
    // console.log("scorecards for logged in users:",inputData);
    
    let scorecardDataByVendor = inputData.filter((data: any) => {
      // console.log('draft data????????????', data);
      if (
        data.projectData.selectedVendors?.includes(data.vendorObject.vendorName)
      ) {
        return data;
      }
    });
    // console.log("scorecardDataByVendor: ",scorecardDataByVendor);
    
    return scorecardDataByVendor;
  }

  transformDraftProjectList(inputData: any) {
    let projectData = inputData
      .filter((data: any) => {
        // console.log('all project data????????????', data);

        return data.projectData.projectName;
      })
      .map((data: any) => {
        return { projectName: data.projectData.projectName };
      });
    projectData = Array.from(
      new Set(projectData.map((data: any) => JSON.stringify(data)))
    ).map((data: any) => JSON.parse(data));

    projectData.sort((a: any, b: any) => {
      const nameA = a.projectName.toLowerCase();
      const nameB = b.projectName.toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    return projectData;
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

  target(event: any): HTMLInputElement {
    if (!(event.target instanceof HTMLInputElement)) {
      throw new Error('wrong target');
    }
    return event.target;
  }

  navigateTemplateDetails(scorecardId: any) {
    // console.log('scorecardId: ', scorecardId);
    this.router.navigate(['/ClientUser/scorcard/' + scorecardId]);
  }
}
