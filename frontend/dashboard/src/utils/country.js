import countries from 'assets/country_list.json';
import { getCountryCallingCode } from 'libphonenumber-js';
import twemoji from 'twemoji';
import { getEmojiFlag } from 'countries-list';

// Get array of countries with no calling code
export const noCountryCallingCode = ['AQ', 'BV', 'TF', 'HM', 'PN', 'GS', 'UM'];

// Get array of objects of countries with country code
export const getCountries = () => {
  return countries.map(country => {
    return {
      label: country.Name,
      value: country.Code,
    };
  });
};

// Get array of objects of countries with country code and calling code
export const getCountriesAndCallingCodes = () => {
  return countries.map(country => {
    if (noCountryCallingCode.includes(country.Code)) {
      return {
        label: country.Name,
        value: country.Code,
      };
    }
    return {
      label: country.Name,
      value: country.Code,
      callingCode: `+${getCountryCallingCode(country.Code)}`,
    };
  });
};

// Get Twemoji flag svg image
export const getTwemojiFlag = country => {
  return `${twemoji.base}svg/${twemoji.convert.toCodePoint(
    getEmojiFlag(country)
  )}.svg`;
};
