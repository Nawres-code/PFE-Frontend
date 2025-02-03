import { Injectable, EventEmitter, OnDestroy } from '@angular/core';
import { createAuthorizationHeader } from '../../@core/utils/headers';
import { HttpClient } from '@angular/common/http';
import { dns } from '../../global.config';
import {
  Zone, Installation, Group, Device, TenantData, Category, Sonde,
  Voltage, Phase, Point, DeviceFroid, Station, Sensor, Inputs, Image, ImageD
} from '../data/data'
import { DataRtDto, RealTimePointDto, GazDto } from '../data/dataRtDto';
import { RtStatisticalDto } from '../data/rtStatisticalDto';
import { DatePipe } from '@angular/common';
import { owner } from "../../global.config";
import Timer = NodeJS.Timer;
import { concat, Observable } from 'rxjs';
import { map, take, takeWhile } from 'rxjs/operators';
import { Authority, User } from '../../authenification/credentials';
import { NbComponentStatus, NbSpinnerService, NbToastrService } from '@nebular/theme';

@Injectable({
  providedIn: 'root'
})
export class DataManagementService implements OnDestroy {

  private alive = true;

  //userData
  dataRtDto: DataRtDto = new DataRtDto();
  dataRtDtoRecap: DataRtDto;

  //select zone
  tenantData: TenantData = new TenantData();
  selectedZone: Zone;

  //select installation
  installations: Installation[];
  selectedInstallation: Installation;

  //select group
  groupses: Group[];
  selectedGroup: Group;

  //select sensor
  sensors: Sensor[];
  selectedSensor: Sensor;

  //select devices
  devices: Device[];
  selectedDevice: Device;

  //select category
  categories: Category[];
  selectedCategory: Category;

  //select sonde
  sondes: Sonde[];
  selectedSonde: Sonde;

  //selected station metos
  selectedStation: Station;

  //selct device froid
  deviceFroids: DeviceFroid[];


  //select point
  points: Point[];

  //Statistical
  rtStatisticalDto: RtStatisticalDto[] = [];

  //select voltage
  voltages: Voltage[];
  selectedVoltage: Voltage;

  //select phase
  phases: Phase[];
  selectedPhase: Phase;

  //select input
  inputs: Inputs[];

  rtdevicesFroid: RealTimePointDto[] = [];

  gazDto: GazDto[] = [];

  selectedDashbord: string = "ENERGY";

  owner: String;
  autority: Authority[];

  liveReloadingRT: Timer;

  liveReloadingRT5min: Timer;
  liveReloadingNotif1min: Timer;

  notifications: any[] = [{ title: "No notification.", icon: "fas fa-ban" }];

  eventDetails: EventEmitter<any> = new EventEmitter();
  eventIOTot: EventEmitter<any> = new EventEmitter();
  refreshTempEvent: EventEmitter<any> = new EventEmitter();

  public GroupsLoaded$: EventEmitter<TenantData> = new EventEmitter();
  public DataLoaded$: EventEmitter<DataRtDto> = new EventEmitter();
  public currentUser: User = new User;
  nbSideBarCollapsed: boolean = true;
  constructor(private _http: HttpClient, private datePipe: DatePipe,
    private spinner$: NbSpinnerService, private toastrService: NbToastrService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.owner = owner;
    if (localStorage.getItem('rtInput') == null) localStorage.setItem('rtInput', '');
    this.DataLoaded$.emit(null);
  }

  init(noLoader?: boolean) {
    if (!noLoader || noLoader == undefined) {
      this.spinner$.registerLoader(
        new Promise<void>((resolve) => {
          this.GroupsLoaded$.pipe(takeWhile(() => this.alive)).subscribe(() => resolve());
        }),
      );
      this.spinner$.load();
    }
    // this.GroupsLoaded$
    // .pipe(takeWhile(()=>this.alive))
    // .subscribe(tenantData => {
    //   if (this.liveReloadingNotif1min)
    //     clearTimeout(this.liveReloadingNotif1min);
    //   this.liveReloadingNotif1min = setInterval(() => {
    //     this.loadNotifications();
    //   }, 30000);
    // });
    let count = 0;
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.getAllCategorieDetails(+localStorage.getItem("id"))
      .pipe(take(1))
      .subscribe(categories => {
        if (!this.tenantData)
          this.tenantData = new TenantData();
        count++;
        this.tenantData.categories = categories;
        if (count == 3)
          this.GroupsLoaded$.emit(this.tenantData);
      });

    this.getAllZoneByTennatId(+localStorage.getItem("id"))
      .pipe(take(1))
      .subscribe(
        zones => {
          if (!this.tenantData)
            this.tenantData = new TenantData();
          count++;
          this.tenantData.zones = zones;

          try {
            if (this.tenantData.zones.length == 1)
              this.selectedZone = this.tenantData.zones[0];
          } catch (error) { }

          try {
            if (this.selectedZone.installations.length == 1)
              this.selectedInstallation = this.selectedZone.installations[0];
          } catch (error) { }

          if (count == 3)
            this.GroupsLoaded$.emit(this.tenantData);

        }
      );
    if (this.owner == 'CDC') {
      this.getAllcdcSensors()
        .pipe(take(1))
        .subscribe(
          sensors => {
            if (!this.tenantData)
              this.tenantData = new TenantData();
            count++;
            this.tenantData.sensors = sensors;
            this.sensors = sensors;
            if (count == 3)
              this.GroupsLoaded$.emit(this.tenantData);
          },
          error => {
            count++;
          }
        );

      this.getMe().subscribe(i => {
        this.currentUser.installationIds = i.installationIds;
        console.log(this.currentUser.installationIds)
      })
    } else {
      this.getAllMetosSensors()
        .pipe(take(1))
        .subscribe(
          sensors => {
            if (!this.tenantData)
              this.tenantData = new TenantData();
            count++;
            this.tenantData.sensors = sensors;
            if (count == 3)
              this.GroupsLoaded$.emit(this.tenantData);
          },
          error => {
            count++;
          }
        );
    }

  }

  getAllZoneByTennatId(tenantId: number): Observable<any> {
    let headers = createAuthorizationHeader();

    return this._http
      .get(dns + 'dataManagment/getAllZone/' + tenantId, {
        headers: headers
      });
  }

  getAllCategorieDetails(tenantId: number): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get
      (dns + 'dataManagment/getAllCategory/' + tenantId, {
        headers: headers
      });
  }

  getAllMetosSensors(): Observable<Sensor[]> {
    let headers = createAuthorizationHeader();
    return this._http
      .get<Sensor[]>
      (dns + 'dataManagment/getAllSensors/', {
        headers: headers
      }).pipe(map(data =>
        data.filter(data => (data.deviceType == 'Metos' && localStorage.getItem('id') == '30')
          || (data.deviceType != 'Metos' && localStorage.getItem('id') != '30')
        )));
  }

  getAllcdcSensors(): Observable<Sensor[]> {
    let headers = createAuthorizationHeader();
    return this._http
      .get<Sensor[]>
      (dns + 'dataManagment/getAllSensors/', {
        headers: headers
      });
  }

  getAllEnergyZone(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/rtZone', {
        headers: headers
      });
  }

  getAllEnergyGaz(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/gaz', {
        headers: headers
      });
  }

  getAllEnergyInstallation(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/rtInstallation', {
        headers: headers
      });
  }

  getAllAuthority(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'dataManagment/getAllAuthority/', {
        headers: headers
      });
  }

  getRtData() {
    this.getAllData()
      .pipe(take(1))
      .subscribe(res => {
        this.dataRtDto = new DataRtDto();
        this.dataRtDto = res;
        this.DataLoaded$.emit(res);
      });
  }

  getRtDataSingleInstallation() {
    this.getAllDataSingleInstallation()
      .pipe(take(1))
      .subscribe(res => {
        this.dataRtDto = new DataRtDto();
        this.dataRtDto = res;
        this.DataLoaded$.emit(res);
      });
  }

  getRecapData(startTime: Date, endTime: Date) {
    this.getAllDataRecap(startTime, endTime)
      .pipe(take(1))
      .subscribe(res => {
        this.dataRtDtoRecap = new DataRtDto();
        this.dataRtDtoRecap = res;
        // this.DataLoaded$.emit(res);
      });
  }

  getAllEnergyGazDate(startTime: Date, endTime: Date): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/gazdate' + '?startTime=' + this.datePipe.transform(startTime, "yyyy-MM-dd HH:mm:ss") + '&endTime=' + this.datePipe.transform(endTime, "yyyy-MM-dd HH:mm:ss"),
        {
          headers: headers
        });
  }

  getRecapGaz(startTime: Date, endTime: Date) {
    this.getAllEnergyGazDate(startTime, endTime)
      .pipe(take(1))
      .subscribe(gazs => {
        this.gazDto = gazs;
        // this.DataLoaded$.emit(this.tenantData);
      });
  }
  getAllData(): Observable<any> {

    let headers = createAuthorizationHeader();
    if (this.selectedDashbord == "ENERGY") {
      return this._http
        .get(dns + 'realtime/getAll/userData', {
          headers: headers
        });
    }
    if (this.selectedDashbord == "TRICITY") {
      return this._http
        .get(dns + 'realtime/getAll/userData', {
          headers: headers
        });
    }

  }

  getAllDataSingleInstallation(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/userDataSingleInstallation', {
        headers: headers
      });
  }

  getAllDataRecap(startTime: Date, endTime: Date): Observable<any> {
    //let p= new DatePipe("");
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/userDataRecapEnergy' + '?startTime=' + this.datePipe.transform(startTime, "yyyy-MM-dd HH:mm:ss") + '&endTime=' + this.datePipe.transform(endTime, "yyyy-MM-dd HH:mm:ss"), {
        headers: headers
      });
  }

  getAllRtStatistical(grouping: String, timing: String): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/getAll/rtStatistical' + '?grouping=' + grouping + '&timing=' + timing, {
        headers: headers
      });
  }

  getAllRtIo(period: string): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(`${dns}realtime/getAll/io?period=${period}`, {
        headers: headers
      });
  }

  getAllRtPointGroupedByDevice(): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'realtime/rtpoints', {
        headers: headers
      });
  }

  getMe(): any {
    let headers = createAuthorizationHeader();
    return this._http
      .get(`${dns}users/me`, {
        headers: headers
      });
  }

  getDeviceFroidName(idDevice: number) {
    for (let i = 0; i < this.selectedInstallation.deviceFroids.length; i++) {
      if (this.selectedInstallation.deviceFroids[i].id == +idDevice)
        return this.selectedInstallation.deviceFroids[i].label;
    }
  }



  getzoneById(id: number) {
    if (!this.tenantData)
      return null;
    for (let zone of this.tenantData.zones)
      if (zone.idZone == id)
        return zone;
    return null;
  }
  getInstallationById(id: number) {
    if (!this.tenantData)
      return null;
    for (let zone of this.tenantData.zones)
      for (let inst of zone.installations)
        if (inst.id == id)
          return inst;

    return null;
  }

  getOneDeviceName(id: number) {
    for (let zone of this.tenantData.zones)
      for (let inst of zone.installations)
        for (let device of inst.devices)
          if (device.id == id)
            return inst.name + "/" + device.name;
    return null;
  }

  getOneDeviceFroidName(id: number) {
    for (let zone of this.tenantData.zones)
      for (let inst of zone.installations)
        for (let device of inst.deviceFroids)
          if (device.id == id)
            return inst.name + "/" + device.label;
    return null;
  }


  selectGroupFromGroupsById(groups: any[], val: number) {
    for (let group of groups) {
      if (group.id == val)
        return group;
    }
    return null;
  }

  startRt() {
    if (this.owner != "VILAVI") {
      if (this.liveReloadingRT)
        clearTimeout(this.liveReloadingRT);
      this.getRtEnergy();
      this.liveReloadingRT = setInterval(() => {
        this.getRtData();
      }, 20000);
    } else {
      if (this.liveReloadingRT)
        clearTimeout(this.liveReloadingRT);
      this.getRtEnergySingleInstallation();
      this.liveReloadingRT = setInterval(() => {
        this.getRtDataSingleInstallation();
      }, 20000);
    }
    if (this.owner == "MEKATECH" || this.owner == "MEKATECHNOAUTH" || this.owner == "DEPOT" || this.owner == "FLEETDEPOT" || this.owner == "IOT" || this.owner == "INPUT") {
      if (this.liveReloadingRT5min)
        clearTimeout(this.liveReloadingRT5min);

      this.liveReloadingRT5min = setInterval(() => {
        this.refreshTempEvent.emit();
      }, 60000);
    }
    this.DataLoaded$.emit(null);
  }

  stopRt() {
    try {
      if (this.liveReloadingRT)
        clearTimeout(this.liveReloadingRT);
      this.liveReloadingRT = undefined;
    } catch (error) { }

  }

  stopNotifRt() {
    try {
      if (this.liveReloadingNotif1min)
        clearTimeout(this.liveReloadingNotif1min);
    } catch (error) { }

  }

  stop5minRt() {
    try {
      if (this.liveReloadingRT5min)
        clearTimeout(this.liveReloadingRT5min);
    } catch (error) { }

  }

  stopAllRt() {
    this.stopNotifRt();
    this.stopRt();
    this.stop5minRt();
  }

  getRtEnergy() {
    this.selectedDashbord = "ENERGY";
    this.getRtData();
    this.getAllAuthority();
  }

  getRtEnergySingleInstallation() {
    this.selectedDashbord = "ENERGY";
    this.getRtDataSingleInstallation();
    this.getRtGaz();
  }
  getRtGaz() {
    this.getAllEnergyGaz()
      .pipe(take(1))
      .subscribe(gazs => {
        this.gazDto = gazs;
        // this.DataLoaded$.emit(this.tenantData);
      });
  }

  getNotificationsCount() {
    try {
      let count = this.getNotifications().filter(x => x.title != "No notification.").length;
      return count;
    } catch (e) { }
  }

  getNotifications() {
    try {
      this.notifications = this.notifications.filter(x => x.title != "No notification.");
    } catch (e) {
      this.notifications = [{ title: "No notification.", icon: "fas fa-ban" }];
    } finally {
      return this.notifications;
    }

  }

  //disconnected devices notifs
  getAllDisconnectedDevicesNotifications(): Observable<any[]> {
    //let p= new DatePipe("");
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'devices/disconnected', {
        headers: headers
      })
      .pipe(
        map(res => {
          let notifs = [];
          let notif;
          if (res['FROID'].length) {
            for (let DeviceId of res['FROID']) {
              notif = { title: "DEVICE FROID " + this.getOneDeviceFroidName(DeviceId) + " DISCONNECTED", icon: "fas fa-plug" }
              notifs.push(notif);
            }
          }
          return notifs;
        }));
  }
  //Alarm points notifs __ 
  getAllAlarmPointNotif(): Observable<any[]> {
    //let p= new DatePipe("");
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'notifications/Alarm_points', {
        headers: headers
      }).pipe(
        map((res: string[]) => {
          let notif;
          let notifs = [];
          for (let n of res) {
            notif = { title: "ALARM: " + n + " is FIRED", icon: "fas fa-circle" }
            notifs.push(notif);
          }
          return notifs;
        }));
  }

  //Alarm points notifs __ 
  getAllMailAlertNotif(): Observable<any[]> {
    //let p= new DatePipe("");
    let headers = createAuthorizationHeader();
    return this._http
      .get(dns + 'notifications/3/userAlerts', {
        headers: headers
      }).pipe(
        map((res: []) => {
          let notif;
          let notifs = [];
          let st_measureType: string;
          for (let n of res) {
            try {
              st_measureType = n['measureType'];
              switch (st_measureType.toUpperCase()) {
                case 'SONDE':
                  let sonde: Sonde = this.tenantData.zones.flatMap(z => z.installations).flatMap(i => i.sondes).filter(s => s.id == +n['measureId'])[0];
                  let installationName: string = this.tenantData.zones.flatMap(z => z.installations).filter(i => i.sondes.filter(s => s.id == +n['measureId']).length > 0)[0].name;
                  if ('DISCONNECTION' == n['alertType']) {
                    notif = { title: `${installationName} - ${sonde.name}: Disconnection en ${new Date(n['time']).toLocaleString()}`, icon: "fas fa-ban" };
                  } else {
                    notif = { title: `${installationName} - ${sonde.name}: Infraction des seuils ${n['infractedVal']} en ${new Date(n['time']).toLocaleString()} avec une valeur de ${n['calcVal']}°C.`, icon: "fas fa-temperature-high" };
                  }
                  break;
              }
              notifs.push(notif);
            } catch (error) { }
          }
          return notifs;
        }));
  }

  loadNotifications() {
    let notifsObs: Observable<any>[] = [];
    switch (owner) {
      case 'AZIZA':
        notifsObs = [this.getAllAlarmPointNotif(), this.getAllDisconnectedDevicesNotifications(), this.getAllMailAlertNotif()];
        break;
      case 'IOT':
      case 'DEPOT':
      case 'FLEETDEPOT':
      case 'MEKATECH':
      case 'MEKATECHNOAUTH':
        notifsObs = [this.getAllMailAlertNotif()];
        break;
    }
    const rObs = concat(...notifsObs);
    rObs.pipe(takeWhile(() => this.alive)).subscribe(s => {
      this.notifications = [];
      this.notifications.push(...s);
    });
  }

  userHasInstallation(id: number): boolean {
    if (this.currentUser == null) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    try {
      if (this.currentUser.root)
        return true;
      for (let i = 0; i < this.currentUser.installationIds.length; i++) {
        if (this.currentUser.installationIds[i] == id)
          return true;
      }
    } catch (error) { }
    return false;
  }

  userHasSondeAuthority(nameType: string): boolean {
    if (this.currentUser == null) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    try {
      if (this.currentUser.root)
        return true;
      for (let i = 0; i < this.currentUser.authorities.length; i++) {
        if (this.currentUser.authorities[i].name == nameType) {
          return true;
        }
      }
    } catch (e) {
      return false;
    }
  }

  isInptCacheEmpty = false;
  getInptCacheStatus() {
    this.isInptCacheEmpty = localStorage.getItem('rtInput') == null || localStorage.getItem('rtInput') == undefined || localStorage.getItem('rtInput') == '';
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  flush() {
    this.dataRtDto = new DataRtDto();
    this.tenantData = new TenantData();
    this.selectedZone = undefined
    this.selectedStation = undefined;
    this.selectedInstallation = undefined;
    this.selectedSonde = undefined;
    this.selectedCategory = undefined;
    this.selectedPhase = undefined;
  }


  showToast(status: NbComponentStatus, message: string) {
    this.toastrService.show(status, message, { status });
  }


  addImage(image: Image): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + 'image/add', image, { headers: headers });
  }

  findImageByDeviceIdType(imageData: ImageD): Observable<any> {
    let headers = createAuthorizationHeader();
    return this._http.post(dns + 'image/search', imageData, { headers: headers });
  }

}
