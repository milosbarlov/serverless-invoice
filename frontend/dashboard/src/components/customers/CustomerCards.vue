<template>
  <div>
    <q-card class="text-2b" v-if="!$store.state.layout.fullscreen">
      <q-card-section class="row justify-between items-center no-wrap">
        <div class="text-h6 text-weight-regular">Cards</div>
        <q-btn
          color="cyan"
          :flat="$q.screen.lt.md"
          :round="$q.screen.lt.md"
          size="sm"
          :to="`${$route.path}/add-card`"
        >
          <q-icon :left="$q.screen.gt.sm" name="add" />
          <div class="gt-sm">add card</div>
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="cardData.length > 0" class="q-pa-none">
        <q-list>
          <q-expansion-item
            v-for="(card, index) in cardData"
            :key="card.id"
            switch-toggle-side
          >
            <template #header>
              <q-item-section avatar>
                <q-icon
                  v-if="card.brand === 'American Express'"
                  name="fab fa-cc-amex"
                />
                <q-icon
                  v-else-if="card.brand === 'Diners Club'"
                  name="fab fa-cc-diners-club"
                />
                <q-icon
                  v-else-if="card.brand === 'Discover'"
                  name="fab fa-cc-discover"
                />
                <q-icon v-else-if="card.brand === 'JCB'" name="fab fa-cc-jcb" />
                <q-icon
                  v-else-if="card.brand === 'MasterCard'"
                  name="fab fa-cc-mastercard"
                />
                <q-icon
                  v-else-if="card.brand === 'Visa'"
                  name="fab fa-cc-visa"
                />
                <q-icon v-else name="fas fa-credit-card" />
              </q-item-section>
              <q-item-section class="q-ml-md">
                <div class="row q-col-gutter-x-md">
                  <div>•••• {{ card.last4 }}</div>
                  <div class="text-69">
                    {{ card.exp_month | padZero }} / {{ card.exp_year }}
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>
                <q-btn-group class="gt-sm" flat>
                  <q-btn
                    flat
                    size="sm"
                    color="negative"
                    @click.stop="deleteCard(card.id)"
                  >
                    <q-icon :left="$q.screen.gt.sm" name="delete" />
                    <div class="gt-sm">delete</div>
                  </q-btn>
                  <q-btn
                    flat
                    size="sm"
                    color="2b"
                    @click.stop="editCard(card)"
                    :to="`${$route.path}/edit-card`"
                  >
                    <q-icon
                      color="primary"
                      :left="$q.screen.gt.sm"
                      name="edit"
                    />
                    <div class="gt-sm text-primary">edit</div>
                  </q-btn>
                </q-btn-group>
                <q-btn
                  round
                  flat
                  class="lt-md"
                  size="sm"
                  icon="fas fa-ellipsis-v"
                  @click.stop="selectedCardIndex = index"
                >
                  <q-menu
                    v-show="isShown(index)"
                    fit
                    anchor="bottom left"
                    self="top left"
                  >
                    <q-list class="scroll">
                      <q-item
                        clickable
                        @click="deleteCard(card.id)"
                        v-close-popup
                      >
                        <q-item-section avatar>
                          <q-icon color="negative" name="delete" />
                        </q-item-section>
                        <q-item-section class="text-negative">
                          <div class="text-negative">
                            Delete
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        @click="editCard(card)"
                        :to="`${$route.params.id}/edit-card`"
                        v-close-popup
                      >
                        <q-item-section avatar>
                          <q-icon color="2b" name="edit" />
                        </q-item-section>
                        <q-item-section>
                          <div class="text-2b">
                            Edit
                          </div>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="q-pa-sm">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        ID
                      </q-item-label>
                      <q-item-label caption>
                        {{ card.id }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Name</q-item-label>
                      <q-item-label
                        v-if="card.name === null"
                        caption
                        class="text-grey"
                        >No name provided
                      </q-item-label>
                      <q-item-label v-else caption>
                        {{ card.name }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>
                        Number
                      </q-item-label>
                      <q-item-label caption>•••• {{ card.last4 }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Fingerprint</q-item-label>
                      <q-item-label caption>
                        {{ card.fingerprint }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Expires</q-item-label>
                      <q-item-label caption>
                        {{ card.exp_month | padZero }} / {{ card.exp_year }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Type</q-item-label>
                      <q-item-label caption>
                        {{ card.brand }} {{ card.funding }} card
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Billing Address</q-item-label>
                      <q-item-label caption>
                        <div v-if="card.address_line1 === null">
                          No address provided
                        </div>
                        <address v-else>
                          {{ card.address_line1 }}<br />
                          <span v-if="card.address_line2">
                            {{ card.address_line2 }}
                          </span>
                          <br />
                          {{ card.address_city }}, {{ card.address_state }}
                          {{ card.address_zip }}<br />
                          {{ card.address_country }}
                        </address>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Origin</q-item-label>
                      <q-item-label caption>{{ card.country }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>CVC check</q-item-label>
                      <q-item-label
                        v-if="card.cvc_check === 'pass'"
                        caption
                        class="text-positive"
                      >
                        Passed
                      </q-item-label>
                      <q-item-label
                        v-else-if="card.cvc_check === 'fail'"
                        caption
                        class="text-negative"
                      >
                        Failed
                      </q-item-label>
                      <q-item-label
                        v-else-if="card.cvc_check === 'unavailable'"
                        caption
                      >
                        Unavailable
                      </q-item-label>
                      <q-item-label v-else caption>
                        Unchecked
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Street check</q-item-label>
                      <q-item-label
                        v-if="card.address_line1_check === 'pass'"
                        caption
                        class="text-positive"
                      >
                        Passed
                      </q-item-label>
                      <q-item-label
                        v-else-if="card.address_line1_check === 'fail'"
                        caption
                        class="text-negative"
                      >
                        Failed
                      </q-item-label>
                      <q-item-label
                        v-else-if="card.address_line1_check === 'unavailable'"
                        caption
                      >
                        Unavailable
                      </q-item-label>
                      <q-item-label v-else caption>
                        Unchecked
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Zip check</q-item-label>
                      <q-item-label
                        v-if="card.address_zip_check === 'pass'"
                        caption
                        class="text-positive"
                      >
                        Passed
                      </q-item-label>
                      <q-item-label
                        v-else-if="card.address_zip_check === 'fail'"
                        caption
                        class="text-negative"
                      >
                        Failed
                      </q-item-label>
                      <q-item-label
                        v-else-if="card.address_zip_check === 'unavailable'"
                        caption
                      >
                        Unavailable
                      </q-item-label>
                      <q-item-label v-else caption>
                        Unchecked
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-grey text-center">No card</div>
      </q-card-section>
    </q-card>
    <!-- Delete card -->
    <customer-delete-card-dialog
      :show-dialog.sync="showCustomerDeleteCardDialog"
      :card-id="cardId"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import CustomerDeleteCardDialog from 'components/customers/CustomerDeleteCardDialog.vue';

const { mapMutations } = createNamespacedHelpers('customers');

export default {
  name: 'CustomerCards',
  props: {
    cardData: {
      type: Array,
      required: true,
    },
  },
  components: {
    customerDeleteCardDialog: CustomerDeleteCardDialog,
  },
  data() {
    return {
      cardId: '',
      selectedCardData: {
        exp_month: 0,
        exp_year: 0,
        name: '',
        address_line1: '',
        address_line2: '',
        address_city: '',
        address_state: '',
        address_zip: '',
        address_country: '',
      },
      selectedCardIndex: '',
      showCustomerDeleteCardDialog: false,
    };
  },
  filters: {
    padZero(number) {
      return number.toString().padStart(2, '0');
    },
  },
  methods: {
    ...mapMutations(['setSelectedCardData']),
    deleteCard(cardId) {
      this.cardId = cardId;
      this.showCustomerDeleteCardDialog = true;
    },
    editCard(card) {
      this.setSelectedCardData(card);
    },
    isShown(index) {
      if (index === this.selectedCardIndex) {
        return true;
      }
      return false;
    },
    selectedCard(index) {
      this.selectedCardIndex = index;
    },
  },
};
</script>
