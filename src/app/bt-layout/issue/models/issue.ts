export class Issue {
	public id: number;
	public projectId: number;
	public categoryId: number;
	public reproducibility: number;
	public severity: number;
	public priority: number;
	public profileId: number;
	public assignedId: number;
	public summary: string;
	public description: string;
	public stepsToReproduce: string;
	public addInfo: string;
	public documentId: number;
	public viewStatus: string;
	public deleteFlag: boolean;
}
