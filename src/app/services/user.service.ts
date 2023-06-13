import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../admin/user/model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http:HttpClient) { }

   // services for user management
   addUser(userData: any) {
    console.log(userData, " data is in service now");

    return this.http.post(`${environment.url}/users`, userData);
  }

  getuUser() {
    return this.http.get(`${environment.url}/users`);
  }

  deleteUser(id: string) {
    return this.http.delete(`${environment.url}/users/${id}`);
  }

  getUserById(id: string) {
    return this.http.get(`${environment.url}/users/${id}`);
  }

  getUserByMailId(id: string) {
    return this.http.get(`${environment.url}/users/email/${id}`);
  }

  updateUser(data: User,userId:string) {
    return this.http.put(`${environment.url}/users/${userId}`, data);
  }

  loginUser(data: any) {
    return this.http.post(`${environment.url}/login`, data, {});
  }

  getAllNotifications(){
    return this.http.get(`${environment.url}/getNotification`);    
  }

  clearNotification(id:any){
    return this.http.delete(`${environment.url}/clearNotification/${id}`)
  }
}
