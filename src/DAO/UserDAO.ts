import {User} from '../model/User.js'
const DAO: Map<string, User> = new Map();
export async function findById(id: string): Promise<User> {
    return DAO.get(id);
}

export async function getAll(): Promise<Array<User>> {
    return Array.from(DAO.values());
}

export async function save(user: User): Promise<User> {
    DAO.set(user.id, user);
    return user;
}

export async function update(id: string, user: User): Promise<User> {
    const baseUser = DAO.get(id);
    !Boolean(user.username) || (baseUser.username = user.username);
    !user.hobbies || (baseUser.hobbies = user.hobbies);
    !user.age || (baseUser.age = user.age);
    return baseUser;
}

export async function remove(id: string): Promise<boolean> {
    return DAO.delete(id);
}
