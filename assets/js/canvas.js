class Canvas {
  constructor(props) {
    this.canvas = {
      element: props.element
    };
    this.theme = props.theme;
    this.points = props.points;
    this.lines = props.lines;
    this.selectors = {
      viewport: '.canvas__viewport',
      ...props.selectors
    };
    this.classes = {
      point: 'canvas__point',
      line: 'canvas__line',
      ...props.classes
    };
    this.minX = Math.min(...this.points.map(point => point.x));
    this.maxX = Math.max(...this.points.map(point => point.x));
    this.minY = Math.min(...this.points.map(point => point.y));
    this.maxY = Math.max(...this.points.map(point => point.y));
  }

  generatePointElement(point) {
    const element = document.createElement('div');
    element.classList.add(this.classes.point);
    element.classList.add(`theme--${this.theme}`);
    element.style.left = `${(point.x)}px`;
    element.style.bottom = `${(point.y)}px`;
    return element;
  }

  generateLineElement(startPoint, endPoint) {
    const optimizeD = (d) => (startPoint.y <= endPoint.y) ? ((startPoint.x <= endPoint.x) ? (360 - d) : (180 + d)) : ((startPoint.x <= endPoint.x) ? d : (180 - d));
    const element = document.createElement('div');
    element.classList.add(this.classes.line);
    element.classList.add(`theme--${this.theme}`);
    element.style.left = `${startPoint.x}px`;
    element.style.bottom = `${startPoint.y}px`;
    element.style.width = `${calcHypotenuse((Math.abs(endPoint.x - startPoint.x)), (Math.abs(endPoint.y - startPoint.y)))}px`;
    element.style.transform = `translateY(50%) rotateZ(${optimizeD(radiansToDegrees(Math.atan(calcTangent(Math.abs(endPoint.y - startPoint.y), Math.abs(endPoint.x - startPoint.x)))))}deg)`;
    return element;
  }

  erase() {
    const viewport = this.canvas.element.querySelector(this.selectors.viewport);
    viewport.innerHTML = '';
    viewport.style.width = '';
    viewport.style.height = '';
    this.canvas.width = null;
    this.canvas.height = null;
    this.canvas.ratio = null;
  }

  draw() {
    const viewport = this.canvas.element.querySelector(this.selectors.viewport);
    this.canvas.width = this.canvas.element.offsetWidth;
    this.canvas.height = this.canvas.element.offsetHeight;
    this.canvas.ratio = Math.min((this.canvas.width / (this.maxX - this.minX)), (this.canvas.height / (this.maxY - this.minY)));
    viewport.style.width = `${(this.maxX - this.minX) * this.canvas.ratio}px`;
    viewport.style.height = `${(this.maxY - this.minY) * this.canvas.ratio}px`;

    const optimizeX = (x) => ((x - this.minX) * this.canvas.ratio);
    const optimizeY = (y) => ((y - this.minY) * this.canvas.ratio);
    const points = this.points.map(point => ({x: optimizeX(point.x), y: optimizeY(point.y)}));
    const lines = this.lines.map(line => ({startPoint: {x: optimizeX(line.startPoint.x), y: optimizeY(line.startPoint.y)}, endPoint: {x: optimizeX(line.endPoint.x), y: optimizeY(line.endPoint.y)}}));
    const fragment = document.createDocumentFragment();
    points.forEach(point => fragment.appendChild(this.generatePointElement(point)));
    lines.forEach(line => fragment.appendChild(this.generateLineElement(line.startPoint, line.endPoint)));
    viewport.appendChild(fragment);
  }
}