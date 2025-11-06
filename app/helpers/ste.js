import { helper } from '@ember/component/helper';

export function ste([a, b]) {
  return a <= b;
}

export default helper(ste);
