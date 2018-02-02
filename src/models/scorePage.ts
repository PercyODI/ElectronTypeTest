import { PDFPageProxy } from "pdfjs-dist";
import * as $ from "jquery";
import { isUndefined } from "util";

interface ISize {
    width: number;
    height: number;
}

class ScorePage {
    public pdfPage: PDFPageProxy;
    public pdfJqCanvas: JQuery<HTMLElement>;
    public drawingJqCanvas: JQuery<HTMLElement>;
    public drawingStage: createjs.Stage;
    public scoreWrapper: JQuery<HTMLElement>;
    public originalSize: ISize;
    public dots: Array<{ x: number, y: number }> = [];

    constructor(pdfPage: PDFPageProxy) {
        this.pdfPage = pdfPage;
        this.setupDOM();
        this.setupPdfAndDrawingCanvas();
        this.setupStage();
    }

    public resize(width: number, height: number): void {

        const viewport = this.pdfPage.getViewport(1);
        const scale = Math.min(width / viewport.width, height / viewport.height);

        this.removeDOM();
        this.setupDOM();
        this.setupPdfAndDrawingCanvas(scale);
        this.setupStage();
    }
    private setupPdfAndDrawingCanvas(scale?: number) {
        if (scale === null || scale === undefined) { scale = 1; }

        // Get Viewport with specified scale
        const viewport = this.pdfPage.getViewport(scale);

        // Set PDF Canvas Size and Render
        const pdfCanvas = (this.pdfJqCanvas.get(0) as HTMLCanvasElement);
        const context = pdfCanvas.getContext("2d");

        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        this.pdfPage.render({
            canvasContext: context,
            viewport,
        });

        // Set Drawing Canvas Size
        if (scale === 1) {
            this.originalSize = {
                height: viewport.height,
                width: viewport.width,
            };
        }
        const drawingCanvas = (this.drawingJqCanvas.get(0) as HTMLCanvasElement);
        drawingCanvas.height = this.originalSize.height;
        drawingCanvas.width = this.originalSize.width;
        this.drawingJqCanvas.css("width", Math.floor(viewport.width));

        // Set both the PDF and Drawing positions to absolute (0, 0)
        this.setCanvasPositionToAbsolute0();
        console.log(`Pos: ${JSON.stringify(this.pdfJqCanvas.position())}`);

        // Set the wrapping div to the width of the PDF
        // (for alignment reasons)
        this.scoreWrapper.width(viewport.width);
    }

    private setupDOM() {
        if (this.scoreWrapper === undefined || this.scoreWrapper === null) {
            console.log("Making new Score Wrapper");
            this.scoreWrapper = $("<div>")
                .css("position", "relative");
        }
        this.pdfJqCanvas = $("<canvas>");
        this.drawingJqCanvas = $("<canvas>");

        this.scoreWrapper.append(this.pdfJqCanvas);
        this.scoreWrapper.append(this.drawingJqCanvas);
    }

    private setCanvasPositionToAbsolute0() {
        this.pdfJqCanvas
            .css("top", 0)
            .css("left", 0)
            .css("position", "absolute");

        this.drawingJqCanvas
            .css("top", 0)
            .css("left", 0)
            .css("position", "absolute");
    }

    private removeDOM() {
        this.scoreWrapper.children().remove();
        this.pdfJqCanvas = undefined;
        this.drawingJqCanvas = undefined;
        this.drawingStage = undefined;
    }

    private setupStage() {
        const drawingCanvas = (this.drawingJqCanvas.get(0) as HTMLCanvasElement);
        this.drawingStage = new createjs.Stage(drawingCanvas);

        this.drawingStage.update();

        if (this.dots.length > 0) {
            this.dots.forEach((dot) => {
                const newCircle = new createjs.Shape();
                newCircle.graphics
                    .beginFill("black")
                    .drawCircle(dot.x, dot.y, 5);
                this.drawingStage.addChild(newCircle);
                this.drawingStage.update();
            });
        }

        this.drawingStage.on("stagemousedown", (event: createjs.MouseEvent) => {
            const newCircle = new createjs.Shape();
            newCircle.graphics
                .beginFill("black")
                .drawCircle(event.stageX, event.stageY, 5);
            this.drawingStage.addChild(newCircle);
            this.drawingStage.update();

            this.dots.push({ x: event.stageX, y: event.stageY });
        });
    }

}

export { ScorePage };
