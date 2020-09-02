namespace App {
  export enum validationRules {
    REQUIRED,
    NUMBER,
    POSITIVE_NUMBER,
  }
  export class Validator {
    readonly errors: string[] = [];

    get isValid() {
      return this.errors.length === 0;
    }

    constructor(private rules: { key: string; rules: validationRules[] }[], private data: { [key: string]: string }) {
      this.validate();
      return this;
    }

    private validate() {
      this.rules.forEach((field) => {
        const key = field.key;
        const rules = field.rules;
        if (this.data[key]) {
          rules.forEach((rule) => {
            switch (rule) {
              case validationRules.NUMBER:
                if (!this.validateNumber(this.data[key])) {
                  this.errors.push(`${key} is not a number`);
                }
                break;

              case validationRules.POSITIVE_NUMBER:
                if (!this.validatePositiveNumber(this.data[key])) {
                  this.errors.push(`${key} is not a positive number`);
                }
                break;
            }
          });
        } else {
          if (rules.indexOf(validationRules.REQUIRED) > -1) {
            this.errors.push(`${key} is required`);
          }
        }
      });
    }

    private validateNumber(data: string): boolean {
      return !isNaN(+data);
    }

    private validatePositiveNumber(data: string): boolean {
      return this.validateNumber(data) && +data >= 0;
    }
  }
}
