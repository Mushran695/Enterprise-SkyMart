import config from '../config/index.js'

export function notFound(req, res, next) {
  res.status(404)
  res.json({ message: `Not Found - ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  const payload = {
    message: err.message || 'Internal Server Error'
  }
  if (config.env !== 'production') payload.stack = err.stack
  res.json(payload)
}
