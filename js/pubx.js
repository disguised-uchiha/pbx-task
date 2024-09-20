console.log('external')

window.onload = () => {
  console.log('pbjs', pbjs.getEvents())
  console.log('loaded here')

  pbjs.onEvent('auctionInit', function({auctionId, auctionStatus}) {
    const analyticsData = {
      eventType: "auctionInit",
      data: {
        auctionId,
        auctionStatus
      },
    };
    
    // ! NOTE: The CORS error I got was due to Beacon not supporting browser PREFLIGHT. 
    // ! and preflight is added if i setting Custom header. 
    // ! also with beaconAPI you can only sent text else the above issue happens
    const success = navigator.sendBeacon('http://localhost:3000/send-events?eventType=auctionInit', JSON.stringify(analyticsData));
    
    if (!success) {
      console.log('Beacon failed to send');
    }
  });


  const bidAnalyticsEvent = (event, eventType) => {
    const analyticsData = {
      eventType,
      data: event,
    };
    const success = navigator.sendBeacon(`http://localhost:3000/send-events?eventType=${eventType}`, JSON.stringify(analyticsData));
    
    if (!success) {
      console.log('Beacon failed to send');
    } 
  }

  pbjs.onEvent('bidRequested', function(e) {
    bidAnalyticsEvent(e, 'bidRequested');
  });

  pbjs.onEvent('bidResponse', function(e) {
    bidAnalyticsEvent(e, 'bidResponse');
  });
}