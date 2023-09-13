import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewpowerbiServiceService {

  roles: any[] = [];
  datasets: any[] = [];
  powerBiToken: any;

  constructor(private http: HttpClient) { }

  // To generate access token
  generateToken(data: any) {
    const url = `${environment.url}/powerBi/access`;
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new HttpParams({ fromObject: data });
    return this.http.post(url, body, { headers, observe: 'response', responseType: 'json' });
  }

  
  // To get Embedded URL
  getEmbededUrl(reportId: string, tokens: any) {
    sessionStorage.setItem('powerbitoken', tokens);
    const headers = { Auth: `Bearer ${tokens}` };
    return this.http.get(`${environment.url}/powerBi/${reportId}`, { headers });
  }


  // To generate Embedded token
  embededGenerateToken(data: any, reportId: any,workspaceId:any) {
    // console.log("data to be post for embed token: ", data);

    this.roles.push(data.effectiveEntity[0].roles)
    this.datasets.push(data.effectiveEntity[0].datasets)
    const object1 = {
      accessLevel: data.accessLevel,
      allowSaveAs: data.allowSaveAs,
      effectiveEntity: [{
        username: data.effectiveEntity[0].username,
        roles: this.roles,
        datasets: this.datasets
      }]
    }

    // console.log("data to be post for embed token after: ", object1);
    const url = `${environment.url}/powerBi/token/${workspaceId}/${reportId}`;
    const headers = { Auth: `Bearer ${sessionStorage.getItem('powerbitoken')}` }
    return this.http.post(url, object1, { headers, observe: 'response', responseType: 'json' });
  }

  
}
