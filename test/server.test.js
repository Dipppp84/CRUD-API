import request from 'supertest'
import {server} from '../dist/index.js'


describe('Basic server tests', () => {
    function checkValidUuid(uuid) {
        return uuid.length === 36 && uuid.split('-').length === 5;
    }

    const userForSave = {
        "username": "name1",
        "age": 111,
        "hobbies": [
            "node JS",
            "anime"
        ]
    };
    //ожидает получит пустой массив с кодом 200
    it('GET all user', async () => {
        const res = await request(server).get('/api/users');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    })
    //добавляет нового юзера,
    //проверяет на валидность ИД, и сверяет res.body с userForSave без ИД,
    //сохраняет ид для дальнейших тестов
    it('POST save user', async () => {
        const res = await request(server).post('/api/users').send(userForSave);
        expect(res.statusCode).toBe(201);
        const resBody = JSON.parse(JSON.stringify(res.body));
        expect(true).toBe(checkValidUuid(resBody.id));
        const tempId = resBody.id;
        delete resBody.id;
        expect(resBody).toEqual(userForSave);
        userForSave.id = tempId;

    })
    //получает юзера по ИД из userForSave, и сверяет с userForSave
    it('GET user by id:' + userForSave.id, async () => {
        const res = await request(server).get('/api/users/' + userForSave.id);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(userForSave);
    })
    //отправляет по ИД из userForSave изменённый объект, возвращает объект с изменёнными полями
    //проверяет что ид не изменился, а изменённые поля (Не новый объект, а именно изменённые поля)
    it('PUT update user', async () => {
        const userForUpdate = {
            "username": "UpdateName1",
            "age": 99,
            "hobbies": [
                "node JS",
                "anime"
            ]
        };
        const res = await request(server).put('/api/users/' + userForSave.id).send(userForUpdate);
        expect(res.statusCode).toBe(200);
        const resBody = JSON.parse(JSON.stringify(res.body));
        expect(userForSave.id).toBe(resBody.id);
        delete resBody.id;
        expect(userForUpdate).toEqual(resBody);
    })
    //Удаляет по ИД из userForSave ожидает 204
    it('DELETE user by id:', async () => {
        const res = await request(server).delete('/api/users/' + userForSave.id);
        expect(res.statusCode).toBe(204);
    })
    //пытается получить удалённый объект, ожидает получит код 404
    it('GET deleted object', async () => {
        const res = await request(server).get('/api/users/' + userForSave.id);
        expect(res.statusCode).toBe(404);
    })
})

