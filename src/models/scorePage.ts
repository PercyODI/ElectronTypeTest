import { PDFPageProxy } from "pdfjs-dist";
import * as $ from "jquery";
import { isUndefined } from "util";

interface size {
    width: number,
    height: number
}

class ScorePage {

    pdfPage: PDFPageProxy;
    pdfJqCanvas: JQuery<HTMLElement>;
    drawingJqCanvas: JQuery<HTMLElement>;
    drawingStage: createjs.Stage;
    scoreWrapper: JQuery<HTMLElement>;
    originalSize: size;

    constructor(pdfPage: PDFPageProxy) {
        this.pdfPage = pdfPage;
        this.setupDOM();
        this.setupPdfAndDrawingCanvas();
        this.setupStage();
    }

    private setupPdfAndDrawingCanvas(scale?: number) {
        if (scale === null || scale === undefined) scale = 1;

        // Get Viewport with specified scale
        let viewport = this.pdfPage.getViewport(scale);

        // Set PDF Canvas Size and Render
        let pdfCanvas = (this.pdfJqCanvas.get(0) as HTMLCanvasElement);
        let context = pdfCanvas.getContext("2d");

        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;
        
        this.pdfPage.render({
            canvasContext: context,
            viewport: viewport,
        })

        // Set Drawing Canvas Size
        if (scale == 1) {
            this.originalSize = {
                height: viewport.height,
                width: viewport.width
            }
        }
        let drawingCanvas = (this.drawingJqCanvas.get(0) as HTMLCanvasElement);
        drawingCanvas.height = this.originalSize.height;
        drawingCanvas.width = this.originalSize.width; 
        this.drawingJqCanvas.css("width", Math.floor(viewport.width));

        // Set both the PDF and Drawing positions to absolute (0, 0)
        this.setCanvasPositionToAbsolute0();
        console.log(`Pos: ${JSON.stringify(this.pdfJqCanvas.position())}`)

        // Set the wrapping div to the width of the PDF
        // (for alignment reasons)
        this.scoreWrapper.width(viewport.width);
    }

    private setupDOM() {
        if (this.scoreWrapper === undefined || this.scoreWrapper === null) {
            console.log("Making new Score Wrapper")
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

    dots: { x: number, y: number }[] = [];

    private setupStage() {
        let drawingCanvas = (this.drawingJqCanvas.get(0) as HTMLCanvasElement);
        this.drawingStage = new createjs.Stage(drawingCanvas);

        this.drawingStage.update();

        if (this.dots.length > 0) {
            this.dots.forEach(dot => {
                var newCircle = new createjs.Shape();
                newCircle.graphics
                    .beginFill("black")
                    .drawCircle(dot.x, dot.y, 5);
                this.drawingStage.addChild(newCircle);
                this.drawingStage.update();
            });
        }

        this.drawingStage.on("stagemousedown", (event: createjs.MouseEvent) => {
            var newCircle = new createjs.Shape();
            newCircle.graphics
                .beginFill("black")
                .drawCircle(event.stageX, event.stageY, 5);
            this.drawingStage.addChild(newCircle);
            this.drawingStage.update();

            this.dots.push({ x: event.stageX, y: event.stageY });
        })
    }

    public resize(width: number, height: number): void {

        let viewport = this.pdfPage.getViewport(1);
        var scale = Math.min(width / viewport.width, height / viewport.height);

        this.removeDOM();
        this.setupDOM();
        this.setupPdfAndDrawingCanvas(scale);
        this.setupStage();
    }
}

export { ScorePage };