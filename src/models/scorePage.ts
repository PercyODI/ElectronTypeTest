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
    // public onChange: Array<() => void> = [];
    private originalSize: ISize;

    constructor(pdfPage: PDFPageProxy) {
        this.pdfPage = pdfPage;
        this.setupDOM();
        this.setupPdfAndDrawingCanvas();
        // this.fireChange();
    }

    public resize(width: number, height: number): void {
        const viewport = this.pdfPage.getViewport(1);
        const scale = Math.min(width / viewport.width, height / viewport.height);

        this.removeDOM();
        this.setupDOM();
        this.setupPdfAndDrawingCanvas(scale);
        // this.fireChange();
    }

    // public bindToChangeEvent(functionToAdd: () => void): void {
    //     this.onChange.push(functionToAdd);
    // }

    // private fireChange(): void {
    //     this.onChange.forEach((functionToCall) => {
    //         functionToCall();
    //     });
    // }

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

        this.drawingJqCanvas.attr("height", Math.floor(viewport.height));
        this.drawingJqCanvas.attr("width", Math.floor(viewport.width));
        // drawingCanvas.height = this.originalSize.height;
        // drawingCanvas.width = this.originalSize.width;
        // this.drawingJqCanvas.css("width", Math.floor(viewport.width));

        // Set both the PDF and Drawing positions to absolute (0, 0)
        this.setCanvasPositionToAbsolute0();

        // Set the wrapping div to the width of the PDF
        // (for alignment reasons)
        this.scoreWrapper.width(viewport.width);

        const drawingCanvas = (this.drawingJqCanvas.get(0) as HTMLCanvasElement);
        this.drawingStage = new createjs.Stage(drawingCanvas) as createjs.Stage;
        this.drawingStage.scaleX = scale;
        this.drawingStage.scaleY = scale;
        this.drawingStage.update();
    }

    private setupDOM() {
        if (this.scoreWrapper === undefined || this.scoreWrapper === null) {
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
        this.scoreWrapper.empty();
        this.pdfJqCanvas = undefined;
        this.drawingJqCanvas = undefined;
        this.drawingStage = undefined;
    }
}

export { ScorePage };
