import { TaskCompletionSource } from "./tasks/TaskCompletionSource";

export default class InstanceQM<T> {
    private clientStack: T[] = [];
    private requestQueue: Array<TaskCompletionSource<T, any>> = [];
    constructor(instanceCount: number, initialInstances: T[]) {
        if (!initialInstances || initialInstances.length !== instanceCount) {
            throw { message: "No of instances passes should be equal to instanceCount" };
        }
        for (let i = 0; i < instanceCount; i++) {
            this.clientStack.push(initialInstances[i]);
        }
    }

    public getQueueSize(): number {
        return this.requestQueue.length;
    }

    public releaseInstance(instance: T): void {
        if (this.requestQueue.length > 0) {
            (this.requestQueue.shift() as TaskCompletionSource<T, any>).trySetResult(instance);
        } else {
            this.clientStack.push(instance);
        }
    }

    public getFreeInstanceAsync(): Promise<T> {
        const tcs = new TaskCompletionSource<T, any>();
        this.requestQueue.push(tcs);
        this._processQueue();
        return tcs.getResultAsync();
    }

    private _processQueue(): void {
        if (this.clientStack.length > 0) {
            (this.requestQueue.shift() as TaskCompletionSource<T, any>).trySetResult(this.clientStack.shift() as T);
        }
    }
}
