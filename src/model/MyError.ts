export class MyError extends Error{
    code: number;
    message : string;
    constructor(code, message) {
        super(message);
        this.message = message;
        this.code = code;
    }
}