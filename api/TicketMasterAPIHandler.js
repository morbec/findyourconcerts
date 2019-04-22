const axios = require('axios');

// Handle the TicketMaster API requests

class TicketMaster {
  constructor(consumerKey) {
    this.BASE_URL = 'https://app.ticketmaster.com';
    this.DISCOVERY = '/discovery/v2';
    this.CONSUMER_KEY = consumerKey;
  }

  getEventsByCityName(cityName) {
    const queryURL = `${this.BASE_URL}${this.DISCOVERY}/events.json?apikey=${
      this.CONSUMER_KEY
    }&city=${cityName}`;

    return axios
      .get(queryURL)
      .then(response => {
        const { events } = response.data._embedded;
        events.forEach(event => {
          event.formattedDate = this.getFormattedDate(event.dates.start.localDate);
          event.venueName = this.getVenueName(event._embedded.venues[0].url);
        });
        return events;
      })
      .catch(err => console.error('ERROR: ', err));
  }

  getVenueName(urlStr) {
    let name = urlStr.split('/')[4].split('-');
    name.splice(-2);
    let capitalized = name.map(word => {
      return [...word].map((letter, i) => (i === 0 ? letter.toUpperCase() : letter.toLowerCase())).join(``);
    });
    return capitalized.join(` `);
  }

  getFormattedDate(date) {
    const tmpDate = new Date(date).toString().split(` `);
    const formattedDate = tmpDate.splice(1, 2);
    return [formattedDate[0].toUpperCase(), formattedDate[1]];
  }

  getVenueDetails(id) {
    const queryURL = `${this.BASE_URL}${this.DISCOVERY}/venues/${id}.json?apikey=${this.CONSUMER_KEY}`;
    return axios
      .get(queryURL)
      .then(venue => {
        return venue;
      })
      .catch(err => console.error('ERROR: ', err));
  }

  getEventDetails(id) {
    ///discovery/v2/events/{id}
    const queryURL = `${this.BASE_URL}${this.DISCOVERY}/events/${id}.json?apikey=${this.CONSUMER_KEY}`;
    return axios
      .get(queryURL)
      .then(response => {
        return response.data;
      })
      .catch(err => console.error('ERROR: ', err));
  }

  getVenues(cityname, radius) {
    // default unit for radius is miles
    // can't search by name. Idea:
    // need to get city name,
    // find out the lat/long and then (via opencagedata api)
    // get the geohash of the city using ngeohash npm package
    // finally query the TicketMaster
  }

  getAttractions() {
    const queryURL = `${this.BASE_URL}${this.DISCOVERY}/attractions.json?apikey=${this.CONSUMER_KEY}`;
    return axios
      .get(queryURL)
      .then(response => {
        return response.data._embedded.attractions;
      })
      .catch(err => console.error('ERROR: ', err));
  }
}

// test
// let tm = new TicketMaster('NoupClnMk40pzkXCMWUEYQ7oGIqXL89s');
// tm.getEventsByCityName('Berlin');
// tm.getAttractions();

module.exports = TicketMaster;
