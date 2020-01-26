<template>
  <div class="q-gutter-y-md">
    <div class="text-2b text-h6 gt-sm">Invoice details</div>
    <q-markup-table
      class="text-2b"
      :flat="$q.screen.lt.md"
      separator="cell"
      square
      wrap-cells
      v-if="invoice"
    >
      <tbody>
        <tr>
          <td>
            <div>Invoice #</div>
          </td>
          <td>
            <div>{{ invoice.number }}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div>Issue date</div>
          </td>
          <td>
            <div>
              {{ invoice.status_transitions.finalized_at | dateFormat }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div>Due date</div>
          </td>
          <td>
            <div class="text-negative">
              {{ invoice.due_date | dateFormat }}
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div>Message</div>
          </td>
          <td>
            <div>{{ invoice.description }}</div>
          </td>
        </tr>
        <tr>
          <td>
            <div>Status</div>
          </td>
          <td class="text-negative" v-if="isPastDue(invoice.due_date)">
            Past due
          </td>
          <td class="text-capitalize" v-else>{{ invoice.status }}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script>
import { isPastDue } from 'utils/date';

export default {
  name: 'InvoiceDetails',
  props: {
    invoice: {
      type: [Object, String],
      required: true,
    },
  },
  filters: {
    dateFormat(value) {
      const formattedDate = new Date(value);
      return formattedDate.toDateString();
    },
  },
  methods: {
    isPastDue,
  },
};
</script>

<style lang="sass">
.q-markup-table td:first-child
  background-color: $grey-3
  width: 33%
</style>
