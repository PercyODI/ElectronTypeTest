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
        this.scorePages[0].drawingStage.on("stagemousedown", () => alert("any event!"));
    }

    public selectTool(id: string) {
        return;
    }

    private removeAllToolListeners() {
        this.scorePages.forEach((scorePage) => {
            scorePage.drawingStage.removeAllEventListeners();
        });
    }
}

export { ToolController };
