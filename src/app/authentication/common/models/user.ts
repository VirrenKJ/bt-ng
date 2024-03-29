import { Role } from './role';

export class User {
  public id: number;
  public firstName: string;
  public lastName: string;
  public username: string;
  public password: string;
  public email: string;
  public enabled: boolean = true;
  public deleteFlag: boolean;
  public roles = new Array<Role>();
}
