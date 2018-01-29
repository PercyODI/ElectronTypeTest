import { ScorePage } from "../models/scorePage";
import * as _ from "lodash";
import { FreeDrawTool } from "./FreeDrawTool";

class ToolController {
    private scorePages: ScorePage[] = [];
    private currentTool: ITool;
    private loadedTools: ITool[] = [];

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
