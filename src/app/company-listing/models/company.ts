import { UserDetail } from './../../authentication/common/models/user-detail';

export class Company {
  public id: number;
  public companyDbDetailId: number;
  public userId: number;
  public name: string;
  public dbName: string;
  public dbUuid: string;
  public email: string;
  public contactNumber: number;
  public industryType: string;
  public pinCode: number;
  public state: string;
  public city: string;
  public deleteFlag: boolean;
  public userDetails: UserDetail[];
}
