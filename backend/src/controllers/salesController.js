const salesService = require('../services/salesService');
const { validateQueryParams } = require('../utils/validators');

exports.getSales = async (req, res, next) => {
  try {
    // Validate query params
    const validated = validateQueryParams(req.query);
    if (validated.error) {
      return res.status(400).json({ error: validated.error });
    }

    const params = validated.value;

    const result = await salesService.querySales(params);

    res.json(result);
  } catch (err) {
    next(err);
  }
};
