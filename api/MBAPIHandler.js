const axios = require('axios');

// Handle calls to the MusicBrainz API

/**
 * @class MBAPIHandle - Handles the MusicBrainz API requests
 */
class MBAPIHandle {
    /**
     * @constructor - Creates a MBAPIHandle object
     * @param {String} baseURL - The base ULR for MusicBrainz API
     */
    constructor(baseURL) {
        this.BASE_URL = baseURL;
    }

    /**
     * @function
     * @param {String} artistName - The name of the artist
     * @returns Promise
     */
    getArtistInfoByName(artistName) {
        const artist = replaceCharacters(artistName);
        return axios
            .get(`${this.BASE_URL}artist/?query=artist:${artist}&fmt=json`)
            .then(response => {
                return response.data;
            })
            .catch(err => console.error('ERROR: ', err));
    }

    getArtistInfoById(artistId) {
        return axios
            .get(`https://musicbrainz.org/ws/2/artist/${artistId}?fmt=json`)
            .then(response => {
                return response.data;
            })
            .catch(err => console.error('ERROR: ', err));
    }
}

/**
 * Replace the characters ' ', /, ? , * and " by its ASCII code
 * @param {String} str Artist name
 * @returns A new String
 */
const replaceCharacters = str => {
    const characters = [
        {
            symbol: ' ',
            regex: /\s/g,
            code: `%20`
        },
        {
            symbol: '/',
            regex: /\//g,
            code: `%252F`
        },
        {
            symbol: '?',
            regex: /\?/g,
            code: '%253F'
        },
        {
            symbol: '*',
            regex: /\*/g,
            code: '%252A'
        },
        {
            symbol: '"',
            regex: `"`,
            code: '%27C'
        }
    ];

    // Preserve the input string
    let artist = str;

    characters.forEach(char => {
        if (artist.includes(char.symbol)) artist = artist.replace(char.regex, char.code);
    });

    return artist;
};

module.exports = MBAPIHandle;
