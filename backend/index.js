require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.text());
app.use(express.json());

const port = process.env.PORT || 3000;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;

const mongoURI = `mongodb://${dbHost}:${dbPort}/${dbName}`; 
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const analyticsSchema = new mongoose.Schema({
  eventType: String,
  data: {
    type: Object,
    default:{}
  }
});

const AuctionInitModel = mongoose.model('auctionAnalytics', analyticsSchema);
const BidAnalyticsModel = mongoose.model('bidAnalytics', analyticsSchema);
const GeneralAnalyticsModel = mongoose.model('generalAnalytics', analyticsSchema);

app.post('/send-events', async (req, res) => {
  try {
    const eventData = JSON.parse(req.body);
    let newEvent;
    switch (req.query.eventType) {
      case "auctionInit":
        newEvent = new AuctionInitModel(eventData);
        break;
      case "bidRequested": 
      case "bidResponse":
        newEvent = new BidAnalyticsModel(eventData);
        break;
      default:
        newEvent = new GeneralAnalyticsModel(eventData);
    }
    await newEvent.save();
    res.status(200).json({ message: 'Event saved successfully!', event: eventData});
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ message: 'Error saving event', error });
  }
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
