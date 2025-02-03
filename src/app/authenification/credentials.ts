import { truncate } from 'fs';
import { Observable } from 'rxjs';
export class Credentials {
  login: string;
  password: string;

  constructor() {
    this.login = '';
    this.password = '';
  }
}

export class User {
  id: number;
  username: String;
  login: String;
  email: String;
  avatar: String;
  fullName: String;
  phone: String;
  fixe: number;
  address: number;
  root: boolean;
  roles: Role[];
  actions: Action[];
  options: Option[];
  installationIds: number[];
  authorities: Authority[];
  enabled: boolean = true;
  creationDate: Date;
  subAccounts: User[];
  selected?: boolean = false; 
  adminId?: number;
}

export class Authority {
  id: number;
  name : string;
  label: string;
}


export class Action {
  id: number;
  type: 'CONNECT' | 'DISCONNECT';

  constructor() { }
}

export type Role =
  | "ROLE_ADMIN"
  | "ROLE_CLIENT"
  | "ROLE_SUPER_ADMIN"
  | "ROLE_COPY_RO"
  | "ROLE_CONTROL";


export class Option {
  idOption: number;
  description: string;
}
