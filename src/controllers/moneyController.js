const moneyModel = require('../models/moneyModel');
const { validationResult } = require('express-validator');

const tambahIncome = async(req, res) => {
  const { id_user, amount, tujuan } = req.body;
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const numericAmount = +amount;
    const hystory = await moneyModel.addIncome(id_user, numericAmount, tujuan);

    res.status(201).json({
      message: 'Berhasil menambahkan income',
      data: hystory
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan pada server', error: err.message });
  }
}

module.exports = 
{
  tambahIncome
}