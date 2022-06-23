import {MyError} from '../model/MyError.js';

//Проверяет переменные JSON по типу ожидаемого объекта.
//Работает только с простыми объектами и массивами(элементы только одного типа).
//target берётся из статического метода класса который возвращает пустышку для сравнения (рефлексию пока не осилил).
//Этот позор обязательно переделаю, но для текущей задачи "и так сойдёт..."
export async function JsonParse(target: object, raw: string): Promise<Object> {
    const obj = JSON.parse(raw);
    const checkFields = (obj: Object) => {
        for (const targetKey in target) {
            if (targetKey in obj)
                if (typeof target[targetKey] === typeof obj[targetKey]) {
                    if (target[targetKey] instanceof Array && (target[targetKey] !== null || target[targetKey].length !== 0)) {
                        const typeTargetArr = typeof target[targetKey][0];
                        obj[targetKey].forEach(value => {
                            if (typeof value === typeTargetArr)
                                target[targetKey].push(value)
                            else throw new MyError(500, 'Error converting JSON to Object: invalid array')
                        })
                    }
                    target[targetKey] = obj[targetKey];
                } else throw new MyError(500, 'Error converting JSON to Object')
            else target[targetKey] = null;
        }
    };
    checkFields(obj);
    return target;
}