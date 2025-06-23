export class VoterEmailModel{
    constructor(
        public email:string = "",
        public moderatorId: string = "",
        public isUsed:boolean = false,
        public createdAt:string = "",
    )
    {}
}