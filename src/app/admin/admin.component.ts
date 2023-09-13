import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AppModuleConstants } from '../app-constants';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService, PrimeIcons } from 'primeng/api';
import { NotificationService } from '../services/notification.service';
import { Subscription, interval, take } from 'rxjs';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ConfirmationService, MessageService, PrimeIcons],
})
export class AdminComponent implements OnInit {

  sidebar: boolean = false;

  checked1: boolean = false;

  sidebar1: boolean = false;
  user!: string;
  logUser: boolean = false;
  isActive: boolean = false;
  isActive1: boolean = false;
  isActive2: boolean = false;
  isActive3: boolean = false;
  isActive4: boolean = false;

  userRole!: string;
  userName!: string;
  lastName!: string;
  overlayVisible: boolean = false;

  iconClicked = false;




  data: any;
  private subscription!: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private messageService: MessageService,
    private notificationService: NotificationService
  ) {
    // this.subscription = this.notificationService.getData().subscribe((data) => {
    //   // Update the data in the second module
    //   console.log("inside admin constructor: ",data);
    //   // this.allNotifications = data;
    // });
  }

  allNotifications: any[] = [];
  notificationCount: any;

  ngOnInit(): void {
    // setInterval(() => {
    // this.userService.getAllNotifications().subscribe((data: any) => {
    //   this.allNotifications = this.filterNotificationData(data);
    //   this.allNotifications.reverse();
    //   console.log("updated notifications",this.allNotifications);
    // });
    // }, 15000); // Update every 1 second

    // this.notificationService.dialogFormDataSubscriber$.subscribe(
    //   (data: any) => {
    //     console.log("inside admin subsciber: ",data);

    //     this.userService.getAllNotifications().subscribe((data: any) => {
    //       this.allNotifications = this.filterNotificationData(data);
    //       this.allNotifications.reverse();
    //       console.log('updated notifications', this.allNotifications);
    //     });
    //   }
    // );

    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.userService.getAllNotificationsCount().subscribe((data: any) => {
      // console.log(data);
      this.notificationCount = data;
    });

    setInterval(() => {
      this.userService.getAllNotificationsCount().subscribe((data: any) => {
        // console.log(data);
        this.notificationCount = data;
      });
    }, 15000); //execute after every 15 seconds

    this.userRole = sessionStorage.getItem(AppModuleConstants.ROLE)!;
    this.userName = sessionStorage.getItem(AppModuleConstants.USER)!;
    this.lastName = sessionStorage.getItem(AppModuleConstants.LASTNAME)!;
    this.screenWidth = window.innerWidth;

    this.navData = [
      {
        routeLink: '/Admin',
        icon: 'pi pi-chart-bar',
        label: 'Role',
        image: 'assets/Images/Union 3.png',
        tooltip: 'Roles',
      },
      {
        routeLink: '/Admin/user',
        icon: 'pi pi-table',
        label: 'User',
        image: 'assets/Images/PwC_Funct_Icons_Avatar_Outline_Black_RGB.png',
        tooltip: 'Users',
      },
      // {
      //   routeLink: '/document/nav/project-mng',
      //   icon: 'pi pi-chart-line',
      //   label: 'Project',
      //   image:'assets/Images/Union 2.png'

      // },
      // {
      //   routeLink: '/document/nav/vendor-mng',
      //   icon: 'pi pi-users',
      //   label: 'Vendor',
      //   image:'assets/Images/Group.png'

      // },
      // {
      //   routeLink: '/document/nav/template-mng',
      //   icon: 'pi pi-cog',
      //   label: 'Templates',
      //   image:'assets/Images/Union 1.png'
      // },
      {
        routeLink: '/Admin/master-repo',
        icon: 'pi pi-users',
        label: 'Library',
        image: '/assets/Images/library_icon.png',
        tooltip: 'Master Library',
      },
      {
        routeLink: '/Admin/projects',
        icon: 'pi pi-chart-line',
        label: 'Project',
        image: 'assets/Images/Union 2.png',
        tooltip: 'Projects',
      },
      {
        routeLink: '/Admin/vendors',
        icon: 'pi pi-users',
        label: 'Vendor',
        image: 'assets/Images/Group.png',
        tooltip: 'Vendors',
      },
      {
        routeLink: '/Admin/template-list',
        icon: 'pi pi-cog',
        label: 'Templates',
        image: 'assets/Images/Union 1.png',
        tooltip: 'Templates',
      },
      {
        routeLink: '/Admin/proposal-list',
        icon: 'pi pi-chart-line',
        label: 'Propsal Rating',
        image: 'assets/Images/scoring_icon.png',
        tooltip: 'Proposal Rating',
      },
      {
        routeLink: '/Admin/report',
        icon: 'pi pi-chart-line',
        label: 'Reports',
        image: 'assets/Images/dashboard.png',
        tooltip: 'Reports',
      },
      // {
      //   routeLink: '/Admin/azure',
      //   icon: 'pi pi-chart-line',
      //   label: 'Reports',
      //   image: 'assets/Images/dashboard.png',
      //   tooltip: 'Azure',
      // },

      // {
      //   routeLink: '/Admin/template-list',
      //   icon: 'pi pi-cog',
      //   label: 'Templates',
      //   image:'assets/Images/Union 1.png',
      //   tooltip:"Templates"
      // },
      // {
      //   routeLink: '/Admin/proposal-list',
      //   icon: 'pi pi-chart-line',
      //   label: 'Template Scoring',
      //   image:'assets/Images/scoring_icon.png',
      //   tooltip:"Template Scoring"

      // },
    ];
  }

  filterNotificationData(inputData: any) {
    let filterData: any[] = [];

    inputData.filter((data: any) => {
      // console.log('data././././', data);
      if (data.userName === sessionStorage.getItem('email')) {
        filterData.push(data);
      }
    });
    return filterData;
  }

  onClickNotification() {
    this.userService.getAllNotifications().subscribe((data: any) => {
      this.allNotifications = this.filterNotificationData(data);
      this.allNotifications.reverse();
      // console.log('updated notifications', this.allNotifications);
    });
    this.overlayVisible = !this.overlayVisible;
  }
  sideBar() {
    if (this.sidebar == false) {
      this.sidebar = true;
    } else {
      this.sidebar = false;
    }
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }

  onClickHome() {
    this.router.navigate(['/home']);
  }

  onClicUserMngmnt() {
    this.router.navigate(['/user-mng']);
  }

  onClicRoleMngmnt() {
    this.router.navigate(['/role-mng']);
  }

  onClicVendorMngmnt() {
    this.router.navigate(['/vendor-mng']);
  }

  onClicProjectMngmnt() {
    this.router.navigate(['/project-mng']);
  }

  onClicTemplateMngmnt() {
    this.router.navigate(['/template-mng']);
  }

  onClickLibrary() {
    this.router.navigate(['/template-mng']);
  }

  // config: boolean = false;
  // onClickConfig() {
  //   this.config = true;
  // }

  onClickAnchor() {
    this.isActive = true;
    this.isActive1 = false;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
  }

  onClickAnchor1() {
    this.isActive = false;
    this.isActive1 = true;
    this.isActive2 = false;
    this.isActive3 = false;
    this.isActive4 = false;
  }

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData: any = [];

  isSideNavCollapsed = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
    }
  }

  toggleCollapse(): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = true;
    }
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  toggleCollapse1(): void {
    if (this.collapsed === true) {
      this.collapsed = false;
    } else {
      this.collapsed = false;
    }
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  onClickLogout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
    // window.location.href = 'https://login-stg.pwc.com/openam/UI/Logout';
  }

  onClearNotification(id: any) {
    // alert(id)
    this.userService.clearNotification(id).subscribe((data: any) => {
      // console.log('notification cleared');
      this.userService.getAllNotifications().subscribe((data: any) => {
        this.allNotifications = this.filterNotificationData(data);
        this.allNotifications.reverse();
        // console.log('updated notifications', this.allNotifications);
      });
    });
  }

  clearAllNotification() {
    this.userService
      .clearAllNotifications(sessionStorage.getItem('email'))
      .subscribe((data: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success..!!',
          detail: 'All notifications are cleared',
        });
      });
    this.overlayVisible = false;
    this.notificationCount = 0;
    // this.notificationService.emitDialogFormData("event");
  }
}
