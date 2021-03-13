const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req, res, next) => {
    res.send('Hello World');
});

app.listen(3000, () => {
    console.log('Server started at http://localhost:3000');
});