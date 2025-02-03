
export class GraphData {
    series: any [] = [];
    yaxiss: any[] = [];
}

export class GraphEntry {
    installationName?: string= "";
    groupses?: any[]= [];
    vars?:string="";
    period?: string="Hours";
    stationId?: string ="";
    sensorIds?: string[] = [];
    status: boolean= false;
}

export enum Unit {
    Celsius='°C',
    Percentage='%',
    Volt='V',
    Ampere='A',
    Watt='kW',
    Kwh='kWh',
    None='' ,
    ONOFF='ONOFF',
    OPENCLOSE ='OPENCLOSE',
    M3 ="M3",
    M33 ="m3",


}

export const UNIT_Array: Unit[]= Object.values(Unit);