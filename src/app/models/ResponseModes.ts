export class ApiResponse<T>{
    constructor(
        public success:boolean,
        public message:string,
        public data: T | null,
        public  errors?: { [key: string]: string[]}
    ){}
}

export class PagedResponse<T>{
    constructor(
        public data:T[],
        public pagination:Pagination
    ){} 
}

export class Pagination{
    constructor(
        public totalRecords:number,
        public page:number, 
        public pageSize:number,
        public totalPages:number
    ){}
}