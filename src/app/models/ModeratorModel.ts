export class ModeratorModel{
    constructor(
        public Id: string = "",
        public name:string = "",
        public email:string = "",
        public isdeleted:boolean = false
    )
    {}
}