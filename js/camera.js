class Camera {
    constructor(lerpAmount) {
        this.pos = createVector(0, 0);
        this.lerpAmount = lerpAmount;
    }
  
    follow(target) {
        this.pos.x = lerp(this.pos.x, target.pos.x, this.lerpAmount);
        this.pos.y = lerp(this.pos.y, target.pos.y, this.lerpAmount);
    }
}