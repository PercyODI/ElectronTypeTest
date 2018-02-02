/// <reference path="../../node_modules/@types/easeljs/index.d.ts" />

abstract class AbstractTool {
    public id: string;
    public toolName: string;
    public abstract getUI(): void;
}

export { AbstractTool };
