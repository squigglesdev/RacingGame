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
        const newZoom = constrain(value, 50, 300); // Set the maximum zoom level as needed
        const factor = newZoom / this.zoom;
        
        // Adjust the position to keep the target centered
        this.pos.x -= (width / 2 - this.pos.x) * (factor - 1);
        this.pos.y -= (height / 2 - this.pos.y) * (factor - 1);
    
        this.zoom = newZoom;
    }
    
}
