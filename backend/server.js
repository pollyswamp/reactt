const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(bodyParser.json());

const usersFilePath = path.join(__dirname, 'data', 'users.json');
const appointmentsFilePath = path.join(__dirname, 'data', 'appointments.json');

const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Ошибка чтения файла ${filePath}:`, error.message);
        return [];
    }
};

const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error(`Ошибка записи в файл ${filePath}:`, error.message);
    }
};

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
    }

    const users = readJsonFile(usersFilePath);

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: 'Пользователь с таким именем уже существует' });
    }

    const newUser = { id: Date.now(), username, password };
    users.push(newUser);
    writeJsonFile(usersFilePath, users);

    res.status(201).json({ message: 'Регистрация успешна', user: { id: newUser.id, username: newUser.username } });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Имя пользователя и пароль обязательны' });
    }

    const users = readJsonFile(usersFilePath);
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Неверное имя пользователя или пароль' });
    }

    const accessToken = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Авторизация успешна', accessToken, user: { id: user.id, username: user.username } });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
    const { name, email, phone, date, time, service } = req.body;
    const userId = req.user.id;

    if (!name || !email || !date || !time || !service) {
        return res.status(400).json({ message: 'Все поля записи обязательны' });
    }

    const appointments = readJsonFile(appointmentsFilePath);
    const newAppointment = { id: Date.now(), userId, name, email, phone, date, time, service, status: 'активна' };
    appointments.push(newAppointment);
    writeJsonFile(appointmentsFilePath, appointments);

    res.status(201).json({ message: 'Запись успешно создана', appointment: newAppointment });
});

app.get('/api/user-appointments', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const appointments = readJsonFile(appointmentsFilePath);
    const userAppointments = appointments.filter(app => app.userId === userId);
    res.status(200).json(userAppointments);
});

app.delete('/api/appointments/:id', authenticateToken, (req, res) => {
    const appointmentId = parseInt(req.params.id);
    const userId = req.user.id;
    let appointments = readJsonFile(appointmentsFilePath);

    const initialLength = appointments.length;
    appointments = appointments.filter(app => !(app.id === appointmentId && app.userId === userId));

    if (appointments.length === initialLength) {
        return res.status(404).json({ message: 'Запись не найдена или у вас нет прав на ее отмену.' });
    }

    writeJsonFile(appointmentsFilePath, appointments);
    res.status(200).json({ message: 'Запись успешно отменена.' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
