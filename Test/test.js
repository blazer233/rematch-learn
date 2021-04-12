let newData = {};
newData = stateMap(state, mainObj);
let newKeys = Object.keys(newData);
let oldData = {};
newKeys.forEach(i => {
  oldData[i] = mainObj.data[i];
});
let diffKeys = [];
let diff = deepDiff(oldData, newData);
diffKeys = Object.keys(diff);
if (diffKeys.length) {
  let tmp = {};
  diffKeys.forEach(k => {
    tmp[k] = newData[k];
  });
  console.log(tmp);
}
function clone(target, map = new WeakMap()) {
  if (typeof target === "object") {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return map.get(target);
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = clone(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
}
