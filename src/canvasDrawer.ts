/// <reference path="../node_modules/@types/easeljs/index.d.ts" />

import * as $ from "jquery";
import { line } from "./models/line";

// const $ = jQuery;
$(document).ready(() => {

    // Add interface things
    let jqCanvas = $("#canvas");

    let optionsDiv = $("<div>");
    jqCanvas.before(optionsDiv);

    let devDiv = $("<div>");
    jqCanvas.after(devDiv);

    let colorDiv = $("<div>").html("Colors: ");
    optionsDiv.append(colorDiv);
    let sizeDiv = $("<div>").html("Sizes: ");
    optionsDiv.append(sizeDiv);
    let otherOptionsDiv = $("<div>");
    optionsDiv.append(otherOptionsDiv);

    colorDiv.append(buildButton("Black", () => changeColor("Black")));
    colorDiv.append(buildButton("Blue", () => changeColor("Blue")));

    sizeDiv.append(buildButton("Small", () => changeSize(2)));
    sizeDiv.append(buildButton("Normal", () => changeSize(5)));
    sizeDiv.append(buildButton("Large", () => changeSize(8)));

    otherOptionsDiv.append(buildButton("Clear Stage", () => clearStage()));


    let lines: line[] = [];
    const circlesForLines: createjs.Shape[] = [];
    const dragging: boolean = false;

    var stage = new createjs.Stage("canvas");
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    stage.addChild(circle);

    updateStage();

    let mouseDown: boolean = false;
    stage.on("stagemousedown", (event: any) => {
        mouseDown = true;
        startNewStageLine(event.stageX, event.stageY, currentSize, currentColor);
    });

    stage.on("stagemousemove", (event: any) => {
        if (mouseDown) {
            endNewStageLine(event.stageX, event.stageY);
            startNewStageLine(event.stageX, event.stageY, currentSize, currentColor);
        }
    })

    stage.on("stagemouseup", (event: any) => {
        mouseDown = false;
        endNewStageLine(event.stageX, event.stageY);
    })

    function drawStageCircle(x: number, y: number, radius: number, color: string) {
        var newCircle = new createjs.Shape();
        newCircle.graphics
            .beginFill("black")
            .drawCircle(x, y, radius);
        stage.addChild(newCircle);
        updateStage();
    }

    let startedLine: createjs.Shape = null;
    let startedSavedLine: line = null;
    function startNewStageLine(x: number, y: number, radius: number, color: string){
        if(startedLine !== null){
            console.log("startedLine is not null");
            return;
        }

        startedLine = new createjs.Shape();
        startedLine.graphics.beginStroke(color);
        startedLine.graphics.setStrokeStyle(radius, 'round', 'round');
        startedLine.graphics.moveTo(x, y);

        startedSavedLine = {
            radius: radius,
            color: color,
            startX: x,
            startY: y,
        }
    }

    function endNewStageLine(x: number, y: number){
        if(startedLine === null){
            console.log("startedLine is null")
            return;
        }
        
        startedLine.graphics.lineTo(x, y);

        let minX = Math.min(startedSavedLine.startX, x) - startedSavedLine.radius;
        let minY = Math.min(startedSavedLine.startY, y) - startedSavedLine.radius;
        let width = Math.max(startedSavedLine.startX, x) + startedSavedLine.radius;
        let height = Math.max(startedSavedLine.startY, y) + startedSavedLine.radius;
        startedLine.cache(minX, minY, width, height);
        stage.addChild(startedLine);

        startedSavedLine.endX = x;
        startedSavedLine.endY = y;
        lines.push(startedSavedLine);

        updateStage();

        startedLine = null;
        startedSavedLine = null;
    }

    function clearStage() {
        stage.removeAllChildren();
        stage.update();
        lines = [];
    }

    // Interface Functions
    let currentColor: string = "black";
    let currentSize: number = 5;

    function changeColor(color: string){
        currentColor = color;
    }

    function changeSize(size: number) {
        currentSize = size;
    }

    function buildButton(text: string, functionToCall: JQuery.EventHandler<HTMLElement, null>): JQuery<HTMLElement>{
        return $("<button>")
            .html(text)
            .click(functionToCall);
    }

    function updateStage() {
        stage.update();
        // devDiv.html(JSON.stringify(lines));
    }
});