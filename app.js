// Импорты
const express = require('express');
const app = express();

// Helmet
const helmet = require('helmet');
app.use(helmet());

// Middleware для обработки JSON-запросов
app.use(express.json());

// Middleware для обработки CORS
const cors = require('cors');
app.use(cors());

// Порты для сервера
const PORT = 8080;

// Основная формула расчета выбросов CO2, N2O и CH4
const calculateEmissions = (distance, fuelConsumption, fuelType) => {
    // Выбросы парниковых газов от сжигания 1л бензина (в кг/л)
    const CO2_EMISSION_FACTOR = 2.31; // C02 бенз
    const N2O_EMISSION_FACTOR = 0.0003; // N2O бенз
    const CH4_EMISSION_FACTOR = 0.0001; // CH4 бенз

    // GWP индекс для N2O и CH4
    const GWP_N2O = 298;
    const GWP_CH4 = 25;

    // Расчет общего объема использованного топлива (в литрах)
    const fuelUsed = (distance * fuelConsumption) / 100;

    // Расчет выбросов CO2, N2O и CH4
    const emissionsCO2 = fuelUsed * CO2_EMISSION_FACTOR;
    const emissionsN2O = fuelUsed * N2O_EMISSION_FACTOR;
    const emissionsCH4 = fuelUsed * CH4_EMISSION_FACTOR;

    // Перевод выбросов N2O и CH4 в углеродный эквивалент
    const emissionsN2O_CO2e = emissionsN2O * GWP_N2O;
    const emissionsCH4_CO2e = emissionsCH4 * GWP_CH4;

    // Общий углеродный эквивалент выбросов
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
    if (!distance || !fuelConsumption || !fuelType || fuelType !== 'Бензин') {
        return res.status(400).json({ error: 'Пожалуйста, предоставьте корректные данные (пробег, расход топлива, тип топлива).' });
    }

    // Расчет выбросов
    const results = calculateEmissions(distance, fuelConsumption, fuelType);
    
    // Отправка ответа с результатами
    res.json(results);
});

app.get('/calculate-emissions', (req, res) => {
    res.send('Этот маршрут поддерживает только POST-запросы.');
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://127.0.0.1:${PORT}`);
}
);