export class MyError extends Error{
    code: number;
    message : string;
    constructor(code, message) {
        super();
        this.code = code;
        this.message = message;
    }
}