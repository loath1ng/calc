import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Подключаем стили
import App from './App'; // Корневой компонент приложения
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root') // Подключаем приложение к корневому элементу в public/index.html
);
