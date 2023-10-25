export class Issue {
  public id: number;
  public projectId: number;
  public projectName: string;
  public categoryId: number;
  public categoryName: string;
  public reproducibility: string;
  public severity: string;
  public priority: string;
  public profileId: number;
  public profileName: string;
  public assignedId: number;
  public assignedFirstName: string;
  public assignedUsername: string;
  public reportedById: number;
  public reportedByFirstName: string;
  public reportedByUsername: string;
  public summary: string;
  public description: string;
  public stepsToReproduce: string;
  public addInfo: string;
  public documentId: number;
  public viewStatus: string = 'public';
  public deleteFlag: boolean;
}
