import { SearchFieldObj } from './search_field_obj';

export class SearchCriteriaObj {
  public page: number;
  public limit: number;
  public sortType: number;
  public counter: number;
  public sortField: string;
  public searchFieldsObj: SearchFieldObj;

  constructor() {}
}
