import { defineStore } from "pinia";
import * as api from "src/api/auth";
import {
  getTokenFromCache,
  removeTokenFromCache,
  setTokenToCache,
} from "src/utils/auth";
import { ref, computed } from "vue-demi";
export const useAuthStore = defineStore("auth", () => {
  const token = ref(getTokenFromCache());
  const user = ref({});
  const isAuth = computed(() => !!token.value);
  async function login(payload) {
    const res = await api.login(payload);

    const token = res?.access_token;
    if (token) {
      setToken(token);
      me();
    }
    return res;
  }
  async function me() {
    if (token.value) {
      const res = await api.me();
      setUser(res);
    }
  }
  function setUser(data) {
    user.value = data;
  }

  function setToken(payload) {
    token.value = payload;
    setTokenToCache(payload);
  }
  function removeToken() {
    token.value = null;
    removeTokenFromCache();
  }
  async function logout() {
    // await api.logout();
    removeToken();
  }
  return {
    login,
    logout,
    me,
    user,
    isAuth,
  };
});
