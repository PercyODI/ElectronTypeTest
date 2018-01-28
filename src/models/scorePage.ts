import { PDFPageProxy } from "pdfjs-dist";
import * as $ from "jquery";

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

    constructor(pdfPage: PDFPageProxy) {
        this.pdfPage = pdfPage;
        this.setupDOM();

        let viewport = this.pdfPage.getViewport(1);
        // var scale = width / viewport.width;
        // viewport = this.pdfPage.getViewport(scale);

        let drawingCanvas = (this.drawingJqCanvas.get(0) as HTMLCanvasElement);
        let pdfCanvas = (this.pdfJqCanvas.get(0) as HTMLCanvasElement);
        let context = pdfCanvas.getContext("2d");

        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        drawingCanvas.height = viewport.height;
        drawingCanvas.width = viewport.width;

        this.drawingStage = new createjs.Stage(drawingCanvas);
        this.drawingStage.update();

        this.pdfPage.render({
            canvasContext: context,
            viewport: viewport,
        })

        this.setupStage();
    }

    private setupDOM() {
        this.pdfJqCanvas = $("<canvas>");
        this.drawingJqCanvas = $("<canvas>");

        this.scoreWrapper = $("<div>")
            .css("position", "relative");

        this.scoreWrapper.append(this.pdfJqCanvas);
        this.pdfJqCanvas
            .offset({ top: 0, left: 0 })
            .css("position", "absolute");

        this.scoreWrapper.append(this.drawingJqCanvas);
        this.drawingJqCanvas
            .offset({ top: 0, left: 0 })
            .css("position", "absolute");
    }

    private setupStage() {
        this.drawingStage.on("stagemousedown", (event: createjs.MouseEvent) => {
            var newCircle = new createjs.Shape();
            newCircle.graphics
                .beginFill("black")
                .drawCircle(event.stageX, event.stageY, 5);
            this.drawingStage.addChild(newCircle);
            this.drawingStage.update();
        })
    }

    public resize(width: number, height: number): void {
        let canvases = this.drawingJqCanvas.add(this.pdfJqCanvas);
        canvases
            .css("width", "")
            .css("height", "");

        canvases.css("width", width);
        if (canvases.height() > height) {
            canvases
                .css("width", "")
                .css("height", height);
        }
    }
}

export { ScorePage };