class Client {
    constructor(x, y, size, acceleration, deceleration, maxSpeed, rotationSpeed) {
    	this.pos = createVector(x, y);
    	this.size = size;
    	this.acceleration = acceleration;
    	this.deceleration = deceleration;
    	this.maxSpeed = maxSpeed;
    	this.currentSpeed = createVector(0, 0);
    	this.angle = 0;
    	this.rotationSpeed = rotationSpeed;
    }
  
    handleInput() {
		let localAcceleration = createVector(0, 0);
		let speed = this.currentSpeed.mag();
	
		if (keyIsDown(37)) {
			this.angle -= this.rotationSpeed * (speed / this.maxSpeed);
		}
		if (keyIsDown(39)) {
			this.angle += this.rotationSpeed * (speed / this.maxSpeed);
		}
		if (keyIsDown(38)) {
			localAcceleration.y -= (this.acceleration + speed * 0.1) * dt;
		}
		if (keyIsDown(40)) {
			localAcceleration.y += (this.acceleration + speed * 0.1) * dt;
		}
	
		if (!keyIsDown(38) && !keyIsDown(40)) {
			let currentSpeedDirection = this.currentSpeed.copy().normalize();
			let decelerationMagnitude = (this.deceleration + speed * 0.1) * dt;
			let decelerationVector = currentSpeedDirection.mult(decelerationMagnitude);
	
			this.currentSpeed.sub(decelerationVector);
		}
	
		let rotationVector = createVector(cos(this.angle), sin(this.angle));

		let speedFactor = 0.0000000001;
		let turningRadius = this.size / (tan(this.rotationSpeed / 2) * sqrt(1 + speed * speed * speedFactor));
	
		let radialAcceleration = p5.Vector.mult(rotationVector, localAcceleration.y);
		radialAcceleration.rotate(HALF_PI);
		radialAcceleration.setMag(turningRadius);
		radialAcceleration.limit((this.acceleration + speed * 0.1) * dt);
	
		this.currentSpeed.add(radialAcceleration);
		this.currentSpeed.limit(this.maxSpeed);
	
		this.pos.add(p5.Vector.mult(this.currentSpeed, dt));
	}
	
	
  
    display() {
    	push();
    	rectMode(CENTER);
    	translate(this.pos.x, this.pos.y);
    	rotate(this.angle);
    	square(0, 0, this.size);
    	pop();
    }
}