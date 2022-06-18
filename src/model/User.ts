export class User {
    id?: string;
    username: string;
    age: number;
    hobbies: string[];

    static getTargetForJSON(): User {
        return {id: ' ',username: ' ', age: 1, hobbies: [' '], };
    }
}
