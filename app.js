const countriesEl = document.getElementById('countries');
const filterBtn = document.getElementById('filter');
const regionFilters = filterBtn.querySelectorAll('li');
const searchEl = document.getElementById('search');
const modal = document.getElementById('modal');
const closeBtn = document.getElementById('close');

getCountries();

searchEl.value = '';

async function getCountries() {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const countries = await res.json();
  const covid = await fetch(`https://disease.sh/v3/covid-19/countries`, {
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
                <img src="${country.flags.svg}" />
            </div>
            <div class="card-body">
                <h3 class="country-name">${country.name.common}</h3>
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
                <p class='more'>
                  More Info
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

  detailImg.src = country.flags.svg;
  detailBody.innerHTML = `
        <h2 class='name'>${country.name.common}</h2>
        <div class='detail-left'>
        <p>
            <strong>Native Name:</strong>
            ${Object.keys(country.name.nativeName).map((n) => {
              return `  ${country.name.nativeName[n].official}`;
            })}
        </p>
        <p>
            <strong>Population:</strong>
            ${country.population.toLocaleString('en-US')}
        </p>
        <p>
            <strong>Region:</strong>
            ${country.region}
        </p>
        
        ${
          country.subregion
            ? `<p>
            <strong>Sub Region:</strong>
            ${country.subregion}
        </p>`
            : ''
        }
        <p>
            <strong>Capital:</strong>
            ${country.capital}
        </p>
        <p>
            <strong>Independent:</strong>
            ${country.independent}
        </p>
        </div>


        <div class='detail-right'>
        <p>
            <strong>Top Level Domain:</strong>
            ${country.tld[0]}
        </p>
        <p>
            <strong>Currencies:</strong>
             ${Object.keys(country.currencies).map((c) => {
               return `${country.currencies[c].name}(${country.currencies[c].symbol})`;
             })}
        </p>
        <p>
            <strong>Languages:</strong>
            ${Object.keys(country.languages).map((l) => {
              return `  ${country.languages[l]}`;
            })}
        </p>
            ${
              country.borders
                ? `<p>
                    <strong>Borders:</strong>
                    ${country.borders.map((border) => {
                      return `  ${border}`;
                    })}</p>`
                : ''
            }
      
        <p>
            <strong>Area:</strong>
            ${country.area.toLocaleString('en-US')} km2
        </p>
         <a class='more' href="https://en.wikipedia.org/wiki/${
           country.name.common
         }" target="_blank" rel="noopener noreferrer">Wikipedia</a>
        </div>
    `;
  covidDetail(country, cd);
}

// covid detail
function covidDetail(country, cd) {
  const covidWrap = document.querySelector('.covid-detail');
  covidWrap.innerHTML = '';
  cd.forEach((c) => {
    if (country.cca3 === c.countryInfo.iso3) {
      console.log(country.cca3);
      covidWrap.innerHTML = `
  <h2>Covid Detail</h2>
  <div class='covid-left'>
    <p><strong>Cases: </strong>${c.cases.toLocaleString()}
    </p>

    <p><strong>Deaths: </strong>${c.deaths.toLocaleString()}
    </p>

    <p><strong>Recovered: </strong>${c.recovered.toLocaleString()}
    </p>
    <p><strong>Active: </strong>${c.active.toLocaleString()}
    </p>
    <p><strong>Critical: </strong>${c.critical.toLocaleString()}
    </p>
    <p><strong>Tests: </strong>${c.tests.toLocaleString()}
    </p>
    <p><strong>Cases Per One Million: </strong>${c.casesPerOneMillion.toLocaleString()}
    </p>
    <p><strong>Deaths Per One Million: </strong>${c.deathsPerOneMillion.toLocaleString()}
    </p>
    <p><strong>Tests Per One Million: </strong>${c.testsPerOneMillion.toLocaleString()}
    </p>

  </div>
  <div class='covid-right'>
    <p><strong>Today Cases: </strong>${c.todayCases.toLocaleString()}
    </p>
    <p><strong>Today Deaths: </strong>${c.todayDeaths.toLocaleString()}
    </p>
    <p><strong>Today Recovered: </strong>${c.todayRecovered.toLocaleString()}
    </p>
    <p><strong>Active Per One Million: </strong>${c.activePerOneMillion.toLocaleString()}
    </p>
    <p><strong>Recovered Per One Million: </strong>${c.recoveredPerOneMillion.toLocaleString()}
    </p>
    <p><strong>Critical Per One Million: </strong>${c.criticalPerOneMillion.toLocaleString()}
    </p>
    <a class='more' href="http://google.com/search?q=${
      c.country
    }+covid+statistics" target="_blank" rel="noopener noreferrer">More Data</a>
  </div>
  <p><strong>Last Updated:</strong> ${Date(c.Date)}</p>
  `;
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
          'en-US',
        )} 
        <p> <strong>Recovered: </strong> ${cd.recovered.toLocaleString(
          'en-US',
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
