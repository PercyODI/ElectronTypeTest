/// <reference path="../../node_modules/@types/easeljs/index.d.ts" />

interface ITool {
    id: string;
    toolName: string;
    getUI(): void;
}
