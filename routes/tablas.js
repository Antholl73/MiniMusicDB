const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ mensaje: 'Lista de usuarios' });
});

router.get('/:id', (req, res) => {
    res.json({ usuario: req.params.id });
});

module.exports = router;
