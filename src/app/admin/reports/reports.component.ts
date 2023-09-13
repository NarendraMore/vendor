import { Component,ElementRef, OnInit } from '@angular/core';
import { PublicClientApplication } from '@azure/msal-browser';
import { EventHandler } from 'powerbi-client-angular/components/powerbi-embed/powerbi-embed.component';
import * as models from 'powerbi-models';
import { NewpowerbiServiceService } from 'src/app/services/newpowerbi-service.service';
import { environment } from 'src/environments/environment';


declare var powerbi: any;
declare var $: any;
interface PowerBiClient {
  models: any;

}
interface WindowWithPowerBiClient extends Window {
  ['powerbi-client']: PowerBiClient;
}

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
 
  workSpaceId = `${environment.workSpaceId}`
  reportId = `${environment.reportId}`
  tenant_id = `${environment.tenant_id}`
  clientId = `${environment.clientId}`
  clientSecret = `${environment.clientSecret}`
  powerbiScope= `${environment.powerbiScope}`
  username= `${environment.username}`
  resource= `${environment.resource}`
  password= `${environment.password}`
  grant_type= `${environment.grant_type}`


  accessToken: any
  newurl: any
  embededToken: any
  type = 'report'
  basicData: any;
  basicOptions: any;
  models: any;
  chartData: any
  vendorName: any[] = [];
  eventHandlers: Map<string, EventHandler | null> = new Map<string, EventHandler | null>([

  ]);
  filterPaneEnabled: any;
  navContentPaneEnabled: any;
  projectInfo: any;
  proposalData: any[] = [];
  proposalData1: any[] = [];
  proposalData2: any[] = [];
  proposalData3: any[] = [];
  proposalData4: any[] = [];
  proposalData5: any[] = [];
  sortProposalData: any[] = [];
  CategoryWeightage: any
  subCategoryWeightage: any
  subCategoryTowWeightage: any
  subCategoryThreeWeightage: any
  score: any
  maxscore: any
  allScoreData: any
  constructor(private newpoerbi: NewpowerbiServiceService) {
  }

  ngOnInit(): void {
    
    this.addTokenData();
  }
  addTokenData() {
//     this.username = sessionStorage.getItem('email');
// console.log(this.username,'user name');

    const object = {
      grant_type: this.grant_type,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      scope: this.powerbiScope,
      username: this.username,
      resource: this.resource,
      password: this.password,
      tenant_id: this.tenant_id
    }

    this.newpoerbi.generateToken(object).subscribe((data: any) => {
      // console.log(data, 'data11');
      this.accessToken = data.body.access_token;
      // console.log('check 1');
      this.getEmbedUrl(this.accessToken);
    })

  }

  getEmbedUrl(Accesstoken: any) {
    this.newpoerbi.getEmbededUrl(this.reportId, Accesstoken).subscribe((data1: any) => {
      // console.log("Emebded URL data: ",data1);
      this.newurl = data1.embedUrl;
      // console.log('check 2');
      this.generateEmbededToken(data1);
    })
  }

  generateEmbededToken(data: any) {
    console.log(data, 'Embeded data');
    const object = {
      accessToken: this.accessToken,
      accessLevel: 'View',
      allowSaveAs: 'false',
      effectiveEntity: [{
        username: sessionStorage.getItem('email'),
        roles: 'pwc_viewer',
        datasets: data.datasetId

      }]
    }
    // console.log(object, 'object');

    this.newpoerbi.embededGenerateToken(object,data.id,this.workSpaceId).subscribe((tokenData: any) => {
      // console.log(tokenData, 'embedeTokenData');
      this.embedReport(data.id, data.embedUrl, tokenData.body.token)
      // console.log(data.id, "id");
    })
  }

  embedReport(reportId: string, embedUrl: string, token: any) {
    const reportContainer = document.getElementById('embed-container');
    // console.log(reportContainer,'report container');
    
    const models = (window as unknown as WindowWithPowerBiClient)['powerbi-client'].models;
    // console.log('check 4');

    let config: models.IReportEmbedConfiguration = {
      type: 'report',
      tokenType: models.tokenType == '0' ? models.TokenType.Aad : models.TokenType.Embed,
      accessToken: token,
      embedUrl: embedUrl,
      id: reportId,
      permissions: models.Permissions.All,
      settings: {
        filterPaneEnabled: true,  
        navContentPaneEnabled: true,
        panes: {
          filters: {
            visible: true
          },
          pageNavigation: {
            visible: true
          }
        }
      }
    };
    // console.log('check 5', config);

    const report: any = powerbi.embed(reportContainer, config);
   

  }
 
  // embedReportDownload(containerId: string, reportId: string, embedUrl: string, token: string) {
  //   console.log('check 7');

  //   const reportContainer = document.getElementById(containerId);
  //   console.log('check 8');

  //   const report = powerbi.get(reportContainer);
  //   console.log("--->report: ", report);

  //   report.print();
  //   console.log('check 9');

  // } 
}
