/// <reference path="../../node_modules/@types/easeljs/index.d.ts" />
import * as shortid from "shortid";

abstract class AbstractTool {
    public id: string;
    public abstract toolName: string;

    constructor() {
        this.id = shortid.generate();
    }

    public abstract getUI(): JQuery<HTMLElement>;
}

export { AbstractTool };
