export declare class ContextCoreService {
    private readonly asyncLocalStorage;
    constructor();
    run(callback: (...args: any[]) => void): void;
    set(key: string, value: any): void;
    get(key: string): any;
    getAll(): Map<string, any>;
    importRequest(request: Request): void;
    getUserId(): string;
    getUserEmail(): string;
    getIp(): string;
    getInfo(): Record<string, string | number> | undefined;
    addInfo(data: Record<string, string | number>): void;
    getUserAgencia(): string;
}
