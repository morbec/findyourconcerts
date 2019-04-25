document.addEventListener(
    'DOMContentLoaded',
    () => {
        console.log('IronGenerator JS imported successfully!');
    },
    false
);

const citySelected = () => {
    const city = document.getElementById('city-selection').value;
    const locations = document.querySelectorAll('.event-container-location');
    locations.forEach(location => {
        location.parentElement.style.display = 'flex';
        if (!location.innerText.includes(city)) {
            location.parentElement.style.display = 'none';
        }
    });
};

if (document.querySelector('#follow')) {
  document.querySelector('#follow').addEventListener('click', () => {
    const artistName = document.querySelector('#artist').innerHTML;
    axios.post('http://localhost:3000/events/artist/api', { artistName }).then(() => console.log('followed'));
  });
}
