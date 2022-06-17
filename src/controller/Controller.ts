import {IncomingMessage, OutgoingHttpHeaders, ServerResponse} from "http";
import {MyError} from "../model/MyError";
import {ParsedPath} from "path";
import * as UserService from "../service/UsersService";
import {User} from "../model/User";
import {handlerError} from "../service/ErrorService";

const header: OutgoingHttpHeaders = {
    'content-type': 'txt/json'
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
            let users;
            try {
                users = await UserService.getAll();
            } catch (err) {
                handlerError(res, err);
            }
            res.writeHead(200, header);
            res.end(await JSON.stringify(users));
        } else if (req.method === 'POST') {
            //save
            const raw = await readRaw(req);
            let user: User;
            let responseUser;
            try {
                user = await JSON.parse(raw);
                responseUser = await UserService.save(user);
            } catch (err) {
                handlerError(res, err);
            }
            res.writeHead(201, header);
            res.end(await JSON.stringify(responseUser));
        }
    } else if (url.dir === '\\api\\users') {
        if (req.method === 'GET') {
            //get By ID
            const userId = url.base;
            let user;
            try {
                user = await UserService.findById(userId);
            } catch (err) {
                handlerError(res, err);
            }
            res.writeHead(200, header);
            res.end(JSON.stringify(user));
        } else if (req.method === 'PUT') {
            // UPDATE
            const userId = url.base;
            let user;
            let responseUser;
            try {
                user = await readRaw(req);
                responseUser = await UserService.update(userId, user);
            } catch (err) {
                handlerError(res, err);
            }
            res.writeHead(200, header);
            res.end(await JSON.stringify(responseUser));
        } else if (req.method === 'DELETE') {
            //DELETE
            const userId = url.base;
            try {
                await UserService.remove(userId);
            } catch (err) {
                handlerError(res, err);
            }
            res.writeHead(204, header);
        }
    } else {
        handlerError(res, new MyError(404, `Sorry: request \'${url}\' not recognized`))
    }
}