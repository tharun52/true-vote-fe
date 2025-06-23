export class VoterModel{
    constructor(
        public id: string = "",
        public name: string = "",
        public email: string = "",
        public age: number,
        public isDeleted: false,
        public moderatorId: string = "",
    )
    {}
}