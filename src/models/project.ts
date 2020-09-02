namespace App {
  export enum projectStatus {
    ACTIVE,
    FINISHED,
  }

  export class ProjectModel {
    id: string;
    title: string;
    description: string;
    people: number;
    status: projectStatus;

    get persons() {
      return this.people === 1 ? "1 person" : `${this.people} persons`;
    }

    constructor(title: string, description: string, people: number, status: projectStatus = projectStatus.ACTIVE) {
      this.id = Math.random().toString();
      this.title = title;
      this.description = description;
      this.people = people;
      this.status = status;
    }
  }
}
