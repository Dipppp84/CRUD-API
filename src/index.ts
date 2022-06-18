import * as http from "http";
import * as path from 'path';
import controller from './controller/Controller.js';
import {handlerError} from "./service/ErrorService.js";
import 'dotenv/config';

const server = http.createServer(async (req, res) => {
    const url = path.parse(path.normalize(req.url.toLowerCase()));
    try {
        controller(url, req, res).then();
    } catch (err) {
        handlerError(res, err);
    }
});
console.log(process.env)
server.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});