import { useAuthStore } from "src/stores/auth";
export default async function auth({ next, to, from }) {
  const authStore = useAuthStore();

  if (authStore.isAuth) {
    if (to.name === "login") {
      return next({ name: "dashboard" });
    }
    return next();
  }

  next({ name: "login" });
}
