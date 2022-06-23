import {OutgoingHttpHeaders, ServerResponse} from "http";
import {MyError} from "../model/MyError.js";

const header: OutgoingHttpHeaders = {
    'content-type': 'application/json'
};

export function handlerError(res: ServerResponse, err: MyError | Error): void {
    if (err instanceof MyError) {
        sendMyError(res, err);
    } else {
        sendServerError(res);
    }
}

function sendServerError(res: ServerResponse): void {
    res.writeHead(500, header);
    res.end('{message: \'Sorry, the request caused a server error\'}');
}

function sendMyError(res: ServerResponse, err: MyError): void {
    res.writeHead(err.code, header);
    res.end(JSON.stringify(err));
}