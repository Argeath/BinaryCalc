
export function NgLog(): ClassDecorator {
  return (constructor: any) => {
    console.log('ENV: ', ENV);

    if (ENV !== 'production') {
      // You can add/remove events for your needs
      const LIFECYCLE_HOOKS = [
        'ngOnInit',
        'ngOnChanges',
        'ngOnDestroy'
      ];

      const component = constructor.name;

      LIFECYCLE_HOOKS.forEach((hook) => {
        const original = constructor.prototype[hook];

        constructor.prototype[hook] = (...args) => {
          console.log(`%c ${component} - ${hook}`, `color: #4CAF50; font-weight: bold`, ...args);
          if (original) {
            original.apply(this, args);
          }
        };
      });
    }
  };
}
