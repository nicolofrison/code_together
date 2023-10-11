export interface Observer<T> {
  update(t: T): void;
}

export abstract class Observable<T> {
  protected observers: Observer<T>[] = [];

  public attach(o: Observer<T>) {
    if (!this.observers.includes(o)) {
      this.observers.push(o);
    }
  }

  public detach(o: Observer<T>) {
    if (this.observers.includes(o)) {
      this.observers.splice(this.observers.indexOf(o), 1);
    }
  }

  protected notify(t: T) {
    this.observers.forEach((o) => o.update(t));
  }
}
