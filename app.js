// Импорты
const express = require('express');
const app = express();

// Helmet
const helmet = require('helmet');
app.use(helmet());

// MongoDB подключение
const mongoose = require('./db');


// Middleware для обработки JSON-запросов
app.use(express.json());

// Middleware для обработки CORS
const cors = require('cors');
app.use(cors());

// Middleware для проверки токенов
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Доступ запрещен' });

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Недействительный токен' });
    }
};




const CalculationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    distance: Number,
    fuelConsumption: Number,
    fuelType: String,
    totalEmissionsCO2e: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Calculation', CalculationSchema);


// Логика сохранений
app.post('/calculate-emissions', authenticate, async (req, res) => {
    const { distance, fuelConsumption, fuelType } = req.body;

    try {
        const results = calculateEmissions(distance, fuelConsumption, fuelType);

        // Сохранение в базе данных
        const newCalculation = new Calculation({
            userId: req.user.id,
            distance,
            fuelConsumption,
            fuelType,
            totalEmissionsCO2e: results.totalEmissionsCO2e
        });
        await newCalculation.save();

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Вывод статистики
app.get('/stats', authenticate, async (req, res) => {
    const stats = await Calculation.find({ userId: req.user.id });
    res.json(stats);
});



// Порты для сервера
const PORT = process.env.PORT || 5000; // Используем PORT от Railway или 5000 по умолчанию



// Константы для регистрации
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Модель пользователя

// Регистрация
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Проверка наличия пользователя
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ error: 'Пользователь уже существует' });
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Регистрация успешна' });
});


// Вход
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Проверка пользователя
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ error: 'Неверное имя пользователя или пароль' });
    }

    // Генерация JWT
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });
    res.json({ token });
});






// Словарь коэффициентов выбросов для разных видов топлива (в кг/л)
const EMISSION_FACTORS = {
    'Бензин': { CO2: 2.31, N2O: 0.0003, CH4: 0.0001 },
    'Дизель': { CO2: 2.68, N2O: 0.0004, CH4: 0.0001 },
    'Природный газ': { CO2: 2.75, N2O: 0.0002, CH4: 0.0002 }
};

// GWP индекс для N2O и CH4
const GWP_N2O = 298;
const GWP_CH4 = 25;

// Основная формула расчета выбросов CO2, N2O и CH4
const calculateEmissions = (distance, fuelConsumption, fuelType) => {
    const fuelUsed = (distance / 100) * fuelConsumption;

    const factors = EMISSION_FACTORS[fuelType];
    if (!factors) {
        throw new Error(`Неизвестный тип топлива: ${fuelType}`);
    }

    const { CO2: CO2_FACTOR, N2O: N2O_FACTOR, CH4: CH4_FACTOR } = factors;

    const emissionsCO2 = fuelUsed * CO2_FACTOR;
    const emissionsN2O = fuelUsed * N2O_FACTOR;
    const emissionsCH4 = fuelUsed * CH4_FACTOR;

    const emissionsN2O_CO2e = emissionsN2O * GWP_N2O;
    const emissionsCH4_CO2e = emissionsCH4 * GWP_CH4;

    const totalEmissionsCO2e = emissionsCO2 + emissionsN2O_CO2e + emissionsCH4_CO2e;

    return {
        emissionsCO2,
        emissionsN2O,
        emissionsCH4,
        emissionsN2O_CO2e,
        emissionsCH4_CO2e,
        totalEmissionsCO2e
    };
};

// Обработка POST-запроса для расчета выбросов
app.post('/calculate-emissions', (req, res) => {
    const { distance, fuelConsumption, fuelType } = req.body;

    // Проверка входных данных
    if (!distance || !fuelConsumption || !fuelType) {
        return res.status(400).json({ error: 'Пожалуйста, предоставьте корректные данные (пробег, расход топлива, тип топлива).' });
    }

    if (!EMISSION_FACTORS[fuelType]) {
        return res.status(400).json({ error: `Тип топлива "${fuelType}" не поддерживается.` });
    }

    try {
        // Расчет выбросов
        const results = calculateEmissions(distance, fuelConsumption, fuelType);

        // Отправка ответа с результатами
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/calculate-emissions', (req, res) => {
    res.send('Этот маршрут поддерживает только POST-запросы.');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
});
