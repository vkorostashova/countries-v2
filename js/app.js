const storage = () => {
  let countries = [];
  return {
    getCountries: () => countries,
    setCountries: newCountries => countries = newCountries
  }
}
const store = storage();


function renderCountries(countries) {
  let countriesElement = document.createElement('table');
  countriesElement.id = 'countries-table';
  countriesElement.className = 'table table-bordered table-striped countries-table';
  let htmlStr = countries.reduce((acc, country) => {
    return acc + `<tr>
        <td>${country.name}</td><td>${country.region}</td>
        <td>${country.population}</td><td>${country.area}</td>
        </tr>`;
  }, '');
  countriesElement.innerHTML = `<thead><tr>
     <th data-sort="name">Name</th>
     <th data-sort="region">Region</th>
     <th data-sort="population">Population</th>
     <th data-sort="area">Area</th></tr></thead>
     <tbody>${htmlStr}</tbody>`;
  document.querySelector('.container').append(countriesElement);

  document.querySelector('table thead').onclick = e =>{
    const countriesTable = document.querySelector('#countries-table')
    if(countriesTable){
      countriesTable.remove();
    }
    const numberFieldList = ['population', 'area'];
    let field = e.target.getAttribute('data-sort');
    const countriesBackup = store.getCountries();                                 
    countriesBackup.sort((countryA, countryB) =>{
      if(numberFieldList.includes(field)){
        return countryB[field] - countryA[field];
      }
      return countryA[field] > countryB[field] ? 1 : -1;
    })
    renderCountries(countriesBackup);
    
  document.querySelector(`table thead [data-sort="${field}"]`).classList.add('bg-primary');
  }
}

function getData(searchInput) {
  //case ALL
  let url = 'https://restcountries.com/v2/all';
  if(searchInput){
    url =`https://restcountries.com/v2/name/${searchInput}`;
  }
  fetch(url).then(res => res.json()).then(data => {
      const filteredData = data.map(el => {
        return {
          name: el.name,
          region: el.region,
          population: el.population,
          area: el.area
        }
      })
      store.setCountries(filteredData);
      renderCountries(filteredData)
    })
  }

 getData();

searchButton = document.getElementById('search-button');
searchButton.onclick = e => {
  document.querySelector('#countries-table').remove();
  const searchValue = document.getElementById('search').value;
  getData(searchValue);
}

clearButton = document.getElementById('clear-button');
clearButton.onclick = e => {
  document.getElementById('search').value = '';
  const countriesTable = document.querySelector('#countries-table')
  if(countriesTable){
    countriesTable.remove();
  }
  getData('')
}