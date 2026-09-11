const AppError = require('../utils/AppError');

/**
 * Middleware factory for Zod schema validation
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const messages = result.error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('. ');
      return next(new AppError(messages, 400));
    }
    req[source] = result.data;
    next();
  };
};

module.exports = validate;
