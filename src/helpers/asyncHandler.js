// handle error api middleware
const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}

const test = 'abc';

module.exports = asyncHandler
