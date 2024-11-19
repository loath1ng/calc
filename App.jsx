import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CalculatorForm from './components/CalculatorForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <Router>
            <nav>
                <Link to="/">Калькулятор</Link>
                <Link to="/register">Регистрация</Link>
                <Link to="/login">Вход</Link>
            </nav>
            <Routes>
                <Route path="/" element={token ? <CalculatorForm token={token} /> : <p>Войдите для доступа.</p>} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm setToken={setToken} />} />
            </Routes>
        </Router>
    );
};

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CalculatorForm from './components/CalculatorForm';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import StatsPage from './components/StatsPage';

const App = () => {
    const [token, setToken] = useState(null);

    return (
        <Router>
            <nav>
                <Link to="/">Калькулятор</Link>
                <Link to="/stats">Статистика</Link>
                <Link to="/register">Регистрация</Link>
                <Link to="/login">Вход</Link>
            </nav>
            <Routes>
                <Route path="/" element={token ? <CalculatorForm token={token} /> : <p>Войдите для доступа.</p>} />
                <Route path="/stats" element={token ? <StatsPage token={token} /> : <p>Войдите для доступа.</p>} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm setToken={setToken} />} />
            </Routes>
        </Router>
    );
};

export default App;

