/* global fabric */

import { formatDuration } from "./utils.js";
import signals from "./signals.js";

export default class BlockGui {
  constructor(block, color, canvas, pixelsPerHour) {
    const offset = 10;
    const pixelsPer15 = pixelsPerHour / 4;
    var rect = new fabric.Rect({
      left: block.start * pixelsPerHour,
      top: offset + 35,
      originX: "left",
      originY: "top", 
      width: block.duration * pixelsPerHour,
      height: 60,
      fill: color, 
      hasRotatingPoint: false,
      lockSkewingY: true,
      lockMovementY: true,
      lockScalingFlip: true,
      transparentCorners: false,
      objectCaching: false
    });
    rect.setControlsVisibility({
      ml: false, 
      mb: false,
      mt: false,
      tr: false,
      tl: false,
      bl: false,
      br: false
    }); 
    canvas.add(rect);
    var time = new fabric.Text('', {
      fontSize: 12,
      fontFamily: "sans-serif",
      hasControls: false,
      originX: 'left',
      top: offset,
      angle: 60,
      textAlign: 'center' 
    });
    canvas.add(time);
    var duration = new fabric.Text('', {
      fontSize: 14,
      fontFamily: "sans-serif",
      hasControls: false,
      originX: 'center',
      top: offset + 60,
      textAlign: 'center' 
    });
    canvas.add(duration);
    var label = new fabric.Text(block.label, {
      fontSize: 14,
      fontFamily: "sans-serif",
      hasControls: false,
      top: offset + 100,
      angle: 60
    }); 
    canvas.add(label);
    function updateText() {
      const start = rect.left + 12;
      const mid = rect.left + rect.getScaledWidth() / 2 -2;
      duration.left = mid;
      label.left = start; 
      time.left = start; 
      time.text = `${Math.floor(block.start)}:${Math.round(block.start % 1 * 60) || '00'}`;
      duration.text = block.duration === 0.25 ? '' : formatDuration(block.duration);
    }
    updateText();
    function snapLeft() {
      const snappedLeft = Math.round(rect.left / pixelsPer15) * pixelsPer15 / pixelsPerHour;
      block.start = Math.min(24 - block.duration, Math.max(0, snappedLeft));
      rect.left = block.start * pixelsPerHour;
    }
    rect.on("moving", snapLeft);
    rect.on("moving", updateText);
    rect.on("moved", signals.blockChanged.dispatch);
    function snapWidth() {
      const snappedWidth = Math.round(rect.getScaledWidth() / pixelsPer15) * pixelsPer15 / pixelsPerHour;
      block.duration = Math.min(24 - block.start, Math.max(0.25, snappedWidth));
      rect.scaleX = 1;
      rect.width = block.duration * pixelsPerHour;
    }
    rect.on("scaling", snapWidth);
    rect.on("scaling", updateText);
    rect.on("scaled", signals.blockChanged.dispatch);
    rect.on("mousedblclick", () => {
      signals.blockRemoved.dispatch();
      canvas.remove(rect); 
      canvas.remove(label);
      canvas.remove(time);
      canvas.remove(duration);
    })
  }
}