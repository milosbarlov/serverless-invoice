<template>
  <div>
    <q-card class="q-mb-md" v-if="!$store.state.layout.fullscreen">
      <q-card-section class="row items-center no-wrap">
        <div class="text-h6 text-weight-regular">
          Bank accounts
        </div>
        <q-space />
        <q-btn color="primary" :to="`${$route.path}/add-bank-account`">
          <q-icon left name="fas fa-plus" size="1rem" />
          <div>add bank account</div>
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section v-if="bankData.length > 0" class="q-pa-none">
        <q-list>
          <q-expansion-item
            v-for="(bank, index) in bankData"
            :key="bank.id"
            switch-toggle-side
          >
            <template v-slot:header>
              <q-item-section>
                <div class="row q-col-gutter-x-md">
                  <div>
                    {{ bank.account_holder_name }}
                  </div>
                  <div>••••{{ bank.last4 }}</div>
                  <div class="text-uppercase">
                    {{ bank.currency }}
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>
                <q-btn-group class="gt-sm" flat>
                  <q-btn
                    flat
                    size="sm"
                    label="delete"
                    color="negative"
                    icon="fas fa-trash"
                    @click.stop="deleteBankAccount(bank.id)"
                  />
                  <q-btn
                    v-if="bank.status === 'new'"
                    flat
                    size="sm"
                    label="verify"
                    color="secondary"
                    icon="fas fa-check"
                    @click.stop="verifyBankAccount(bank.id)"
                  />
                </q-btn-group>
                <q-btn
                  round
                  flat
                  class="lt-md"
                  color="tertiary"
                  size="sm"
                  icon="fas fa-ellipsis-v"
                  @click.stop="selectedBankIndex = index"
                >
                  <q-menu
                    v-show="isShown(index)"
                    fit
                    anchor="bottom left"
                    self="top left"
                  >
                    <q-list class="scroll">
                      <q-item
                        @click.native="deleteBankAccount(bank.id)"
                        clickable
                        v-ripple
                        v-close-popup
                      >
                        <q-item-section avatar>
                          <q-icon class="fas fa-trash text-negative" />
                        </q-item-section>
                        <q-item-section class="text-negative">
                          Delete
                        </q-item-section>
                      </q-item>
                      <q-item
                        v-if="bank.status === 'new'"
                        @click.native="verifyBankAccount(bank.id)"
                        clickable
                        v-ripple
                        v-close-popup
                      >
                        <q-item-section avatar color="secondary">
                          <q-icon class="fas fa-check" />
                        </q-item-section>
                        <q-item-section class="text-secondary">
                          Verify
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                  <q-tooltip anchor="bottom middle" self="top middle">
                    More
                  </q-tooltip>
                </q-btn>
              </q-item-section>
            </template>
            <q-card>
              <q-card-section class="q-pa-sm">
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label>ID</q-item-label>
                      <q-item-label caption>{{ bank.id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Bank name</q-item-label>
                      <q-item-label caption>{{ bank.bank_name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Number</q-item-label>
                      <q-item-label caption>{{ bank.last4 }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Fingerprint</q-item-label>
                      <q-item-label caption>{{
                        bank.fingerprint
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Type</q-item-label>
                      <q-item-label caption>
                        {{ bank.account_holder_type }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Currency</q-item-label>
                      <q-item-label caption>
                        {{ bank.currency.toUpperCase() }}
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
        <div class="text-grey text-center">No bank account</div>
      </q-card-section>
    </q-card>
    <!-- Delete bank account -->
    <customer-delete-bank-account-dialog
      :show-dialog.sync="showDeleteBankAccountDialog"
      :bank-id="bankId"
    />
    <!-- Verify bank account -->
    <customer-verify-bank-account-dialog
      :show-dialog.sync="verifyingBankAccountDialog"
      :bank-id="bankId"
    />
  </div>
</template>

<script>
import CustomerDeleteBankAccountDialog from 'components/customers/CustomerDeleteBankAccountDialog.vue';
import CustomerVerifyBankAccountDialog from 'components/customers/CustomerVerifyBankAccountDialog.vue';

export default {
  name: 'CustomerBankAccounts',
  props: {
    bankData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      bankId: '',
      showDeleteBankAccountDialog: false,
      verifyingBankAccountDialog: false,
      selectedBankIndex: '',
    };
  },
  components: {
    customerDeleteBankAccountDialog: CustomerDeleteBankAccountDialog,
    customerVerifyBankAccountDialog: CustomerVerifyBankAccountDialog,
  },
  methods: {
    deleteBankAccount(bankId) {
      this.bankId = bankId;
      this.showDeleteBankAccountDialog = true;
    },
    isShown(index) {
      if (index === this.selectedBankIndex) {
        return true;
      }
      return false;
    },
    verifyBankAccount(bankId) {
      this.bankId = bankId;
      this.verifyingBankAccountDialog = true;
    },
  },
};
</script>
