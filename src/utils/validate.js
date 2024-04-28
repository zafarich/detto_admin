import { trimBetween } from "./helpers";

export const regExp = {
  password: /^[\w.!@#$%^&*=-|\/]{6,}$/,
  string: /^[a-zA-Zа-яА-Я]/,
  latin: /^[a-zA-Z]/,
  number: /^[0-9.]*$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  date: /^(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}$/,
  time: /^([0-1]?\d|2[0-3]):[0-5]\d$/,
  fulltime: /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/,
  timeOrFulltime: /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/,
  tag: /(<([^>]+)>)/gi,
};

export default {
  required: (v) => !!trimBetween(v) || "To'ldirilishi shart",
  number: (v) =>
    !v || regExp.number.test(Math.abs(trimBetween(v))) || "To'g'ri to'ldiring",
  integer: (v) =>
    !v || Number(v) === parseInt(trimBetween(v)) || "To'g'ri to'ldiring",
  email: (v) => regExp.email.test(v) || "Emailni to'g'ri kiriting",
  min_string: (v, n) =>
    trimBetween(v).toString().length >= n || `Minimal ${n} ta`,
  max_string: (v, n) =>
    trimBetween(v).toString().length <= n || `Maksimal ${n} ta`,
  password: (v) => regExp.password.test(v) || "2323",
};
