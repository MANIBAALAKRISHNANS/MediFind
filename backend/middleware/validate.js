import Joi from 'joi'

/**
 * Returns an Express middleware that validates req.body against the given Joi schema.
 * On failure responds 400 with all validation messages joined; on success calls next().
 * Replaces the repeated inline validation block that appeared in every auth route.
 */
export function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        error: error.details.map((d) => d.message).join(' '),
        code:  'INVALID_INPUT',
      })
    }
    req.body = value   // replace with coerced/stripped values from Joi
    next()
  }
}
