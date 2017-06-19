import { BigInteger } from 'big-integer';

export interface Operation {
  name: string;
  calculate: (a: BigInteger, b: BigInteger) => BigInteger;
}
