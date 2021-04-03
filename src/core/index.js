import Rematch from "./core";
import mergeConfig from "./merge";
let count = 0;
export default (initConfig = {}) => {
  count += 1;
  let name = initConfig.name || count;
  let config = mergeConfig({ ...initConfig, name });
  return new Rematch(config).init();
};
