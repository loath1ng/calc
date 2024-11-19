import React, { useState } from 'react';
import axios from 'axios';

const CalculatorForm = ({ token }) => {
    const [formData, setFormData] = useState({
        distance: '',
        fuelConsumption: '',
        fuelType: 'Бензин'
    });
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:5000/calculate-emissions', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResult(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Ошибка при расчете.');
        }
    };

    return (
        <div>
            <h1>Калькулятор выбросов</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Пробег (км):</label>
                    <input
                        type="number"
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Расход топлива (л/100км):</label>
                    <input
                        type="number"
                        name="fuelConsumption"
                        value={formData.fuelConsumption}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Тип топлива:</label>
                    <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                        <option value="Бензин">Бензин</option>
                        <option value="Дизель">Дизель</option>
                        <option value="Природный газ">Природный газ</option>
                    </select>
                </div>
                <button type="submit">Рассчитать</button>
            </form>
            {result && (
                <div>
                    <h2>Результаты:</h2>
                    <p>Выбросы CO2: {result.emissionsCO2.toFixed(2)} кг</p>
                    <p>Общие выбросы CO2e: {result.totalEmissionsCO2e.toFixed(2)} кг</p>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CalculatorForm;
