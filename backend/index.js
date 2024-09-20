const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.post('/send-events', (req, res)=> {
  console.log(req.body, req)
  const auctionId = 'asdf'
  res.json({message: `Success for auctionId: ${auctionId }`})
}) 

app.listen(3000,()=>{
 console.log("starting...");
});
