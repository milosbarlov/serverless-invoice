<template>
  <q-page class="flex flex-center" :padding="!$q.platform.is.mobile">
    <form @submit.prevent="login" style="width: 100%; max-width: 580px;">
      <q-card
        :class="['text-2b', { 'window-height': $q.screen.lt.sm }]"
        :flat="$q.screen.lt.sm"
      >
        <q-card-section>
          <div class="text-h4 text-center q-my-md">Log In</div>
        </q-card-section>
        <q-banner>
          <div class="text-bold text-red">Guest</div>
          <div>username: dummy</div>
          <div>password: sample</div>
        </q-banner>
        <q-card-section>
          <div class="q-gutter-y-md">
            <alert
              :alert="$store.state.auth.error || error ? true : false"
              :message="$store.state.auth.error || error"
            />
            <q-input
              color="cyan"
              filled
              :error="$v.form.username.$error"
              error-message="Enter a username"
              label="Username"
              v-model="form.username"
            >
              <template #prepend>
                <q-icon name="fas fa-fw fa-sm fa-user" />
              </template>
            </q-input>
            <q-input
              color="cyan"
              filled
              :error="$v.form.password.$error"
              error-message="Enter a password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              v-model="form.password"
            >
              <template #prepend>
                <q-icon name="fas fa-fw fa-sm fa-key" />
              </template>
              <template #append>
                <q-icon
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                >
                  <q-tooltip>
                    {{ isPwd ? 'Show password' : 'Hide password' }}
                  </q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions class="q-pa-md">
          <q-btn
            class="q-my-md full-width"
            @click="login"
            color="cyan"
            label="Log In"
            no-caps
            rounded
            size="lg"
            type="submit"
          />
        </q-card-actions>
      </q-card>
    </form>
  </q-page>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import Alert from 'components/Alert.vue';

export default {
  name: 'Login',
  data() {
    return {
      isPwd: true,
      form: {
        username: '',
        password: '',
      },
      error: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.redirect) {
      next(vm => {
        vm.error = 'Unauthorized access: Please login.';
      });
    } else {
      next();
    }
  },
  validations: {
    form: {
      username: {
        required,
      },
      password: {
        required,
      },
    },
  },
  components: {
    alert: Alert,
  },
  methods: {
    login() {
      this.error = '';
      this.$v.form.$touch();

      if (this.$v.form.$error) {
        return;
      }

      this.$store.dispatch('auth/login', this.form);
    },
  },
};
</script>
