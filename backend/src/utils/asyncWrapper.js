// Wrapping async route handlers to catch errors
function asyncWrapper(requestHandler) {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
}

// Exporting async wrapper
export default asyncWrapper;