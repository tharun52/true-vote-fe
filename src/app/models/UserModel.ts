export class UserModel{ 
    constructor(
        public userId: string = "",
        public username: string = "",
        public role: string = "",
        public token: string = "",
        public refreshToken: string = "") 
    {} 
}