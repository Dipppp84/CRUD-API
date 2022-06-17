export class MyError extends Error{
    code: number;
    constructor(code, message) {
        super(message);
        this.code = code;
    }
}