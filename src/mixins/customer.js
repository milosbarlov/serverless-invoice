import { createNamespacedHelpers } from 'vuex';
import twemoji from 'twemoji';
import { getEmojiFlag } from 'countries-list';
import countries from 'assets/country_list.json';
import { getCountryCallingCode } from 'libphonenumber-js';

const { mapGetters, mapMutations } = createNamespacedHelpers('customers');

export default {
  data() {
    return {
      stringOptions: [],
    };
  },
  computed: {
    ...mapGetters(['getFilter', 'getServerPagination']),
    pagination: {
      get() {
        return this.getServerPagination;
      },
      set(value) {
        this.updateServerPagination(value);
      },
    },
    filter: {
      get() {
        return this.getFilter;
      },
      set(value) {
        this.updateFilter(value);
      },
    },
  },
  methods: {
    ...mapMutations(['updateServerPagination', 'updateFilter']),
    getCountries() {
      const options = countries.map(country => {
        return {
          label: country.Name,
          value: country.Code,
        };
      });

      this.stringOptions = options;
    },
    getCountriesAndCallingCodes() {
      const options = countries.map(country => {
        if (this.omitCountries.includes(country.Code)) {
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

      this.stringOptions = options;
    },
    filterCountry(val, update) {
      if (val === '') {
        update(() => {
          this.options = this.stringOptions;
        });
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.options = this.stringOptions.filter(
          v => v.label.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    flag(country) {
      return twemoji.parse(`${getEmojiFlag(country)}`);
    },
  },
};
