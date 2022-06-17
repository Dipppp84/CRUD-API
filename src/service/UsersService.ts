import * as UserDAO from '../DAO/UserDAO.js'
import {randomUUID} from "crypto";
import {MyError} from '../model/MyError.js'
import {User} from '../model/User.js'

save({id: null , age: 1, hobbies:['node JS','anime'],username: 'name1'})

export async function findById(id: string): Promise<User> {
    if (!checkValidUuid(id))
        throw new MyError(400, 'userId is invalid');
    const user = await UserDAO.findById(id);
    if (!user)
        throw new MyError(404, 'Not found');
    return user;
}

export async function getAll(): Promise<Array<User>> {
    return await UserDAO.getAll();
}

export async function save(user: User): Promise<User> {
    if (!user.username || !user.age || !user.hobbies)
        throw new MyError(400, 'User does not contain required fields: username, age, hobbies.');
    user.id = randomUUID();
    return await UserDAO.save(user);
}

export async function update(id: string, user: User): Promise<User> {
    if (!checkValidUuid(id))
        throw new MyError(400, 'userId is invalid');
    const checkUser = await UserDAO.findById(id);
    if (!checkUser)
        throw new MyError(404, 'Not found');
    return await UserDAO.update(user);
}

export async function remove(id: string): Promise<void> {
    if (!checkValidUuid(id))
        throw new MyError(400, 'userId is invalid');
    const removeBoolean = await UserDAO.remove(id);
    if (!removeBoolean)
        throw new MyError(404, 'Not found');
}

function checkValidUuid(uuid: string): boolean {
    return uuid.length === 36 && uuid.split('-').length === 5;
}
