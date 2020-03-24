
import {Overlay} from "../overlay/overlay";
import {jsPlumbInstance, PointArray, PointXY} from "../core";
import {Component} from "../component/component";

interface HTMLElementOverlayHolder extends Overlay<HTMLElement> {
    canvas:HTMLElement;
    cachedDimensions:PointArray;
} 

export class HTMLElementOverlay {

    protected htmlElementOverlay:HTMLElementOverlayHolder;

    constructor(public instance:jsPlumbInstance<HTMLElement>, public overlay: Overlay<HTMLElement>) { 
        this.htmlElementOverlay = overlay as HTMLElementOverlayHolder;
    }

    static createElement(o:HTMLElementOverlayHolder):HTMLElement {
        return o.instance.createElement("div", {}, o.instance.overlayClass + " " +
            (o.cssClass ? o.cssClass : ""));
    }

    static getElement (o:HTMLElementOverlayHolder, component?:Component<HTMLElement>, elementCreator?:(c:Component<HTMLElement>) => HTMLElement):HTMLElement {
        if (o.canvas == null) {

            if (elementCreator && component) {
                o.canvas = elementCreator(component);
            } else {
                o.canvas = HTMLElementOverlay.createElement(o);
            }

            o.canvas.style.position = "absolute";
            o.instance.appendElement(o.canvas, o.instance.getContainer());
            o.instance.getId(o.canvas);
            
            let ts = "translate(-50%, -50%)";
            (<any>o.canvas.style).webkitTransform = ts;
            (<any>o.canvas.style).mozTransform = ts;
            (<any>o.canvas.style).msTransform = ts;
            (<any>o.canvas.style).oTransform = ts;
            (<any>o.canvas.style).transform = ts;
    
            if (!o.isVisible()) {
                o.canvas.style.display = "none";
            }

            (<any>o.canvas).jtk = { overlay:o };

        }

        return o.canvas;
    }

    static destroy(o:HTMLElementOverlayHolder) {
        const el = HTMLElementOverlay.getElement(o as any);
        el.parentNode.removeChild(el);
        delete o.canvas;
        delete o.cachedDimensions;
    }

    static _getDimensions(o:HTMLElementOverlayHolder, forceRefresh?:boolean):PointArray {
        if (o.cachedDimensions == null || forceRefresh) {
            o.cachedDimensions = [1,1];
        }
        return o.cachedDimensions;
    }
}
