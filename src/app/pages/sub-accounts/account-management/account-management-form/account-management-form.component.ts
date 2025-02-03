import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
// import { TranslateService } from '@ngx-translate/core';
import { takeWhile } from 'rxjs/operators';
import { DateInterval, Installation } from '../../../../@core/data/data';
import { SigninService } from '../../../../@core/service/signin.service';
import { FA_ICONS } from '../../../../@core/utils/global/fa-icons';
import { Authority, User } from '../../../../authenification/credentials';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-management-form.component.html',
  styleUrls: ['./account-management-form.component.scss']
})
export class AccountManagementFormComponent implements OnInit, OnChanges {

  @Input() user: User = new User();

  @Input() mode = 'ADD';

  @Input() isCollabsed = false;

  @Input() installations: Installation[] = [];
  @Input() authorities: Authority[] = [];

  showPW = false;
  public id: number;
  public currentUser: User = null;



  public authoritiesItems: any[];
  public authoritiesSelected: any[];

  public installationsItems: any[];
  public installationsSelected: any[];

  loading = false;
  globalLoading = false;

  dateInterval: DateInterval = new DateInterval();
  alive: boolean = true;
  translations: any;
  faIcon = FA_ICONS;
  constructor(
    private signinService: SigninService,
    public toastr: NbToastrService, 
    private translate: any ) {
      translate.setDefaultLang('fr');
    let now = new Date();
    this.dateInterval.endDate = new Date().getTime();
    this.dateInterval.startDate = now.setDate(new Date().getDate() - 3);
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    this.signinService.account2Update
    .pipe(takeWhile(() => this.alive))
    .subscribe(account =>{
      if (this.mode === 'ADD' || this.mode === 'UPDATE') {
          /** passage par copie **/
          this.user = Object.assign({}, account);
          this.mode = 'UPDATE';
          this.installationsSelected =
           this.getItemsFromInstallation( account.installationIds.map(inst => this.getInstallation(inst)));
          this.authoritiesSelected = this.getItemsFromAuthorities( account.authorities );
      }
    });

    this.signinService.accountWasDeleted
    .pipe(takeWhile(()=>this.alive))
    .subscribe(deletedUser => {
      if (this.mode === 'ADD' || this.mode === 'UPDATE') {
       this.init();
      }
    });

    translate.onLangChange.subscribe((lang) => {
      this.translations = lang.translations;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.installations) {
      this.installationsItems = this.installationsToItems(this.installations);
    }
    if (changes.authorities) {
      this.authoritiesItems   = this.authoritiesToItems(this.authorities);
    }
  }

  getTranslation() {
    this.translate.getTranslation('fr').subscribe((res) => {
      this.translations = res;
    });
  }

  ngOnInit() {
   this.getTranslation();
   this.installationsItems = this.installationsToItems(this.installations);
   this.authoritiesItems   = this.authoritiesToItems(this.authorities);
  }

  toggleReset(): void {
     this.user.enabled = !this.user.enabled;
  }

  ngOnDestroy() {
   this.alive = false;
  }

  init() {
    this.user = new User();
    this.installationsSelected = [];
    this.authoritiesSelected = [];
    this.mode = 'ADD';
  }

  toggle() {
    this.isCollabsed = !this.isCollabsed;
  }

  authoritiesToItems(authorities: Authority[]) {
    let authoritiesItems = [];
    try {
    for (let i = 0; i < authorities.length; i++) {
      if (authorities[i].name != 'ROLE_ROOT') {
          authoritiesItems.push({
          id: authorities[i].id,
          text: authorities[i].label
        });
      }
    }
  } catch (error) { }
    return authoritiesItems;
  }

  getItemsFromInstallation(installations: Installation[]) {
    let installationsItems = [];
    try {
      for (let i = 0; i < installations.length; i++) {
        installationsItems.push({
          id: installations[i].id,
          text: installations[i].name
        });
      }
    } catch (error) { }
    return installationsItems;
  }

  getItemsFromAuthorities(authorities: Authority[]) {
    let authoritiesItems = [];
    try {
      for (let i = 0; i < authorities.length; i++) {
        authoritiesItems.push({
          id: authorities[i].id,
          text: authorities[i].label
        });
      }
    } catch (error) { }
    return authoritiesItems;
  }

  installationsToItems(installations: Installation[]) {
    let installationsItems = [];
    try {
    for (let i = 0; i < installations.length; i++) {
        installationsItems.push({
          id: installations[i].id,
          text: installations[i].name
        });
      }
    } catch (error) { }
      return installationsItems;
  }

  itemsToInstallations(items: { id: number; text: string; }[]) {
    let installations: any[] = [];
    try{
    for (let i = 0; i < items.length; i++) {
      installations.push({
        id: items[i].id,
        nom: items[i].text
      });
    }
  } catch (error) { }
    return installations;
  }

  addSubAccount() {
    this.globalLoading = true;
    if (this.user) {
      if (this.user.email === '') {
        this.user.email = null;
      }
    }
    this.user.installationIds = this.installationsSelected.map(inst=>  inst.id);
    this.user.authorities = this.authorities;
    this.user.creationDate = new Date();

    this.signinService.addAccount(this.user).subscribe(
      subAccount => {
        this.signinService.accountWasCreated.emit(subAccount);
        this.globalLoading = false;
        this.toastr.success(this.translations.ACCOUNT.souscompte + ' ' + subAccount.username + ' ' + this.translations.ACCOUNT.estcree);
        this.init();
           },
      () => {
        this.globalLoading = false;
        this.toastr.danger(this.translations.ACCOUNT.operationeaechoue);
        this.toastr.danger(this.translations.ACCOUNT.erreur);
       }
    );
  }

  deleteSubAccount() {
    if (confirm(`Suppression de ${this.user.username}: êtes vous sur?`)) {
      this.globalLoading = true;
      this.signinService.deleteAccount(this.user.id).subscribe(
        isDeleted => {
          this.signinService.accountWasDeleted.emit(this.user);
          this.globalLoading = false;
          this.toastr.success(this.translations.ACCOUNT.souscompte + ' ' + this.user.username + ' ' + this.translations.ACCOUNT.estsuprime);
        },
        () => {
          this.globalLoading = false;
          this.toastr.danger(this.translations.ACCOUNT.operationeaechoue);
          this.toastr.danger(this.translations.ACCOUNT.erreur);

        }
      );
    }
  }

  editSubAccount() {
    this.globalLoading = true;
    this.user.installationIds = this.installationsSelected.map(inst=>  inst.id);
    this.user.authorities = this.authorities;
    this.signinService.updateAccount(this.user).subscribe(
      subAccount => {
        this.signinService.accountWasChanged.emit(subAccount);
        this.globalLoading = false;
        this.toastr.success(this.translations.ACCOUNT.souscompte+ ' ' + this.user.username + ' ' + this.translations.ACCOUNT.estmodifie);
        this.init();
      },
      () => {
        this.globalLoading = false;
        this.toastr.danger(this.translations.ACCOUNT.operationeaechoue);
        this.toastr.danger(this.translations.ACCOUNT.erreur);

      }
    );
  }

  updateSubAccount() {
     this.signinService.account2Update.emit(this.user);
  }

  /* déctiver ou activé sous compte */
  enableOrdisableAccount() {
    this.signinService.disableOrEnaleAccount(this.user.id).subscribe(
      subAccount => {
       this.user.enabled = subAccount.enabled;
        if (this.user.enabled)
          this.toastr.success(this.translations.ACCOUNT.souscompte + ' ' + this.user.username + ' ' 
          + this.translations.ACCOUNT.estactive);
        else
         this.toastr.warning(this.translations.ACCOUNT.souscompte + ' ' + this.user.username + ' '
           + this.translations.ACCOUNT.estdesactive);
      },
      () => {
        this.toastr.danger(this.translations.ACCOUNT.operationeaechoue);
        this.toastr.danger(this.translations.ACCOUNT.erreur);
      }
    );
  }

  loadAction(userId: number) {
    this.loading = true;
    this.signinService.getActions(userId, this.dateInterval).subscribe(
      actions => {
        this.user.actions = actions;
        this.loading = false;
        this.dateInterval.startDate =
          this.dateInterval.startDate - 3 * 24 * 3600 * 1000;
      },
      () => {
        this.loading = false;
      }
    );
  }

  nombreOfDays(): number {
    return Math.floor(
      (this.dateInterval.endDate - this.dateInterval.startDate) / 86400000);
  }

  getInstallationName(installationId){
    let name = ''
    try {
      name = this.installations.filter(inst=> inst.id == installationId)[0].name;
    } catch (error) { }
    return name;
  }
  getInstallation(installationId){
    try {
      return this.installations.filter(inst=> inst.id == installationId)[0];
    } catch (error) { }
    return null;
  }

}

