import cv, { Mat, Rect } from "@techstark/opencv-js";
import { IPoint } from "src/interfaces/IPoint";

export type Matrix = Mat;
export type Rectangle = Rect;

export class MagicWandUtil {
  public static initMatrix() {
    return new cv.Mat();
  }

  public static initRectangle() {
    return new cv.Rect();
  }

  private static isPointInsideRect(
    rect: cv.Rect,
    x: number,
    y: number
  ): boolean {
    return (
      x >= rect.x &&
      x <= rect.x + rect.width &&
      y >= rect.y &&
      y <= rect.y + rect.height
    );
  }

  private static getContours(mask: cv.Mat): cv.MatVector {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    const contourInput = mask.clone();

    cv.findContours(
      contourInput,
      contours,
      hierarchy,
      cv.RETR_CCOMP,
      cv.CHAIN_APPROX_TC89_L1
    );

    let poly = new cv.MatVector();
    for (let i = 0; i < contours.size(); ++i) {
      let tmp = new cv.Mat();
      let cnt = contours.get(i);
      cv.approxPolyDP(cnt, tmp, 3, true);
      poly.push_back(tmp);
      cnt.delete();
      tmp.delete();
    }

    return poly;
  }

  private static removeOutliers(
    rect: cv.Rect,
    matVector: cv.MatVector
  ): cv.MatVector {
    const poly = matVector.clone();

    for (let i = 0; i < poly.size(); i++) {
      let c = poly.get(i);
      for (let j = 0; j < c.data32S.length; j += 2) {
        if (
          c.data32S[j] < rect.x ||
          c.data32S[j] > rect.x + rect.width ||
          c.data32S[j + 1] < rect.y ||
          c.data32S[j + 1] > rect.y + rect.height
        ) {
          c.data32S[j] = 0;
          c.data32S[j + 1] = 0;
        }
      }
    }

    return poly;
  }

  private static getOutline(
    mask: cv.Mat,
    rect: cv.Rect,
    poly: cv.MatVector
  ): IPoint[] {
    let mask1 = new cv.Mat(mask.rows, mask.cols, cv.CV_8U, new cv.Scalar(0));

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.fillPoly(mask1, poly, new cv.Scalar(255));
    cv.findContours(
      mask1,
      contours,
      hierarchy,
      cv.RETR_EXTERNAL,
      cv.CHAIN_APPROX_SIMPLE
    );

    let approxPoly: IPoint[] = [];
    for (let i = 0; i < contours.size(); i++) {
      let c = contours.get(i);
      for (let j = 0; j < c.data32S.length; j += 2) {
        const x = c.data32S[j];
        const y = c.data32S[j + 1];
        if (this.isPointInsideRect(rect, x, y)) {
          approxPoly.push({ x, y });
        }
      }
    }

    return approxPoly;
  }

  private static removeDuplicates(rect: cv.Rect, points: IPoint[]): IPoint[] {
    const center = {
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
    } as IPoint;
    const result = [];
    const groups = [];

    for (let i = 0; i < points.length; i++) {
      let found = false;
      for (let j = 0; j < groups.length; j++) {
        if (
          Math.abs(points[i].x - groups[j][0].x) < 10 &&
          Math.abs(points[i].y - groups[j][0].y) < 10
        ) {
          groups[j].push(points[i]);
          found = true;
          break;
        }
      }
      if (!found) {
        groups.push([points[i]]);
      }
    }

    for (let i = 0; i < groups.length; i++) {
      let minDist = 1000000;
      let minIndex = -1;
      for (let j = 0; j < groups[i].length; j++) {
        const dist = Math.sqrt(
          Math.pow(center.x - groups[i][j].x, 2) +
            Math.pow(center.y - groups[i][j].y, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          minIndex = j;
        }
      }
      result.push(groups[i][minIndex]);
    }

    return result;
  }

  private static findExteriorContour(mask: cv.Mat, rect: cv.Rect): IPoint[] {
    const contourPoly = this.getContours(mask);
    const updatedPoly = this.removeOutliers(rect, contourPoly);
    const points = this.getOutline(mask, rect, updatedPoly);
    const deduplicatedPoints = this.removeDuplicates(rect, points);

    contourPoly.delete();
    updatedPoly.delete();
    return deduplicatedPoints;
  }

  public static editSelection(
    imageElement: HTMLImageElement,
    startPoint: IPoint,
    mask: cv.Mat,
    rect: cv.Rect,
    tolerance: number,
    modifier?: "add" | "remove"
  ): { mask: cv.Mat; rect: cv.Rect; path: IPoint[] } {
    const { x, y } = startPoint;

    const img = cv.imread(imageElement);
    const floodMask = cv.Mat.zeros(img.rows + 2, img.cols + 2, cv.CV_8U);
    const imageMatrix = new cv.Mat(img.cols, img.rows, cv.CV_8U);

    cv.cvtColor(img, imageMatrix, cv.COLOR_RGBA2RGB);

    let newRect = new cv.Rect();

    cv.floodFill(
      imageMatrix,
      floodMask,
      new cv.Point(x, y),
      cv.Scalar.all(255),
      newRect,
      cv.Scalar.all(tolerance),
      cv.Scalar.all(tolerance),
      4 | cv.FLOODFILL_FIXED_RANGE | cv.FLOODFILL_MASK_ONLY | (255 << 8)
    );

    if (modifier) {
      rect = new cv.Rect(
        Math.min(rect.x, newRect.x),
        Math.min(rect.y, newRect.y),
        Math.max(rect.x + rect.width, newRect.x + newRect.width) -
          Math.min(rect.x, newRect.x),
        Math.max(rect.y + rect.height, newRect.y + newRect.height) -
          Math.min(rect.y, newRect.y)
      );
    } else {
      rect = newRect;
    }

    const maskClone = mask.clone();
    const floodMaskClone = floodMask.clone();

    if (modifier === "add") {
      cv.bitwise_or(maskClone, floodMaskClone, mask);
    } else if (modifier === "remove") {
      const invertedFloodMask = new cv.Mat();
      cv.bitwise_not(floodMaskClone, invertedFloodMask);
      cv.bitwise_and(maskClone, invertedFloodMask, mask);
    } else {
      mask = floodMaskClone;
    }

    return { mask, rect, path: this.findExteriorContour(mask, rect) };
  }

  public static getSelection(
    imageElement: HTMLImageElement,
    startPoint: IPoint,
    mask: cv.Mat,
    rect: cv.Rect,
    tolerance: number
  ): { mask: cv.Mat; rect: cv.Rect; path: IPoint[] } {
    return this.editSelection(imageElement, startPoint, mask, rect, tolerance);
  }
}
