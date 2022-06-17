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

export async function update(user: User): Promise<User> {
    const updateUser = DAO.get(user.id);
    if (updateUser.username) updateUser.username = user.username;
    if (updateUser.hobbies) updateUser.hobbies = user.hobbies;
    if (updateUser.age) updateUser.age = user.age;
    return user;
}

export async function remove(id: string): Promise<boolean> {
    return DAO.delete(id);
}
