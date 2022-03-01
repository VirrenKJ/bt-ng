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
	public assignedId: number;
	public assignedName: string;
	public summary: string;
	public description: string;
	public stepsToReproduce: string;
	public addInfo: string;
	public documentId: number;
	public viewStatus: string = 'public';
	public deleteFlag: boolean;
}
