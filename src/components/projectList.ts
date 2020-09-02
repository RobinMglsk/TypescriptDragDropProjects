/// <reference path="./baseComponent.ts"/>
/// <reference path="./projectItem.ts"/>
/// <reference path="../state/projectState.ts"/>
/// <reference path="../interfaces/dragTarget.ts"/>
/// <reference path="../decorators/autobind.ts"/>
/// <reference path="../models/project.ts"/>
namespace App {
  export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    projects: ProjectModel[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.projects = [];
      this.configure();
      this.renderContent();
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }
    @Autobind
    dragLeaveHandler(_event: DragEvent) {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    @Autobind
    dropHandler(event: DragEvent) {
      const projectId = event.dataTransfer?.getData("text/plain");
      if (projectId) {
        const newStatus = this.type === "active" ? projectStatus.ACTIVE : projectStatus.FINISHED;
        const projectState = ProjectState.getInstance();
        projectState.moveProject(projectId, newStatus);
      }

      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    renderContent() {
      const listId = `${this.type}-project-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS";
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      const projectState = ProjectState.getInstance();
      projectState.subscribe((projects: ProjectModel[]) => {
        this.projects = projects.filter((project) => {
          if (this.type === "active") {
            return project.status === projectStatus.ACTIVE;
          }

          if (this.type === "finished") {
            return project.status === projectStatus.FINISHED;
          }

          return false;
        });
        this.renderProjects();
      });
    }

    private renderProjects() {
      const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
      listEl.innerHTML = "";
      this.projects.forEach((project) => {
        new ProjectItem(project, `${this.type}-project-list`);
      });
    }
  }
}
