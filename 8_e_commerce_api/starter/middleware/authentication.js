const CustomError = require("../errors");
const { isTokenValid } = require("../utils");



// for checking whether token is available or not 
// entries are correct are not between user & server for all user routes
const authenticateUser = async (req, res, next) => {
    // given name as token previously & signed with jwt
    const token = req.signedCookies.token;

    if (!token) {
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }


    try {
        // const payload = isTokenValid({ token });
        const { name, userId, role } = isTokenValid({ token });
        // console.log(payload);
        req.user = { name, userId, role };
        next();
    } catch (error) {
        throw new CustomError.UnauthenticatedError('Authentication Invalid'); //401
    }

};


// only admin gonna see all users now.
// const authorizePermissions = (req, res, next) => {
//     if (req.user.role != 'admin') {
//         throw new CustomError.UnauthorizedError('Unauthorized to access this route');
//     }
//     next();
// };


// *** refactored - see routes/userRoutes - where this function requiring parameters = ONLY "admin" is passed.
// because, eventually as our app grows - we will be having many roles ex. admin,owner,user etc.
// to grab their roles in routes only is a better option.So that only respected routes will be given and accessible for respective role members
// reusability!!!
const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnauthorizedError('Unauthorized to access this route ');
        }
        next();
    };
};

module.exports = { authenticateUser, authorizePermissions };

// SUMMARY - if not logged in or registered
// if (!token) {
//     console.log('error,no token present,cannot let you in');
// } else {

//     console.log('token present, you can come in');
// }