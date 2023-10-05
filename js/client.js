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

    	if (keyIsDown(37)) {
    	  this.angle -= this.rotationSpeed; // Turn left
    	}
    	if (keyIsDown(39)) {
    	  this.angle += this.rotationSpeed; // Turn right
    	}
    	if (keyIsDown(38)) {
    	  localAcceleration.y -= this.acceleration * dt; // Accelerate forward
    	}
    	if (keyIsDown(40)) {
    	  localAcceleration.y += this.acceleration * dt; // Accelerate backward
    	}

    	// Deceleration when no keys are pressed
    	if (!keyIsDown(38) && !keyIsDown(40)) {
    	  let currentSpeedDirection = this.currentSpeed.copy().normalize();
    	  let decelerationMagnitude = this.deceleration * dt;
    	  let decelerationVector = currentSpeedDirection.mult(decelerationMagnitude);

    	  // Apply deceleration in the opposite direction of the current speed
    	  this.currentSpeed.sub(decelerationVector);
    	}

    	let rotationVector = createVector(cos(this.angle), sin(this.angle));
    	let turningRadius = this.size / tan(this.rotationSpeed / 2);
	
    	let radialAcceleration = p5.Vector.mult(rotationVector, localAcceleration.y);
    	radialAcceleration.rotate(HALF_PI); // Rotate by 90 degrees for perpendicular direction
    	radialAcceleration.setMag(turningRadius);
    	    if (!(keyIsDown(37) || keyIsDown(39)) || keyIsDown(SHIFT)) {
    	        console.log("limiting");
    	        radialAcceleration.limit(this.acceleration * dt);
    	    }

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