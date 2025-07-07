export class MessageModel {
    constructor(
        public id: string = '',
        public msg: string = '',
        public from: string = '',
        public pollId: string | null = null,
        public to: string | null = null,
        public sentAt: string = ''
    ){}
}
