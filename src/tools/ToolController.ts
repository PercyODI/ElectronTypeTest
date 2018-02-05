import { ScorePage } from "../models/scorePage";
import { AbstractTool, FreeDrawTool } from ".";
import * as $ from "jquery";
import * as _ from "lodash";

class ToolController {
    public toolDiv: JQuery<HTMLElement> = $("<div>");

    private scorePages: ScorePage[] = [];
    private currentTool: AbstractTool;
    private loadedTools: AbstractTool[] = [];

    constructor() {
        this.loadedTools.push(new FreeDrawTool());
        this.currentTool = _.first(this.loadedTools);

        this.updateToolDiv();
    }

    public updateToolDiv() {
        this.toolDiv.html("Current Tool: " + this.currentTool.toolName + " -- ");
        this.toolDiv.append(this.currentTool.getUI());
    }

    public addScorePage(scorePage: ScorePage) {
        this.scorePages.push(scorePage);
        console.log(this.scorePages);
        // scorePage.bindToChangeEvent(() => this.updateScorePages());
        this.setUpMouseEvents();
    }

    public updateScorePages() {
        this.loadedTools.forEach((tool) => {
            this.scorePages.forEach((scorePage) => {
                tool.redrawFromSave(scorePage.drawingStage, 2);
            });
        });
        this.setUpMouseEvents();
    }

    public selectTool(id: string) {
        return;
    }

    private removeAllToolListeners() {
        this.scorePages.forEach((scorePage) => {
            scorePage.drawingStage.removeAllEventListeners();
        });
    }

    private setUpMouseEvents() {
        this.removeAllToolListeners();
        this.scorePages.forEach((scorePage) => {
            scorePage.drawingStage.on("stagemousedown", (evt: createjs.MouseEvent) => {
                this.currentTool.onMouseEvent("stagemousedown", evt.localX, evt.localY, scorePage.drawingStage);
            });
            scorePage.drawingStage.on("stagemousemove", (evt: createjs.MouseEvent) => {
                this.currentTool.onMouseEvent("stagemousemove", evt.localX, evt.localY, scorePage.drawingStage);
            });
            scorePage.drawingStage.on("stagemouseup", (evt: createjs.MouseEvent) => {
                this.currentTool.onMouseEvent("stagemouseup", evt.localX, evt.localY, scorePage.drawingStage);
            });
        });
    }
}

export { ToolController };
