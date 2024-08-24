const jwt = require("jsonwebtoken");

// create token
const createJWT = ({ payload }) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
    return token;
};


// verify token
const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);



// store token in cookie & send it in response
const attachCookiesToResponse = ({ res, user }) => {
    const token = createJWT({ payload: user });

    // attach a cookie = httpOnly
    // res.cookie('name',token,{options})
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true

    });

    // this may be used in refresh & access token functionalities
    // res.status(StatusCodes.CREATED).json({ user: tokenUser });

};

module.exports = {
    createJWT, isTokenValid, attachCookiesToResponse
};