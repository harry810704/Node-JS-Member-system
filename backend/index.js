const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const corsOptions = require('./config/corsOption');
const verifyJWT = require('./middleware/verify.JWT');
var cors = require('cors');

const app = express();
const port = 3000;

// routes(router);

app.use(credentials)

app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use('/register', require('./routes/register'));
app.use('/login', require('./routes/login'));
app.use('/logout', require('./routes/logout'));
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);
app.use('/user', require('./routes/users'));
app.use('/todo', require('./routes/todo'));

app.listen(port)
console.log(`Server is listening to port ${port}`);