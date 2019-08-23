const express = require('express');

const app = express();

app.use('/', (req, res) => {
    res.send('Funciona');
})

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});