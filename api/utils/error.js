export const errorHandler = (errStatus, message) =>{
    const error = new Error();
    error.statusCode = errStatus;
    error.message = message;

    return error;
}