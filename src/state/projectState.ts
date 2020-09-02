/// <reference path="../models/project.ts"/>
/// <reference path="./state.ts"/>

namespace App {
  export class ProjectState extends State<ProjectModel> {
    private static instance: ProjectState;
    private projects: ProjectModel[] = [];

    private constructor() {
      super();
    }

    getProjects() {
      return this.projects;
    }

    createProject(title: string, description: string, people: number, status: projectStatus = projectStatus.ACTIVE) {
      const project = new ProjectModel(title, description, people, status);

      this.projects.push(project);

      this.emit();
    }

    moveProject(id: string, newStatus: projectStatus) {
      const project = this.projects.find((project) => project.id === id);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.emit();
      }
    }

    private emit() {
      this.listeners.forEach((listenerFn) => {
        listenerFn(this.projects.slice());
      });
    }

    static getInstance() {
      if (ProjectState.instance === undefined) {
        ProjectState.instance = new ProjectState();
      }

      return ProjectState.instance;
    }
  }
}
