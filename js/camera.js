class Camera {
    constructor(lerpAmount, zoom) {
        this.pos = createVector(0, 0);
        this.lerpAmount = lerpAmount;
        this.zoom = zoom;
    }
  
    follow(target) {
        this.pos.x = lerp(this.pos.x, target.pos.x, this.lerpAmount);
        this.pos.y = lerp(this.pos.y, target.pos.y, this.lerpAmount);
    }

    zoomTo(value) {
        this.zoom += 0.5;
        this = max( 0, min(this.zoom, value) )
    }
}
