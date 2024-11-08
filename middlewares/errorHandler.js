// Not Found



const notFound = (req, res, next) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    req.status(404);
    next(error);

}


// Error Handler

const errorHandler = (error, req, res, next) => {
    const statuscode = req.statusCode ? req.statusCode : 500; // Default to 500 if not set
    res.status(statuscode);
    res.json({
        message: error.message,
        stack: error?.stack,
    });
}
module.exports ={errorHandler, notFound};