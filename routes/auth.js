const router = require('express').Router();
const User = require('../model/User');
const { signupUserValidation, loginValidation, updateValidation } = require('../model/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const querystring = require('querystring');
const axios = require('axios');
const res = require('express/lib/response');

router.post('/signup', async (req, res) => {
    // res.send("signup route");
    // res.send(req.body);

    // validating the user
    const { error, value } = signupUserValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    };

    // checking if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send("Email already Exist");

    // hash password
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt)

    let fullName = `${req.body.firstName} ${req.body.lastName}`

    // creating and saving the user
    let user = new User({
        name: fullName,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        let savedUser = await user.save();
        let response = {
            message: "User Created",
            user: savedUser
        }
        res.status(200).send(JSON.stringify(response));
    } catch (err) {
        res.status(400).send(err);
    }
});

// simple login
router.post('/login', async (req, res) => {


    // validating the user
    const { error, value } = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    //  checking if the user exists or not
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Email does not exist");


    // checking if the password is correct or not
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid Password");

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '24h' });
    let responseUser = {
        "_id": user._id,
        "name": user.name,
        "email": user.email
    };
    response = {
        token: token,
        user: responseUser
    }
    res.header('auth-token', token).send(response);

});


// login with google ---------------------------
const redirectURI = "auth/google";
function getGoogleAuthURL() {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
        client_id: process.env.GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };

    return `${rootUrl}?${querystring.stringify(options)}`;
}

// Getting login URL
router.get("/auth/google/url", (req, res) => {
    return res.send(getGoogleAuthURL());
});

function getTokens({
    code,
    clientId,
    clientSecret,
    redirectUri,
}) {
    /*
     * Uses the code to get tokens
     * that can be used to fetch the user's profile
     */
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    };

    return axios
        .post(url, querystring.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch auth tokens`);
            res.send(error.message);
        });
}


// Getting the user from Google with the code
router.get(`/${redirectURI}`, async (req, res) => {
    const code = req.query.code;

    const { id_token, access_token } = await getTokens({
        code,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: `${process.env.SERVER_ROOT_URI}/${redirectURI}`,
    });

    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios
        .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
            {
                headers: {
                    Authorization: `${id_token}`,
                },
            }
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error(`Failed to fetch user`);
            // throw new Error(error.message);
            return res.send(error.message);
        });

    const token = jwt.sign(googleUser, process.env.TOKEN_SECRET);

    res.cookie(process.env.COOKIE_NAME, token, {
        maxAge: 900000,
        httpOnly: true,
        secure: false,
    });

    res.redirect(process.env.UI_ROOT_URI);
});

module.exports = router;