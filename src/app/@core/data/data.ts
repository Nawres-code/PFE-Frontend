import { AlertConfigType, AlertType, Operator } from './enum';
import { User } from '../../authenification/credentials';

export class TenantData {
    zones: Zone[] = Array();
    sondes: Sonde[] = Array();
    rtEnergy: number = 0;
    categories: Category[] = Array();
    sensors: Sensor[] = Array();
}

export class DeviceFroid {
    id: number;
    ipAdress: string;
    peripheral: string;
    adress: string;
    model: string;
    name: string;
    enabled: boolean;
    serial: string;
    label: string;
    points: Point[];
}
export class Zone {
    idZone: number;
    name: string;
    tenantId: number;
    type: String;
    installations: Installation[] = Array();
    rtEnergy: number = 0;
}

export class Installation {
    id: number;
    name: string;
    gpsLat: string;
    gpsLon: string;
    type: string;
    tenantId: number;
    surface: number;
    color: string;
    zone_id: number;
    devices: Device[];
    sondes: Sonde[];
    groupses: Group[] = Array();
    points: Point[];
    rtEnergy: number = 0;
    deviceFroids: DeviceFroid[];
    gazs: Gaz[];
    users: User;
    provider: Installation;
    stations: Station[];
    inputs: Inputs[];
    enabled: boolean;
    ioList: IOImpulse[];

}

export class Station {
    id: string;
    description: string;
    name: string;
    type: string;
    x: number;
    y: number;
    altitude: string;

}

export class Provider {
    id: number;
    name: string;
    gpsLat: string;
    gpsLon: string;
    type: string;
    tenantId: number;
    surface: number;
    color: string;
}

export class Device {
    id: number;
    nbPhase: number;
    enabled: number;
    lastId: number;
    tenantId: number;
    protocol: string;
    type: string;
    pool: string;
    isFictif: number;
    name: string;
    period: number;
    sonde: Sonde[];
}

export class DeviceData {
    id: number;
    name: string;

}

export class Sonde {
    id: number;
    name: string;
    indexHumDevice: number;
    type: string;
    device: Device;
    rtEnergy: number = 0;
    role: string;
    configuration: string;
}

export class SondeData {
    id: string;
    name: string;
    installationId: number;
    installationName: string;
    fictifId?: string;
    indexHumDevice: number;
    type: string;
    minThreshold: number;
    maxThreshold: number;
    role?: string;
    configuration?: string;
}

export class Group {
    id: number;
    nbPhase: number;
    enabled: number;
    name: string;
    color: string;
    tenantId: number;
    categoryId: number;
    threshold: number;
    thresholdDay: number;
    thresholdNight: number;
    thresholdWeek: number;
    thresholdWeekDays: number;
    thresholdWeekend: number;
    thresholdInstCuurent: number;
    x: number;
    y: number;
    z: number;
    hauteur: number;
    largeur: number;
    fatherId: number;
    GroupsType: 'GENERAL' | 'SOUS_GENERAL' | 'OTHERS' | 'INDEPENDANT';
    type: String;
    rtEnergy: number = 0;
    phases: Phase[] = Array();
}

export class Phase {
    id: number;
    confId: number;
    deviceId: number;
    color: string;
    idPhaseDevice: number;
    voltages: Voltage[];
    name: string;
    fixedSign: number;
    isFictif: number;
    formule: string;
}

export class Gaz {
    id: number;
    name: string;
    time: Date;
}

export class Mesure {
    id: number;
    name: string;
    deviceId: number;
    deviceName: string;
}

export class MesureData {
    id: number;
    name: string;
    deviceId: number;
}


export class DateInterval {
    startDate: Date | number | any = new Date();
    endDate: Date | number | any = new Date();
    timeDiff?: number;
    constructor() { }
}

export class ChartEnergyData {
    startDate: Date | number | any;
    endDate: Date | number | any;
    groupIds: number[];
    constructor() { }
}

export class ChartDetailsData {
    phaseIds: number[];
    vars: string[] | any;
    startDate: Date | number | any;
    endDate: Date | number | any;

    constructor() { }
}

export class ChartTemperatureData {
    sondeIds: number[];
    vars: string[] | any;
    inputIds?: number[];
    startDate: Date | number | any;
    endDate: Date | number | any;

    constructor() { }
}

export class ChartPointData {
    pointIds: number[];
    deviceIds: number[];
    vars: string[] | any;
    startDate: Date | number | any;
    endDate: Date | number | any;

    constructor() { }
}

export class ChartGazData {
    gazIds: number[];
    vars: string[] | any;
    startDate: Date | number | any;
    endDate: Date | number | any;

    constructor() { }
}

export class ChartSensorData {
    sensorIds: number[];
    vars: string[] | any;
    startDate: Date | number | any;
    endDate: Date | number | any;

    constructor() { }
}

export class ChartStationData {
    stationIds: string[] | any;
    vars: string[] | any;
    startDate: Date | number | any;
    endDate: Date | number | any;

    constructor() { }
}

export class ChartInputData {
    startDate: Date | number | any;
    endDate: Date | number | any;
    inputIds: number[];
    constructor() { }
}
export class ChartData {
    startDate: Date | number | any;
    endDate: Date | number | any;
    ids: number[];
    constructor() { }
}

export class SensorValuesData {
    lastTime: Date;
    stationId: number;
    sensorId: number;
    installationId: number;
    avg: number;
    min: number;
    max: number;
    sum: number;
    last: number;
    time: number;
}

export class Category {
    id: number;
    name: string;
    icon: string;
    color: string;
    type: string;
}

export class Voltage {
    id: number;
    name: String;
    color: String;
}

export class ReportDto {
    dateInterval: DateInterval = new DateInterval();
    format: string;
    type: string;
    timeDiff: number = new Date().getTimezoneOffset();
    reportDto: ReportPayloadDto = new ReportPayloadDto();
}
export class ReportPayloadDto {
    type: string;
    idsRange: number[] = [];
}

export class Alert {
    id: number = 0;
    measureId: string;
    fatherId: string;
    measureName: string;
    measureType: string;
    //    groupName: string;
    //group: { 'id': number, 'name': string };
    type: AlertType | null = null;
    isActive: boolean = true;
    email: string = '';
    sms?: string = '';
    message?: string = null;
    pendingPeriod?: number = 0;
    configs: AlertConfiguration[] = [];
    zoneId?: string;
    installationId?: string;
}

export class AlertConfiguration {
    id: number;
    value1: any;
    value2: any;
    type: AlertConfigType;
    operator: Operator;
    constructor() { }
}

export class CronPayload {
    days: {
        sunday: boolean;
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
    };
    from: {
        time: { hours: string, minutes: string };
        date: Date;
    }
    to: {
        time: { hours: string, minutes: string };
        date: Date;
    }
    timePlan: string = 'off'; // for the time limiters
    constructor() {
        this.initDays(true);
        this.initTime();
    }

    initDays(value: boolean) {
        this.days = {
            sunday: value,
            monday: value,
            tuesday: value,
            wednesday: value,
            thursday: value,
            friday: value,
            saturday: value
        };
    }

    initTime() {
        this.from = { time: { hours: null, minutes: '0' }, date: null };
        this.to = { time: { hours: null, minutes: '0' }, date: null };
    }

    isAllDays(): boolean {
        let values: boolean[] = Object.values(this.days);
        let isAllTrue: boolean = values.filter(e => e == true).length == 7;
        let isAllFalse: boolean = values.filter(e => e == false).length == 7;
        return isAllFalse || isAllTrue;
    }

    deepClone(): CronPayload {
        // deep clone
        let copy: CronPayload = new CronPayload();
        copy.days = this.days;
        copy.timePlan = this.timePlan;
        if (this.from.time != undefined) { copy.from.time = JSON.parse(JSON.stringify(this.from.time)); }
        if (this.to.time != undefined) { copy.to.time = JSON.parse(JSON.stringify(this.to.time)); }
        if (this.from.date) { copy.from.date = new Date(this.from.date); }
        if (this.to.date) { copy.to.date = new Date(this.to.date); }
        return copy;
    }
}
export class EmailAddress {
    id: number;
    emailAddress: string;
}


export class Point {
    id: number;
    label: string;
    unit: string;
    setpointId: number;
    deviceId: number;
    type: string;
}

export class InstallationData {
    id: number;
    name: string;
    enabled: boolean;
    zoneId?: number;
    zoneName?: string;
}


export class InstallationDto {
    id: number;
    name: string;
}

export class Sensor {
    id: string;
    groupId: string;
    name: string;
    unit: string;
    aggr: string;
    graphType: string = 'line';
    color?: string;
    deviceType: string;
    deviceId: number;
    tag: number;
    mak: number;

    constructor() {
        this.graphType = 'line';
    }
}

export class SensorData {
    id: string;
    name: string;
    deviceId: number;
    deviceName: string;
    tag: number;
    mak: number;

    constructor() {
    }
}

export class Inputs {
    id: number;
    name: string;
    idInputDevice: number;
    device: Device;
    color: string;
    category: InputCategory;
    inversed: boolean;
    alarmStatus: string;
    alarmValue: number;
}

export class InputCategory {
    id: number;
    name: string;
    color: String;
    icon: String;
    type: string;
}

export class ZoneData {
    idZone: number;
    name: string;
    //tenantId: number;
}

export class ArchiveAlertDto {
    id: number;
    time: Date;
    calcVal: number;
    infractedVal: string;
    infractedOperator: string;
    alertType: string;
    measureType: string;
    measureId: string;
    zoneId: string;
    installationId: string;
    fatherId: string;
    constructor() { }
}
export class IOImpulse {
    id: number;
    name: string;
    outputNumber: string;
    unit: string;
    impulseVal: number;
    type: string;
    category: string;
}


export class Image {
    id: number;
    name: string;
    url: string;
    deviceId: number;
    rank: string;
    type: string;
}

export class ImageD{
    id: number;
    type: string;
}