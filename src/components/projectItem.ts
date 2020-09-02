/// <reference path="./baseComponent.ts"/>
/// <reference path="../models/project.ts"/>
/// <reference path="../interfaces/draggable.ts"/>
/// <reference path="../decorators/autobind.ts"/>
namespace App {
  export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    constructor(private project: ProjectModel, hostId: string) {
      super("single-project", hostId, false, `project-${project.id}`);
      this.configure();
      this.renderContent();
    }
    @Autobind
    dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData("text/plain", this.project.id);
      event.dataTransfer!.effectAllowed = "move";
    }

    @Autobind
    dragEndHandler(_: DragEvent) {
      console.log("DragEnd");
    }

    configure() {
      this.element.addEventListener("dragstart", this.dragStartHandler);
      this.element.addEventListener("dragend", this.dragEndHandler);
      this.element.draggable = true;
    }

    renderContent() {
      const titleEl = this.element.querySelector(".project__title")!;
      titleEl.textContent = this.project.title;
      const people = this.element.querySelector(".project__people")!;
      people.textContent = `${this.project.persons} assigned`;
      const descriptionEl = this.element.querySelector(".project__description")!;
      descriptionEl.textContent = this.project.description;
    }
  }
}
