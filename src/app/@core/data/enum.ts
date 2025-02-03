import { owner } from '../../global.config';

export enum AlertType {
    ENERGY = 'ENERGY',
    DISCONNECTION = 'DISCONNECTION',
    VARIATION = 'VARIATION',
    TEMPERATURE_THRESHOLD = 'TEMPERATURE_THRESHOLD',
    SIMPLE = 'SIMPLE',
    SIMPLE_VAL = 'SIMPLE_VAL',
    AMPERAGE = 'AMPERAGE',
    VOLTAGE = 'VOLTAGE',
    POWER = 'POWER',
    DEPHASAGE = 'DEPHASAGE',
    CALORIFIQUE = 'CALORIFIQUE',
    GAZ = 'GAZ',
    EAU = 'EAU',
}

export enum AlertConfigType { 
    TIME = 'TIME',
    WEEK_DAYS = 'WEEK_DAYS',
    DATE = 'DATE',
    ACTIVE_W_DAY = 'ACTIVE_W_DAY',
    DISCONNECTION = 'DISCONNECTION',
    VARIATION = 'VARIATION',
    TEMPERATURE_THRESHOLD = 'TEMPERATURE_THRESHOLD',
    VALUE = 'VALUE'/*,
    AMPERAGE = 'AMPERAGE',
    VOLTAGE = 'VOLTAGE',
    POWER = 'POWER',
    DEPHASAGE = 'DEPHASAGE'*/
}

export enum Operator {
    MAX = '>=',
    MIN = '<=',
    BETWEEN = 'Between',
    NOT_BETWEEN = 'Not between',
    IN = 'IN',
    OUT = 'OUT',
    EQUAL = '=',
    NOT_EQUAL = '!=',
    NONE = 'NONE'
}

export enum days {
    Sun,
    Mon,
    Tue,
    Wed,
    Thu,
    Fri,
    Sat
}
