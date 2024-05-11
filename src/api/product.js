import { api } from "src/boot/axios";
const url = "api/v1/admin/product";
export async function fetch(params) {
  const { data } = await api(url + "/index", { params });
  return data;
}
export async function fetchAll(params) {
  const { data } = await api(url + "/index/all");
  return data;
}
export async function create(payload) {
  const res = await api.post(url + "/store", payload);
  return res;
}
export async function updateById(id, payload) {
  const { data } = await api.post(url + "/update/" + id, payload);
  return data;
}
export async function deleteById(id) {
  const { data } = await api.delete(url + "/delete/" + id);
  return data;
}
