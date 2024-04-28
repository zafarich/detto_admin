import { api } from "src/boot/axios";
const url = "api/v1/auth";
const urlAdmin = "api/v1/admin/auth";

export async function login(payload) {
  const { data } = await api.post(urlAdmin + "/login", payload, {
    pass: true,
  });
  return data?.result;
}
export async function me() {
  const { data } = await api.get(url + "/me");
  return data?.result;
}

export async function logout() {
  const { data } = await api.post(url + "/logout");
  return data?.result;
}
