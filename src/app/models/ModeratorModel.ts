export class ModeratorModel{
    constructor(
        public Id: string = "",
        public name:string = "",
        public email:string = "",
        public isdeleted:boolean = false
    )
    {}
}

export class ModeratorQueryDto {
  constructor(
    public searchTerm?: string,
    public sortBy?: string,
    public sortDesc?: boolean,
    public page: number = 1,
    public pageSize: number = 10,
    public isDeleted: boolean = false
  ) {}
}
