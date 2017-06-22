import * as _ from 'lodash';

export function throttle( milliseconds: number = 500 ): MethodDecorator {
  return ( target: any, propertyKey: string, descriptor: PropertyDescriptor ) => {
    const original = descriptor.value;
    descriptor.value = _.throttle(original, milliseconds);
    return descriptor;
  };
}
