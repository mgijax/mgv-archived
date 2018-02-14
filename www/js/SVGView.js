import { Component } from './Component';

// ---------------------------------------------
class SVGView extends Component {
  constructor (app, elt, width, height) {
    super(app, elt);
    this.svg = this.root.select("svg");
    this.svgMain = this.svg
          .append("g")    // the margin-translated group
          .append("g");	  // main group for the drawing
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
          .select("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);
  }
  // Args:
  //   the window width
  fitToWidth (width) {
      let r = this.svg[0][0].getBoundingClientRect();
      this.setSize(width - r.x)
  }

    //
    drawText (x, y, lines, classes) {
	let lineHeight = 14; // FIXME
	if (typeof(lines) === "string") lines = [lines];
	if (typeof(classes) === "string")
	    classes = [classes];
	else if (!classes)
	    classes = [];
        let content = lines.map((s,i) => {
	    let cls = classes[i] || classes[classes.length-1] || "";
	    return `<tspan x="${x}" y="${y + i*lineHeight}" class="${cls}">${s}</tspan>`;
	}).join('');
	this.title.html(content);
    }

} // end class SVGView

export { SVGView };
