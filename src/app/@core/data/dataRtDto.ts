export class DataRtDto {
    zonesRtDto = new Map();
    eAct: number;
    eReact: number;
    eApp: number;
    eFund: number;
    iPower: number;
    eActPerCat = new Map();
    lastDayInstallationsEnegies?: Map<number, number> = new Map();
    constructor() {
    }
}

export class ZoneRtDto {
    time: Date;
    installationsRtDto = new Map();
    CategoryRtDto = new Map();
    eAct: number;
    eReact: number;
    eApp: number;
    eFund: number;
    iPower: number;
    eActPerCat = new Map();

    constructor() {
    }
}

export class InstallationRtDto {
    time: Date;
    eAct: number;
    eReact: number;
    eApp: number;
    eFund: number;
    iPower: number;
    provider: InstallationRtDto = undefined;
    eActPerCat: Map<number, number> = new Map();
    groupsRtDto: Map<number, GroupRtDto> = new Map();
    sondesRtDto: Map<number, SondeRtDto> = new Map();
    pointRtDto: Map<number, PointRtDto> = new Map();
    archiveRtDto: Map<number, ArchiveRtDto> = new Map();
    inputsRtDto: Map<number, InputRtDto> = new Map();
    constructor() {
    }
}

export class CategoryRtDto {
    eAct: number;
    groupsRtDto = new Map();

    constructor() {
    }
}

export class GroupRtDto {
    time: Date;
    phasesRtDto: Map<number, PhaseRtDto> = new Map();
    eAct: number;
    eReact: number;
    eApp: number;
    eFund: number;
    iPower: number;
    eActPerCat: Map<number, number> = new Map();

    constructor() {
    }
}

export class PhaseRtDto {
    time: Date;
    eAct: number;
    eReact: number;
    eApp: number;
    eFund: number;
    vmoy: number;
    cmoy: number;
    pmoy: number;
    phmoy: number;
    iPower: number;

    constructor() {
    }
}


export class SondeRtDto {
    lastTemperatue: number;
    lastHumidity: number;
    lastDi0: number;
    lastDi1: number;
    lastDi2: number;
    lastDi3: number;
    lastTime: Date;
    lastBattery?: number = 0;
    constructor() {
    }
}

export class RealTimePointDto {

    pointId: number;
    pointLbl: string;
    pointValue: number;
    setpointValue: number;

}

export class PointRtDto {
    id: number;
    setpointValue: string;
    value: number;
    lastTime: Date;
    constructor() {
    }
}

export class ArchiveRtDto {
    id: number;
    in1: number;
    time: Date;
}

export class GazDto {
    gazId: number;
    in1: number;
    time: Date;
}

export class ProviderInstallationAllDto {
    id: number;
    name: string;
    gpsLat: string;
    gpsLon: string;
    type: string;
    tenantId: number;
    surface: number;
    color: string;
    nature: string;
}

export class InputRtDto {
    lastValue: number;
    lastTime: Date;
    constructor() {
    }
}