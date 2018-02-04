import { AbstractTool } from ".";
import { ScorePage, ILine } from "../models";
import * as $ from "jquery";

class FreeDrawTool extends AbstractTool {
    public toolName = "Free Draw Tool";

    private isMouseDown = false;
    private oldXY: { x: number, y: number } = undefined;

    public getUI(): JQuery<HTMLElement> {
        return $("<div>").html("Free Draw UI Here");
    }

    public redrawFromSave(drawingStage: createjs.Stage, page: number): void {
        this.datastore.find({ type: "line", page }, (err: any, docs: any[]) => {
            console.log(drawingStage);
            console.log("Found Docs:");
            console.log(docs);
            docs.forEach((doc:
                {
                    type: string,
                    page: number,
                    start: { x: number, y: number },
                    end: { x: number, y: number },
                }) => {
                const newLine = new createjs.Shape();
                newLine.graphics
                    .beginStroke("blue")
                    .moveTo(doc.start.x, doc.start.y)
                    .lineTo(doc.end.x, doc.end.y);
                drawingStage.addChild(newLine);
            });
            drawingStage.update();
        });
    }

    public onMouseEvent(type: string, stageX: number, stageY: number, drawingStage: createjs.Stage): void {
        switch (type) {
            case "stagemousedown":
                this.onStageMouseDown(stageX, stageY);
                break;
            case "stagemousemove":
                this.onStageMouseMove(stageX, stageY, drawingStage);
                break;
            case "stagemouseup":
                this.onStageMouseUp(stageX, stageY, drawingStage);
                break;
            default:
                return;
        }

        drawingStage.update();
    }

    private onStageMouseDown(stageX: number, stageY: number): void {
        this.isMouseDown = true;
        this.oldXY = { x: stageX, y: stageY };
    }

    private onStageMouseMove(stageX: number, stageY: number, drawingStage: createjs.Stage): void {
        if (this.isMouseDown) {
            const newLine = new createjs.Shape();
            newLine.graphics
                .beginStroke("blue")
                .moveTo(this.oldXY.x, this.oldXY.y)
                .lineTo(stageX, stageY);
            drawingStage.addChild(newLine);

            this.oldXY = { x: stageX, y: stageY };
            this.datastore.insert({
                type: "line",
                page: 2,
                start: { x: this.oldXY.x, y: this.oldXY.y },
                end: { x: stageX, y: stageY },
            }, (err, doc) => {
                console.log(doc);
            });
        }
    }

    private onStageMouseUp(stageX: number, stageY: number, drawingStage: createjs.Stage) {
        if (this.isMouseDown) {
            const newLine = new createjs.Shape();
            newLine.graphics
                .beginStroke("blue")
                .moveTo(this.oldXY.x, this.oldXY.y)
                .lineTo(stageX, stageY);
            drawingStage.addChild(newLine);

            this.datastore.insert({
                type: "line",
                page: 2,
                start: { x: this.oldXY.x, y: this.oldXY.y },
                end: { x: stageX, y: stageY },
            });

            this.isMouseDown = false;
            this.oldXY = undefined;
        }
    }
}

export { FreeDrawTool };
