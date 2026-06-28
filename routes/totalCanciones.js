const express = require('express');
const router = express.Router();
const pool = require('../dataBase');

// Total de canciones
router.get('/api/cantidad-canciones', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT COUNT(*) AS total_canciones
            FROM canciones
        `);

        res.json({
            ok: true,
            total_canciones: result.rows[0].total_canciones
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error.message
        });
    }
    
});

module.exports = router;