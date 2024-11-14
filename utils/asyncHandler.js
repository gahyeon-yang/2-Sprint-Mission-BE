function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      if (!(e instanceof ValidationError) && !(e instanceof NotFoundError)) {
        // 400 404 아닌 경우 500으로 취급
        e = new InternalServerError(e.message);
      }
      next(e);
    }
  };
}
