import { Task } from "./Task";
export class TaskCompletionSource<T, E> {
    private task: Task<T, E>;
    private isResultSet: boolean;

    constructor() {
        this.task = new Task();
        this.isResultSet = false;
    }

    public cancel(error: E): void {
        this.trySetError(error);
    }

    public setResult(result: T): void {
        if (this.isResultSet) {
            throw new Error("result/error has been set before");
        } else {
            this.isResultSet = true;
            this.task.resolve(result);
        }
    }

    public getResultAsync(): Promise<T> {
        return this.task.getResultAsync();
    }

    public trySetResult(result: T): void {
        if (!this.isResultSet) {
            this.setResult(result);
        }
    }

    public setError(error: E): void {
        if (this.isResultSet) {
            throw new Error("result/error has been set before");
        } else {
            this.isResultSet = true;
            this.task.reject(error);
        }
    }

    public trySetError(error: E): void {
        if (!this.isResultSet) {
            this.setError(error);
        }
    }
}
