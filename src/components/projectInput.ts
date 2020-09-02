/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../state/projectState.ts"/>
/// <reference path="../util/validator.ts"/>
/// <reference path="./baseComponent.ts"/>

namespace App {
  type projectInputFormRequest = {
    title: string;
    description: string;
    people: string;
  };

  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");

      this.titleInputElement = this.element.querySelector("input#title")! as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector("textarea#description")! as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector("input#people")! as HTMLInputElement;

      this.configure();
    }

    public configure() {
      this.element.addEventListener("submit", this.submitHandler.bind(this));
    }

    public renderContent() {}

    @Autobind
    private submitHandler(event: Event) {
      event.preventDefault();
      const formRequest = this.getUserInputFromForm();
      console.log(formRequest);
      this.clearInputs();
    }

    private getUserInputFromForm(): projectInputFormRequest | void {
      const formRequest: projectInputFormRequest = {
        title: this.titleInputElement.value,
        description: this.descriptionInputElement.value,
        people: this.peopleInputElement.value,
      };

      const rules = [
        {
          key: "title",
          rules: [validationRules.REQUIRED],
        },
        {
          key: "description",
          rules: [validationRules.REQUIRED],
        },
        {
          key: "people",
          rules: [validationRules.REQUIRED, validationRules.POSITIVE_NUMBER],
        },
      ];

      let validator = new Validator(rules, formRequest);
      if (!validator.isValid) throw new Error(validator.errors.join());

      const projectState = ProjectState.getInstance();
      projectState.createProject(formRequest.title, formRequest.description, +formRequest.people);
    }

    private clearInputs(): void {
      this.titleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.peopleInputElement.value = "";
    }
  }
}
