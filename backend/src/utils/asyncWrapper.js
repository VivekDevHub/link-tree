function asyncWrapper(requestHandler) {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
}

export default asyncWrapper;
