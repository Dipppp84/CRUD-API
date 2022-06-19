import * as http from 'http';
import * as path from 'path';
import controller from './controller/Controller.js';
import {handlerError} from "./service/ErrorService.js";
import 'dotenv/config';
import {cpus} from 'os';
import cluster from 'cluster'

const port = process.env.PORT || 3000;
const pid = process.pid;

export const server = http.createServer(async (req, res) => {
    const url = path.parse(path.normalize(req.url.toLowerCase()));
    res.setHeader('PID', pid)
    try {
        await controller(url, req, res);
    } catch (err) {
        handlerError(res, err);
    }
});
if (process.argv[2] === 'multi') {
    if (cluster.isPrimary) {
        console.log(`Primary PID: ${pid}`);
        const numCPUs = cpus().length;
        console.log(`Starting ${numCPUs} forks`);
        for (let i = 0; i < numCPUs; i++) {
            cluster.fork();
        }
        console.log('Server is running on port ' + port);
    } else {
        server.listen(port);
        console.log(`Worker PID: ${pid} started`);
    }
} else {
    server.listen(port);
    console.log('Server is running on port ' + port);
}