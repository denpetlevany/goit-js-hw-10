import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';
const inputEl = document.querySelector('input#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
inputEl.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));
function onInputSearch(evt) {
    const inputValue = evt.target.value.trim().toLowerCase();
    if (inputValue === '') {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        return;
    }
    fetchCountries(`${inputValue}?fields=name,capital,population,flags,languages`)
        .then(markup)
        .catch(() => {
            countryListEl.innerHTML = '';
            countryInfoEl.innerHTML = '';
            Notiflix.Notify.failure('Oops, there is no country with that name.');
        });
}
function markup(serverDataList) {
    if (serverDataList.length > 10) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = '';
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
    }
    if (serverDataList.length === 1) {
        countryInfoEl.innerHTML = countryInfo(serverDataList[0]);
        countryListEl.innerHTML = '';
        return;
    }
    countryInfoEl.innerHTML = '';
    countryListEl.innerHTML = countryList(serverDataList);
}
function countryInfo({ name, flags, capital, population, languages }) {
    return `<div style="display: flex;">
    <img src="${flags.svg}" alt="Flag of ${name.official}.">
    <h1 style="font-size: 20px;margin-left: 8px">${name.official}</h1>
    </div>
    <p><span>Capital:</span> ${capital}</p>
    <p><span>Population:</span> ${population}</p>
    <p><span>Languages:</span> ${Object.values(languages)}</p>`;
};
function countryList(serverDataList) {
    return serverDataList
        .map(({ flags, name }) => {
            return `<li style="display: flex;">
            <img src="${flags.svg}" alt="Flag of ${name.official}">
            <p style="margin-left: 8px;"><span>${name.official}</span></p>
            </li>`;
        })
        .join('');
};