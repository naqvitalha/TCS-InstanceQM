export class Task<T, E> {

    public static Yield(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, 0);
        });
    }

    public static Delay(milliseconds: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, milliseconds);
        });
    }
    private promise: Promise<T>;
    private resolveMethod: (result: T) => void;
    private rejectMethod: (error: E) => void;
    constructor() {
        this.promise = new Promise<T>(
            (resolve: (result: T) => void, reject: (error: E) => void) => {
                this.resolveMethod = resolve;
                this.rejectMethod = reject;
            },
        );
    }

    public resolve(value: T): void {
        this.resolveMethod(value);
    }

    public reject(error: E): void {
        this.rejectMethod(error);
    }

    public getResultAsync(): Promise<T> {
        return this.promise;
    }
}
