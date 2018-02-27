import { Component } from './Component';

// ---------------------------------------------
class SVGView extends Component {
    constructor (app, elt, width, height) {
        super(app, elt);
        this.svg = this.root.select("svg");
        this.svgMain = this.svg
            .append("g")    // the margin-translated group
            .append("g")	  // main group for the drawing
	    .attr("name","svgmain");
        this.setSize(width, height, {top: 20, right: 10, bottom: 20, left: 10});
    }
    setSize (width, height, margin) {
        this.outerWidth  = width  || this.outerWidth;
        this.outerHeight = height || this.outerHeight;
        this.margin      = margin || this.margin;
        //
        this.width  = this.outerWidth  - this.margin.left - this.margin.right;
        this.height = this.outerHeight - this.margin.top  - this.margin.bottom;
        //
        this.svg.attr("width", this.outerWidth)
              .attr("height", this.outerHeight)
            .select('g[name="svgmain"]')
              .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
    }
    // Args:
    //   the window width
    fitToWidth (width) {
        let r = this.svg[0][0].getBoundingClientRect();
        this.setSize(width - r.x)
    }

} // end class SVGView

export { SVGView };
