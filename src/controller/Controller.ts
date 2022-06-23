import {IncomingMessage, OutgoingHttpHeaders, ServerResponse} from "http";
import {ParsedPath} from "path";
import * as UserService from "../service/UsersService.js";
import {MyError} from "../model/MyError.js";
import {User} from "../model/User.js";
import {JsonParse} from "../utils/JsonUtil.js";

const header: OutgoingHttpHeaders = {
    'content-type': 'application/json'
};

async function readRaw(req: IncomingMessage): Promise<string> {
    let raw = await new Promise(resolve => {
        const chunks = [];
        req.on('data', function (chunk) {
            chunks.push(chunk);
        });
        req.on('end', function () {
            req.destroy();
            resolve(chunks);
        });
    });
    return raw.toString();
}

export default async function controller(url: ParsedPath, req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (url.dir === '\\api' && url.base === 'users') {
        if (req.method === 'GET') {
            //getALL
            const users = await UserService.getAll();
            res.writeHead(200, header);
            res.end(await JSON.stringify(users));
        } else if (req.method === 'POST') {
            //save
            const raw = await readRaw(req);
            const user: User = <User>(await JsonParse(User.getTargetForJSON(), raw));
            const responseUser = await UserService.save(user);
            res.writeHead(201, header);
            res.end(await JSON.stringify(responseUser));
        } else {
            sentNotFound(req.url);
        }
    } else if (url.dir === '\\api\\users') {
        if (req.method === 'GET') {
            //get By ID
            const userId = url.base;
            const user = await UserService.findById(userId);
            res.writeHead(200, header);
            res.end(await JSON.stringify(user));
        } else if (req.method === 'PUT') {
            // UPDATE
            const userId = url.base;
            const raw = await readRaw(req);
            const user: User = <User>(await JsonParse(User.getTargetForJSON(), raw));
            const responseUser = await UserService.update(userId, user);
            res.writeHead(200, header);
            res.end(await JSON.stringify(responseUser));
        } else if (req.method === 'DELETE') {
            //DELETE
            const userId = url.base;
            await UserService.remove(userId);
            res.writeHead(204, header);
            res.end();
        } else {
            sentNotFound(req.url);
        }
    } else {
        sentNotFound(req.url);
    }
}

function sentNotFound(url): void {
    throw new MyError(404, `Sorry: request \'${url}\' not found`);
}