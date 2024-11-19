import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatsPage = ({ token }) => {
    const [stats, setStats] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
                setError('');
            } catch (err) {
                setError('Ошибка при загрузке статистики.');
            }
        };
        fetchStats();
    }, [token]);

    return (
        <div>
            <h1>Статистика выбросов</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {stats.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Пробег (км)</th>
                            <th>Расход топлива (л/100км)</th>
                            <th>Тип топлива</th>
                            <th>Выбросы CO2e (кг)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map((stat) => (
                            <tr key={stat._id}>
                                <td>{new Date(stat.date).toLocaleDateString()}</td>
                                <td>{stat.distance}</td>
                                <td>{stat.fuelConsumption}</td>
                                <td>{stat.fuelType}</td>
                                <td>{stat.totalEmissionsCO2e.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Данных нет.</p>
            )}
        </div>
    );
};

export default StatsPage;
