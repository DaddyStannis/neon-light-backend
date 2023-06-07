function controlWrapper(ctrl) {
  return async function (req, res, next) {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

export default controlWrapper;
