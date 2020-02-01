<template>
  <q-page
    :class="[{ 'bread-crumb-padding': $q.screen.gt.sm }, 'container']"
    :padding="!$q.platform.is.mobile"
  >
    <q-card>
      <q-card-section>
        <div class="q-gutter-y-md">
          <div class="text-h6 text-2b">Analytics</div>
          <div class="q-gutter-x-sm">
            <q-btn-toggle
              class="shadow-1"
              dense
              @input="fetchGrossVolume(startTime)"
              no-caps
              :options="filterOptions"
              text-color="grey"
              toggle-color="white"
              toggle-text-color="cyan"
              v-model="filter"
            />
            <q-btn-toggle
              class="shadow-1"
              dense
              @input="fetchGrossVolume(startTime)"
              no-caps
              :options="unitOptions"
              text-color="grey"
              toggle-color="white"
              toggle-text-color="cyan"
              v-model="unitControl"
            />
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <highcharts :options="chartOptions" />
      </q-card-section>
    </q-card>

    <!-- Breadcrumbs -->
    <bread-crumbs :breadcrumbs="breadcrumbs" />
  </q-page>
</template>

<script>
import BreadCrumbs from 'components/BreadCrumbs.vue';
import Highcharts from 'highcharts';
import { Chart } from 'highcharts-vue';
import qs from 'qs';
import { axiosError, notifyError } from 'utils/error-handler';
import {
  differenceInHours,
  differenceInCalendarDays,
  differenceInCalendarWeeks,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachYearOfInterval,
  getTime,
  getUnixTime,
  isSameHour,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear,
  startOfDay,
  startOfToday,
  startOfTomorrow,
  startOfWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subWeeks,
  subYears,
} from 'date-fns';

Highcharts.setOptions({
  lang: {
    thousandsSep: ',',
  },
});

export default {
  name: 'Dashboard',
  data() {
    return {
      breadcrumbs: [
        {
          label: 'Home',
          link: '/',
        },
        {
          label: 'Dashboard',
          link: '',
        },
      ],
      chartOptions: {
        chart: {
          type: 'line',
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            color: '#00bcd4',
            name: 'Gross volume',
            data: [],
            pointStart: undefined,
            pointInterval: 1,
            pointIntervalUnit: 'month',
          },
        ],
        time: {
          useUTC: true,
          timezoneOffset: 0,
        },
        title: {
          text: 'Gross volume',
        },
        tooltip: {
          valueDecimals: 2,
          valuePrefix: '$',
          dateTimeLabelFormats: {
            hour: '%A, %b %e, %l:%M %p',
          },
        },
        xAxis: {
          startOfWeek: 0,
          type: 'datetime',
          dateTimeLabelFormats: {
            hour: '%l:%M %p',
          },
        },
        yAxis: {
          labels: {
            formatter() {
              return `$${Highcharts.numberFormat(this.value, 2, '.', ',')}`;
            },
          },
          title: {
            text: 'Amount (USD)',
          },
        },
      },
      filterOptions: [
        {
          label: '1w', // 1 week
          unit: [
            {
              label: 'Hourly',
              pointInterval: 60 * 60 * 1000,
              pointIntervalUnit: undefined,
              timestamp: getUnixTime(subWeeks(startOfToday(), 1)), // => Get unix time of 1 week ago
              value: 'hour',
            },
            {
              label: 'Daily',
              pointInterval: 1,
              pointIntervalUnit: 'day',
              timestamp: getUnixTime(subWeeks(startOfToday(), 1)), // => Get unix time of 1 week ago
              value: 'day',
            },
          ],
          value: '1w',
        },
        {
          label: '4w', // 4 weeks
          unit: [
            {
              label: 'Daily',
              pointInterval: 1,
              pointIntervalUnit: 'day',
              timestamp: getUnixTime(subWeeks(startOfToday(), 4)), // => Get unix time of 4 weeks ago
              value: 'day',
            },
            {
              label: 'Weekly',
              pointInterval: 24 * 3600 * 1000 * 7,
              pointIntervalUnit: undefined,
              timestamp: getUnixTime(startOfWeek(subWeeks(startOfToday(), 4))), // => Get unix time of 4 weeks ago starting on Sunday
              value: 'week',
            },
          ],
          value: '4w',
        },
        {
          label: '1y', // 1 year
          unit: [
            {
              label: 'Weekly',
              pointInterval: 24 * 3600 * 1000 * 7,
              pointIntervalUnit: undefined,
              timestamp: getUnixTime(startOfWeek(subYears(startOfToday(), 1))), // => Get unix time of 1 year ago
              value: 'week',
            },
            {
              label: 'Monthly',
              pointInterval: 1,
              pointIntervalUnit: 'month',
              timestamp: getUnixTime(startOfMonth(subYears(startOfToday(), 1))), // => Get unix time of 1 year ago starting on 1st of the month
              value: 'month',
            },
          ],
          value: '1y',
        },
        {
          label: 'Mtd', // Month to date
          unit: [
            {
              label: 'Daily',
              pointInterval: 1,
              pointIntervalUnit: 'day',
              timestamp: getUnixTime(startOfMonth(startOfToday())), // => Get unix time of the start of month for today
              value: 'day',
            },
          ],
          value: 'Mtd',
        },
        {
          label: 'Qtd', // Quarter to date
          unit: [
            {
              label: 'Daily',
              pointInterval: 1,
              pointIntervalUnit: 'day',
              timestamp: getUnixTime(startOfQuarter(startOfToday())), // => Get unix time of the start of quarter
              value: 'day',
            },
          ],
          value: 'Qtd',
        },
        {
          label: 'Ytd', // Year to date
          unit: [
            {
              label: 'Monthly',
              pointInterval: 1,
              pointIntervalUnit: 'month',
              timestamp: getUnixTime(startOfYear(startOfToday())), // => Get unix time of the start of the year
              value: 'month',
            },
          ],
          value: 'Ytd',
        },
        {
          label: 'All',
          unit: [
            {
              label: 'Monthly',
              pointInterval: 1,
              pointIntervalUnit: 'month',
              timestamp: null,
              value: 'month',
            },
          ],
          value: null,
        },
      ],
      startTime: null,
      trend: null,
      unitDifference: null,
      unit: 'month',
    };
  },
  components: {
    breadCrumbs: BreadCrumbs,
    highcharts: Chart,
  },
  computed: {
    filter: {
      get() {
        return this.trend;
      },
      set(value) {
        this.trend = value;
        this.unit = this.unitOptions[0].value;
        this.startTime = this.unitOptions[0].timestamp;
        this.chartOptions.series[0].pointStart = this.startTime * 1000;
        this.chartOptions.series[0].pointInterval = this.unitOptions[0].pointInterval;
        this.chartOptions.series[0].pointIntervalUnit = this.unitOptions[0].pointIntervalUnit;
      },
    },
    unitControl: {
      get() {
        return this.unit;
      },
      set(value) {
        this.unit = value;
        this.startTime = this.unitOptions.find(
          unit => this.unit === unit.value
        ).timestamp;
        this.chartOptions.series[0].pointStart = this.startTime * 1000;
        this.chartOptions.series[0].pointInterval = this.unitOptions.find(
          unit => this.unit === unit.value
        ).pointInterval;
        this.chartOptions.series[0].pointIntervalUnit = this.unitOptions.find(
          unit => this.unit === unit.value
        ).pointIntervalUnit;
      },
    },
    unitOptions() {
      return this.filterOptions.find(trend => this.trend === trend.value).unit;
    },
  },
  methods: {
    differenceInDate(earlierDate, laterDate, unit) {
      let difference;

      switch (unit) {
        case 'hour':
          difference = differenceInHours(laterDate, earlierDate);
          break;
        case 'day':
          difference = differenceInCalendarDays(laterDate, earlierDate);
          break;
        case 'week':
          difference = differenceInCalendarWeeks(laterDate, earlierDate);
          break;
        case 'month':
          difference = differenceInCalendarMonths(laterDate, earlierDate);
          break;
        case 'year':
          difference = differenceInCalendarYears(laterDate, earlierDate);
          break;
        default:
          difference = null;
      }

      return difference;
    },
    async fetchGrossVolume(startTime) {
      try {
        const { data, status } = await this.$axios.get('/chart/gross_volume', {
          params: { start_time: startTime },
          paramsSerializer: query => qs.stringify(query, { skipNulls: true }),
        });

        if (status === 200) {
          let grossVolume = [];
          const { transactions } = data;

          transactions.reverse();

          this.setPointStart(transactions);
          this.setTimezoneOffset();

          if (transactions.length === 0) {
            const interval = this.interval(
              new Date(this.startTime * 1000),
              startOfToday(),
              this.unit
            );

            grossVolume = grossVolume.concat(Array(interval).fill(0));
          }

          transactions.forEach((txn, i, arr) => {
            const txnCreatedDate = new Date(txn.created * 1000); // transaction created date

            // Prepend data set with 0
            if (this.startTime && i === 0) {
              this.unitDifference = this.differenceInDate(
                new Date(this.startTime * 1000),
                txnCreatedDate,
                this.unit
              );

              if (this.unitDifference > 1) {
                grossVolume = grossVolume.concat(
                  Array(this.unitDifference - 1).fill(0)
                );
              }
            }

            if (i > 0) {
              const prevTxnCreatedDate = new Date(arr[i - 1].created * 1000); // previous transaction created date

              this.unitDifference = this.differenceInDate(
                prevTxnCreatedDate,
                txnCreatedDate,
                this.unit
              );

              // Fill data set with 0 in between dates
              if (this.unitDifference > 1) {
                grossVolume = grossVolume.concat(
                  Array(this.unitDifference - 1).fill(0)
                );
              }

              // Calculate gross volume
              if (
                this.isSameDate(txnCreatedDate, prevTxnCreatedDate, this.unit)
              ) {
                grossVolume[grossVolume.length - 1] += txn.amount / 100;
                return;
              }
            }

            grossVolume.push(txn.amount / 100);
          });

          // Append data set with 0
          if (transactions.length > 0) {
            const difference = this.differenceInDate(
              new Date(transactions[transactions.length - 1].created * 1000),
              startOfToday(),
              this.unit
            );

            if (difference) {
              grossVolume = grossVolume.concat(Array(difference).fill(0));
            }
          }

          this.chartOptions.series[0].data = grossVolume;
        }
      } catch (error) {
        notifyError(axiosError(error));
      }
    },
    interval(startDate, endDate, unit) {
      let interval;

      switch (unit) {
        case 'hour':
          interval = differenceInHours(startOfTomorrow(), startDate) + 1;
          break;
        case 'day':
          interval = eachDayOfInterval({ start: startDate, end: endDate })
            .length;
          break;
        case 'week':
          interval = eachWeekOfInterval({ start: startDate, end: endDate })
            .length;
          break;
        case 'month':
          interval = eachMonthOfInterval({ start: startDate, end: endDate })
            .length;
          break;
        case 'year':
          interval = eachYearOfInterval({ start: startDate, end: endDate })
            .length;
          break;
        default:
          interval = null;
      }

      return interval;
    },
    isSameDate(firstDate, secondDate, unit) {
      let result;

      switch (unit) {
        case 'hour':
          result = isSameHour(firstDate, secondDate);
          break;
        case 'day':
          result = isSameDay(firstDate, secondDate);
          break;
        case 'week':
          result = isSameWeek(firstDate, secondDate);
          break;
        case 'month':
          result = isSameMonth(firstDate, secondDate);
          break;
        case 'year':
          result = isSameYear(firstDate, secondDate);
          break;
        default:
          result = null;
      }

      return result;
    },
    setPointStart(transactions) {
      if (this.startTime) {
        this.chartOptions.series[0].pointStart = this.startTime * 1000;
        return;
      }
      this.chartOptions.series[0].pointStart = getTime(
        startOfDay(startOfMonth(new Date(transactions[0].created * 1000)))
      );
    },
    setTimezoneOffset() {
      const offset = new Date(this.chartOptions.series[0].pointStart);

      this.chartOptions.time.timezoneOffset = offset.getTimezoneOffset();
    },
  },
  created() {
    this.fetchGrossVolume(this.startTime);
  },
};
</script>

<style lang="stylus" scoped>
.container
  max-width 1600px
  margin-left auto
  margin-right auto
</style>
