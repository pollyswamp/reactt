import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RegistrationModal, LoginModal, AppointmentModal } from './components/Modals';
import { useAuth } from './hooks/useAuth';
import {
    registerUser, loginUser, makeAppointment, getUserAppointments, cancelAppointment
} from './api/api';

// Убедитесь, что изображения находятся в public/static/
import arrowIcon from './static/Screenshot_6.png';
import userImage from './static/Screenshot_6.png';

const App = () => {
    const backendUrl = 'http://localhost:5000'; // Ваш URL бэкенда

    const { user, login, logout, checkAuth } = useAuth();

    const [currentPage, setCurrentPage] = useState('main-portfolio-page');
    const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);
    const [isLoginModalOpen, setLoginModalOpen] = useState(false);
    const [isAppointmentModalOpen, setAppointmentModalOpen] = useState(false);

    const [registrationMessage, setRegistrationMessage] = useState('');
    const [loginMessage, setLoginMessage] = useState('');
    const [appointmentMessage, setAppointmentMessage] = useState('');
    const [userAppointments, setUserAppointments] = useState([]);
    const [noAppointmentsMessageVisible, setNoAppointmentsMessageVisible] = useState(false);

    useEffect(() => {
        checkAuth();
        // В случае необходимости загрузить заявки при первой загрузке,
        // если пользователь уже авторизован и страница Мои заявки активна по умолчанию.
        // if (user && currentPage === 'appointment-list-page') {
        //     fetchUserAppointments();
        // }
    }, [user]); // Зависимость от user, чтобы обновить UI при изменении статуса авторизации

    // Functions to handle modals
    const closeAllModals = () => {
        setRegistrationModalOpen(false);
        setLoginModalOpen(false);
        setAppointmentModalOpen(false);
    };

    const handleRegisterClick = () => {
        closeAllModals();
        setRegistrationModalOpen(true);
        setRegistrationMessage('');
    };

    const handleLoginClick = () => {
        closeAllModals();
        setLoginModalOpen(true);
        setLoginMessage('');
    };

    const handleAppointmentClick = () => {
        if (!user) {
            alert('Для записи на приём необходимо войти в аккаунт.');
            handleLoginClick();
            return;
        }
        closeAllModals();
        setAppointmentModalOpen(true);
        setAppointmentMessage('');
    };

    const handleMyAppsClick = async () => {
        setCurrentPage('appointment-list-page');
        await fetchUserAppointments();
    };

    const handleBackToMainClick = () => {
        setCurrentPage('main-portfolio-page');
    };

    const redirectTo = (url) => {
        window.location.href = url;
    };

    // Form submission handlers
    const handleRegistrationSubmit = async (data) => {
        try {
            const response = await registerUser(backendUrl, data.username, data.password);
            setRegistrationMessage({ text: response.message, type: 'success' });
            setTimeout(() => {
                closeAllModals();
                handleLoginClick();
            }, 1500);
        } catch (error) {
            setRegistrationMessage({ text: error.response?.data?.message || 'Ошибка регистрации', type: 'error' });
        }
    };

    const handleLoginSubmit = async (data) => {
        try {
            const response = await loginUser(backendUrl, data.username, data.password);
            setLoginMessage({ text: response.message, type: 'success' });
            login(response.accessToken, response.user.username);
            setTimeout(closeAllModals, 1500);
        } catch (error) {
            setLoginMessage({ text: error.response?.data?.message || 'Ошибка входа', type: 'error' });
        }
    };

    const handleAppointmentSubmit = async (data) => {
        try {
            const response = await makeAppointment(backendUrl, user.token, data);
            setAppointmentMessage({ text: response.message, type: 'success' });
            setTimeout(closeAllModals, 1500);
            if (currentPage === 'appointment-list-page') {
                await fetchUserAppointments();
            }
        } catch (error) {
            setAppointmentMessage({ text: error.response?.data?.message || 'Ошибка записи на приём', type: 'error' });
        }
    };

    const fetchUserAppointments = async () => {
        if (!user || !user.token) {
            setUserAppointments([]);
            setNoAppointmentsMessageVisible(true);
            return;
        }
        try {
            const appointments = await getUserAppointments(backendUrl, user.token);
            setUserAppointments(appointments);
            setNoAppointmentsMessageVisible(appointments.length === 0);
        } catch (error) {
            console.error('Ошибка при получении заявок:', error);
            setUserAppointments([]);
            setNoAppointmentsMessageVisible(false); // Скрыть сообщение, если ошибка
            // Отобразить сообщение об ошибке, если нужно
            // appointmentsListDiv.innerHTML = '<p class="message error">Не удалось загрузить ваши заявки. Попробуйте позже.</p>';
        }
    };

    const handleCancelAppointment = async (appointmentId) => {
        if (!window.confirm('Вы уверены, что хотите отменить эту заявку?')) {
            return;
        }

        try {
            await cancelAppointment(backendUrl, user.token, appointmentId);
            alert('Заявка отменена.');
            await fetchUserAppointments(); // Обновить список после отмены
        } catch (error) {
            alert(error.response?.data?.message || 'Не удалось отменить заявку.');
        }
    };

    return (
        <div className="container">
            <header>
                <h1>ПОЛИНА</h1>
                <div className="second_name">
                    <h1>ПОДБОЛОТОВА</h1>
                    <p className="subitem">копирайтер</p>
                    <p className="subitem">делаю ярко</p>
                    <p className="subitem">качественно</p>
                </div>
                <div id="auth-status">
                    {user ? (
                        <>
                            <span id="usernameDisplay">Привет, <strong id="loggedInUsername">{user.username}</strong>!</span>
                            <button id="logoutBtn" onClick={logout}>Выйти</button>
                            <button id="myAppointmentsBtn" onClick={handleMyAppsClick}>Мои заявки</button>
                        </>
                    ) : (
                        <button id="loginBtn" onClick={handleLoginClick}>Войти</button>
                    )}
                </div>
            </header>

            <main id="main-portfolio-page" className={`page-content ${currentPage === 'main-portfolio-page' ? 'active' : ''}`}>
                <div className="content">
                    <div className="image-section">
                        <img src={userImage} alt="Полина Подболотова" />
                    </div>
                    <div className="text-section">
                        <ul>
                            <li><img src={arrowIcon} className="icon" alt="стрелка" />Более 2 лет опыта в копирайтинге для IT и маркетинга</li>
                            <li><img src={arrowIcon} className="icon" alt="стрелка" />Создаю тексты, которые продают</li>
                            <li><img src={arrowIcon} className="icon" alt="стрелка" />Увеличиваю продажи и узнаваемость брендов</li>
                        </ul>
                    </div>
                </div>
                <section className="skills">
                    <h2>НАВЫКИ</h2>
                    <div className="skills-grid">
                        <div className="skill-circle">Анализ целевой аудитории</div>
                        <div className="skill-circle">SEO-оптимизация</div>
                        <div className="skill-circle">Знание<br /> английского языка<br /> на уровне B2</div>
                        <div className="skill-circle">Знание<br /> маркетинга</div>
                        <div className="skill-circle">Адаптация к<br /> различным форматам</div>
                        <div className="skill-circle">Знание<br /> немецкого языка <br />на уровне B1</div>
                    </div>
                </section>
                <section className="contacts">
                    <h2>КОНТАКТЫ</h2>
                    <div className="contacts-container">
                        <div className="contact-info">
                            <p><img src={arrowIcon} className="icon" alt="стрелка" /> pollyswamp@gmail.com</p>
                            <p><img src={arrowIcon} className="icon" alt="стрелка" /> +7 927 831 88 55</p>
                        </div>
                        <div className="contact-links">
                            <div className="contact-circle" onClick={() => redirectTo('https://t.me/polly_swamp')}>TG</div>
                            <div className="contact-circle" onClick={() => redirectTo('https://vk.com/polly_swamp')}>VK</div>
                            <div className="contact-circle" onClick={() => redirectTo('https://hh.ru/polly_swamp')}>HH</div>
                        </div>
                    </div>
                    <div className="action-buttons">
                        <button id="registerBtn" onClick={handleRegisterClick}>Зарегистрироваться</button>
                        <button id="appointmentBtn" onClick={handleAppointmentClick}>Записаться на приём</button>
                    </div>
                </section>
            </main>

            <section id="appointment-list-page" className={`page-content ${currentPage === 'appointment-list-page' ? 'active' : ''}`}>
                <button id="backToMainBtn" onClick={handleBackToMainClick}>← На главную</button>
                <h2>МОИ ЗАЯВКИ</h2>
                <div id="appointmentsList">
                    {noAppointmentsMessageVisible && (
                        <p id="noAppointmentsMessage" style={{ display: 'block' }}>У вас пока нет активных заявок.</p>
                    )}
                    {userAppointments.map(app => (
                        <div className="appointment-item" key={app.id}>
                            <p><strong>Услуга:</strong> {app.service}</p>
                            <p><strong>Дата:</strong> {app.date} в {app.time}</p>
                            <p><strong>Имя:</strong> {app.name}</p>
                            <p><strong>Email:</strong> {app.email}</p>
                            {app.phone && <p><strong>Телефон:</strong> {app.phone}</p>}
                            <p><strong>Статус:</strong> {app.status}</p>
                            <button className="cancel-btn" onClick={() => handleCancelAppointment(app.id)}>Отменить</button>
                        </div>
                    ))}
                </div>
            </section>

            <RegistrationModal
                isOpen={isRegistrationModalOpen}
                onClose={closeAllModals}
                onSubmit={handleRegistrationSubmit}
                message={registrationMessage}
            />
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={closeAllModals}
                onSubmit={handleLoginSubmit}
                message={loginMessage}
            />
            <AppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={closeAllModals}
                onSubmit={handleAppointmentSubmit}
                message={appointmentMessage}
            />
        </div>
    );
};

export default App;