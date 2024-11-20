const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect('mongodb+srv://<Admin>:<imeF_YDfy7i4cce>@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority=mongodb+srv://<Admin>:<imeF_YDfy7i4cce>@cluster0.ahjnu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Подключение к MongoDB успешно!');
})
.catch((error) => {
    console.error('Ошибка подключения к MongoDB:', error);
});

module.exports = mongoose;
