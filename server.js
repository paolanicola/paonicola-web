const express = require('express'); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
//
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get('/express_backend', (req, res) => {
  //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11

//
const PaymentController = require('./Controllers/PaymentController');
const PaymentService = require('./Services/PaymentService');

const PaymentInstance = new PaymentController(new PaymentService());
app.get('/', function (req, res, next) {
  return res.json({
    '/payment': 'generates a payment link',
    '/subscription': 'generates a subscription link',
  });
});

// ADD THIS
var cors = require('cors');
app.use(cors());
app.use(cors({ origin: true, credentials: true }));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); //aca chekar
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

app.get('/payment', function (req, res, next) {
  PaymentInstance.getPaymentLink(req, res);
});

app.post('/payment', function (req, res, next) {
  const { firstName, persona, cart } = req.body;
  console.log(cart);
  PaymentInstance.getPaymentLink(req, res);
});

app.get('/subscription', function (req, res, next) {
  PaymentInstance.getSubscriptionLink(req, res);
});
