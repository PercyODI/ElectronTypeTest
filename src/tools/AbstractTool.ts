/// <reference path="../../node_modules/@types/easeljs/index.d.ts" />
import * as shortid from "shortid";
import * as Nedb from "nedb";
import { ScorePage } from "../models";

abstract class AbstractTool {
    public id: string;
    public abstract toolName: string;
    protected datastore: Nedb;

    constructor() {
        this.id = shortid.generate();
        this.datastore = new Nedb();
    }

    public abstract getUI(): JQuery<HTMLElement>;
    public abstract redrawFromSave(drawingStage: createjs.Stage, page: number): void;
    public abstract onMouseEvent(type: string, stageX: number, stageY: number, drawingStage: createjs.Stage): void;
}

export { AbstractTool };
