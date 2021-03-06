'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
const isStar = true;

/**
 * Телефонная книга
 */
let phoneBook = new Map();

const isValidName = name => {
    return typeof name === 'string' && name !== '';
};

const isValidPhone = phone => {
    return /^\d{10}$/.test(phone);
};

const isQueryFinded = (item, query) => {
    return item.name.includes(query) ||
        item.phone.includes(query) ||
        item.email !== undefined && item.email.includes(query) ||
        query === '*';
};

const convertAnswer = userInf => {
    return `${userInf.name}, +7 (${
        userInf.phone.slice(0, 3)
    }) ${
        userInf.phone.slice(3, 6)
    }-${userInf.phone.slice(6, 8)}-${userInf.phone.slice(8, 10)}` +
        String(userInf.email !== undefined ? `, ${userInf.email}` : '');
};

function getContacts() {
    const res = [];
    phoneBook.forEach((value, key) => {
        let { email, name } = value;
        res.push({ name, phone: key, email });
    });

    return res.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function add(phone, name, email) {
    if (!isValidPhone(phone) || !isValidName(name) || phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

    return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String?} name
 * @param {String?} email
 * @returns {Boolean}
 */
function update(phone, name, email) {
    if (!isValidPhone(phone) || !isValidName(name) || !phoneBook.has(phone)) {
        return false;
    }

    phoneBook.set(phone, { name, email });

    return true;
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number}
 */
function findAndRemove(query) {
    if (typeof query !== 'string' || query === '') {
        return 0;
    }

    let contactsToDelete = [];
    getContacts().forEach(item => {
        if (isQueryFinded(item, query)) {
            contactsToDelete.push(item.phone);
        }
    });
    contactsToDelete.forEach(item => phoneBook.delete(item));

    return contactsToDelete.length;
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {String[]}
 */
function find(query) {
    if (typeof query !== 'string' || query === '') {
        return [];
    }

    let res = [];
    getContacts().forEach(item => {
        if (isQueryFinded(item, query)) {
            res.push(convertAnswer(item));
        }
    });

    return res;
}

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
function importFromCsv(csv) {
    // Парсим csv
    // Добавляем в телефонную книгу
    // Либо обновляем, если запись с таким телефоном уже существует
    if (typeof csv !== 'string' || csv === '') {
        return 0;
    }

    let addedCount = 0;
    csv.split('\n').forEach(item => {
        let [name, phone, email] = item.split(';');
        if (add(phone, name, email) || update(phone, name, email)) {
            addedCount++;
        }
    });

    return addedCount;
}

module.exports = {
    add,
    update,
    findAndRemove,
    find,
    importFromCsv,

    isStar
};
