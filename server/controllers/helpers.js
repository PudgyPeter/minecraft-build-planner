export function endpoint(action) {
  return async (req, res, next) => {
    try {
      await action(req, res);
    } catch (error) {
      next(error);
    }
  };
}

export function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

export function requiredText(value, label) {
  if (typeof value !== 'string' || !value.trim()) fail(400, `${label} is required`);
  return value.trim();
}

export function positiveQuantity(value) {
  const quantity = typeof value === 'string' && value.trim() ? Number(value) : value;
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 2147483647) {
    fail(400, 'Quantity must be a positive integer');
  }
  return quantity;
}

export function optionalText(value, label) {
  if (value == null || value === '') return null;
  if (typeof value !== 'string') fail(400, `${label} must be text`);
  return value;
}
