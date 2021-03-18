export const randomString = function randomString() {
  return Math.random().toString(36).substring(7).split("").join(".");
};
/**
 * 判断是否为纯对象
 */
export const isPlainObject = function (obj) {
  if (typeof obj !== "object" || obj === null) return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};
