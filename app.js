const countriesEl = document.getElementById('countries');
const filterBtn = document.getElementById('filter');
const regionFilters = filterBtn.querySelectorAll('li');
const searchEl = document.getElementById('search');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');

getCountries();

async function getCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const countries = await res.json();
  const covid = await fetch(`https://corona.lmao.ninja/v2/countries/`, {
    method: 'GET',
    redirect: 'follow',
  });
  const cd = await covid.json();
  const loading = document.querySelector('.loading');
  if (countries && cd) {
    displayCountries(countries, cd);
    loading.style.display = 'none';
    displayCovid(cd);
  }
}

function displayCountries(countries, cd) {
  countriesEl.innerHTML = '';

  countries.forEach((country) => {
    const countryEl = document.createElement('div');
    countryEl.classList.add('card');

    countryEl.innerHTML = `
            <div>
                <img src="${country.flag}" />
            </div>
            <div class="card-body">
                <h3 class="country-name">${country.name}</h3>
                <p>
                    <strong>Population:</strong>
                    ${country.population.toLocaleString('en-US')}
                </p>
                <p class="country-region">
                    <strong>Region:</strong>
                    ${country.region}
                </p>
                <p>
                    <strong>Capital:</strong>
                    ${country.capital}
                </p>
                <p class='covid'>
                </p>
            </div>
        `;

    countryEl.addEventListener('click', () => {
      modal.style.display = 'flex';
      showCountryDetails(country, cd);
    });

    countriesEl.appendChild(countryEl);
  });
}

function showCountryDetails(country, cd) {
  const detailBody = modal.querySelector('.detail-body');
  const detailImg = modal.querySelector('img');

  detailImg.src = country.flag;

  detailBody.innerHTML = `
        <h2 class='name'>${country.name}</h2>
        <div class='detail-left'>
        <p>
            <strong>Native Name:</strong>
            ${country.nativeName}
        </p>
        <p>
            <strong>Population:</strong>
            ${country.population.toLocaleString('en-US')}
        </p>
        <p>
            <strong>Region:</strong>
            ${country.region}
        </p>
        <p>
            <strong>Sub Region:</strong>
            ${country.subregion}
        </p>
        <p>
            <strong>Capital:</strong>
            ${country.capital}
        </p>
        </div>
        <div class='detail-right'>
        <p>
            <strong>Top Level Domain:</strong>
            ${country.topLevelDomain[0].slice(1).toUpperCase()}
        </p>
        <p>
            <strong>Currencies:</strong>
            ${country.currencies.map((currency) => currency.code)}
        </p>
        <p>
            <strong>Languages:</strong>
            ${country.languages.map((language) => {
              return ` ${language.name}`;
            })}
        </p>
        <p>
            <strong>Borders:</strong>
            ${country.borders.map((border) => {
              return `  ${border}`;
            })}
        </p>
        </div>
    `;
  covidDetail(country, cd);
}

// covid detail
function covidDetail(country, cd) {
  const covidWrap = document.querySelector('.covid-detail');
  cd.forEach((c) => {
    if (country.name === c.country) {
      covidWrap.innerHTML = `

  <h2>Covid Detail</h2>
  <div class='covid-left'>
    <p><strong>Cases: </strong>${c.cases.toLocaleString()}
    <p>

    <p><strong>Deaths: </strong>${c.deaths.toLocaleString()}
    <p>

    <p><strong>Recovered: </strong>${c.recovered.toLocaleString()}
    <p>
    <p><strong>Active: </strong>${c.active.toLocaleString()}
    <p>
    <p><strong>Critical: </strong>${c.critical.toLocaleString()}
    <p>

  </div>
  <div class='covid-right'>
    <p><strong>Today Cases: </strong>${c.todayCases.toLocaleString()}
    <p>
    <p><strong>Today Deaths: </strong>${c.todayDeaths.toLocaleString()}
    <p>
    <p><strong>Today Recovered: </strong>${c.todayRecovered.toLocaleString()}
    <p>
  </div>`;
    }
  });
}

//covid
function displayCovid(cd) {
  const covid = document.querySelectorAll('.covid');
  covid.forEach((c) => {
    cd.forEach((cd) => {
      if (cd.country === c.parentElement.firstElementChild.textContent) {
        c.innerHTML = `<strong>Covid Cases:</strong> ${cd.cases.toLocaleString(
          'en-US'
        )} 
        <p> <strong>Recovered: </strong> ${cd.recovered.toLocaleString(
          'en-US'
        )}</p>
        `;
      }
    });
  });
}

// toggle theme
// toggleBtn.addEventListener('change', () => {
//   document.body.classList.toggle('dark');
// });

const themeToggle = (val) => {
  document.body.classList = `${val}`;
};

// show and hide the filters
filterBtn.addEventListener('click', () => {
  filterBtn.classList.toggle('open');
});

// close the modal
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

searchEl.addEventListener('input', (e) => {
  const { value } = e.target;
  const countryName = document.querySelectorAll('.country-name');

  countryName.forEach((name) => {
    if (name.innerText.toLowerCase().includes(value.toLowerCase())) {
      name.parentElement.parentElement.style.display = 'block';
    } else {
      name.parentElement.parentElement.style.display = 'none';
    }
  });
});

// add a filter
regionFilters.forEach((filter) => {
  filter.addEventListener('click', () => {
    const value = filter.innerText;
    const countryRegion = document.querySelectorAll('.country-region');

    countryRegion.forEach((region) => {
      if (region.innerText.includes(value) || value === 'All') {
        region.parentElement.parentElement.style.display = 'block';
      } else {
        region.parentElement.parentElement.style.display = 'none';
      }
    });
  });
});
