import { ScorePage } from "../models/scorePage";
import * as _ from "lodash";
import { AbstractTool, FreeDrawTool } from ".";

class ToolController {
    private scorePages: ScorePage[] = [];
    private currentTool: AbstractTool;
    private loadedTools: AbstractTool[] = [];

    constructor() {
        this.loadedTools.push(new FreeDrawTool());

        this.currentTool = _.first(this.loadedTools);
    }

    public addScorePage(scorePage: ScorePage) {
        this.scorePages.push(scorePage);
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
