import React, { useState, useEffect } from 'react';

// Общий компонент для модального окна
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <span className="close-button" onClick={onClose}>&times;</span>
                {children}
            </div>
        </div>
    );
};

export const RegistrationModal = ({ isOpen, onClose, onSubmit, message }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setUsername('');
            setPassword('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ username, password });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Регистрация</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="regUsername">Имя пользователя:</label>
                <input
                    type="text"
                    id="regUsername"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="regPassword">Пароль:</label>
                <input
                    type="password"
                    id="regPassword"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Зарегистрироваться</button>
                {message && <p className={`message ${message.type}`}>{message.text}</p>}
            </form>
        </Modal>
    );
};

export const LoginModal = ({ isOpen, onClose, onSubmit, message }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setUsername('');
            setPassword('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ username, password });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="loginUsername">Имя пользователя:</label>
                <input
                    type="text"
                    id="loginUsername"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <label htmlFor="loginPassword">Пароль:</label>
                <input
                    type="password"
                    id="loginPassword"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
                {message && <p className={`message ${message.type}`}>{message.text}</p>}
            </form>
        </Modal>
    );
};

export const AppointmentModal = ({ isOpen, onClose, onSubmit, message }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        service: ''
    });

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                name: '', email: '', phone: '', date: '', time: '', service: ''
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>Запись на приём</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="appName">Ваше имя:</label>
                <input
                    type="text"
                    id="appName"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="appEmail">Email:</label>
                <input
                    type="email"
                    id="appEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="appPhone">Телефон (необязательно):</label>
                <input
                    type="tel"
                    id="appPhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <label htmlFor="appDate">Дата:</label>
                <input
                    type="date"
                    id="appDate"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="appTime">Время:</label>
                <input
                    type="time"
                    id="appTime"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                />
                <label htmlFor="appService">Услуга:</label>
                <select
                    id="appService"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                >
                    <option value="">Выберите услугу</option>
                    <option value="Копирайтинг">Копирайтинг</option>
                    <option value="Редактирование">Редактирование</option>
                    <option value="SEO-оптимизация">SEO-оптимизация</option>
                </select>
                <button type="submit">Записаться</button>
                {message && <p className={`message ${message.type}`}>{message.text}</p>}
            </form>
        </Modal>
    );
};