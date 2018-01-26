import * as $ from "jquery";
import { line } from "./models/line";
import * as fabric from "fabric";

// const $ = jQuery;

const lines: line[] = [];
const dragging: boolean = false;
const canvas = new fabric.Canvas("canvas");
const rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: "red",
    width: 20,
    height: 20,
});

canvas.add(rect);
