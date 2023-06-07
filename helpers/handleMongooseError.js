const handleMongooseError = (error, data, next) => {
  const { name, code } = error;
  error.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  next();
};

export { handleMongooseError };
