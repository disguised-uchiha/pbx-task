console.log('external')

window.onload = () => {
  console.log('pbjs', pbjs.getEvents())
  console.log('loaded here')

  pbjs.onEvent('auctionInit', function(e) {
    console.log('auctionInit', e)
    const analyticsData = {
      type: "auctionInit",
      data: e
    }

    const headers = {
      type: 'application/json',
    };
    const blob = new Blob([JSON.stringify(analyticsData)], headers);
    navigator.sendBeacon('http://localhost:3000/send-events', blob);
  });

  pbjs.onEvent('bidRequested', function(e) {
    console.log('bidRequested', e)
  });

  pbjs.onEvent('bidResponse', function(e) {
    console.log('bidResponse', e)
  });
}