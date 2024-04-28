<script setup>
import BaseInput from "components/UI/BaseInput.vue";
import validate from "src/utils/validate";
import { ref, computed, reactive, nextTick } from "vue-demi";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { getServerError, sleep, trimBetween } from "src/utils/helpers";
import { useAuthStore } from "src/stores/auth";
import { PHONE_PREFIX } from "src/utils/helpers";

const authStore = useAuthStore();
const $q = useQuasar();
const router = useRouter();

const loginError = ref(false);

const formRef = ref(null);
const form = reactive({
  phoneNumber: "",
  password: "",
  isTrusted: true,
  trusted: false,
});

const isPwd = ref(true);

const phoneRules = computed(() => {
  const loginNotError = !loginError.value;
  const loginOrPassError = () => loginNotError || "Login yoki parol noto'g'ri";
  const phoneLengthFn = (val) =>
    trimBetween(val)?.toString()?.length === 9 ||
    "To'g'ri telefon raqamini kiriting";
  return [validate.required, loginOrPassError, phoneLengthFn];
});
async function tryLogin() {
  resetValidation();
  await sleep(10);
  const hasError = !(await formRef.value.validate());
  if (hasError) return resetValidation(5000);

  $q.loading.show();

  try {
    const res = await authStore.login({
      login: phoneNumberWithPrefix.value,
      password: form.password,
    });
    const token = res?.token;
    if (token) {
      router.push({
        name: "dashboard",
      });
    }
  } catch (error) {
    console.log("error", error);
    loginError.value = getServerError(error, "errorMessage");
    await nextTick();
    await formRef.value.validate();
    resetValidation(5000);
  } finally {
    $q.loading.hide();
  }
}

const phoneNumberWithPrefix = computed(() => trimBetween(form.phoneNumber));

let resetTimeout = 0;
function resetValidation(timeout = 0) {
  clearTimeout(resetTimeout);
  resetTimeout = setTimeout(() => {
    loginError.value = false;
    formRef.value.resetValidation();
  }, timeout);
}
</script>

<template>
  <div class="login-page">
    <div class="card">
      <header class="header">Administrator kabineti</header>
      <q-form ref="formRef" class="login-form" @submit.prevent="tryLogin">
        <div class="form--title">Telefon nomer</div>
        <BaseInput
          v-model="form.phoneNumber"
          standout="standout-bg-gray"
          mask="## ### ## ##"
          name="current-phone-number"
          type="tel"
          :rules="phoneRules"
          no-error-icon
          prepend
          @update:model-value="resetValidation"
          @keyup.enter="tryLogin"
        >
          <template #prepend>
            <div class="phone_prefix">
              {{ PHONE_PREFIX }}
            </div>
          </template>
        </BaseInput>
        <div class="form--title">Parol</div>
        <BaseInput
          :model-value="form.password"
          standout="standout-bg-gray"
          placeholder="Parolni kiriting"
          name="current-pasword"
          :type="isPwd ? 'password' : 'text'"
          :rules="[validate.required]"
          no-error-icon
          append
          @keyup.enter="tryLogin"
          @update:model-value="
            (v) => {
              form.password = trimBetween(v);
              resetValidation();
            }
          "
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </BaseInput>
        <footer class="footer">
          <div class="footer-middle">
            <q-btn
              color="primary"
              class="login-btn"
              label="Kirish"
              no-caps
              @click="tryLogin"
            />
          </div>
        </footer>
      </q-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  .login-card-mobile {
    width: 100%;
  }
  .phone_number {
    font-weight: 600;
    font-size: 24px;
    line-height: 34px;
  }
  .form {
    padding: 0 15px;
    width: 100%;
    input {
      border-radius: 8px;
    }
  }

  .forgot_password {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    &:hover {
      // color: $grey-4;
    }
  }
  .footer {
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 5px;
    }
    &-middle {
      margin-top: 60px;
      .login-btn {
        padding: 12px 77px;
      }
    }
  }
}
</style>
<style lang="scss">
.login-page {
  .footer {
    &-top {
      [aria-checked="false"] {
        .q-checkbox__bg {
          border-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
}
</style>
