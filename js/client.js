

class Client {
    constructor(x, y, size, acceleration, deceleration, maxSpeed, rotationSpeed, speedMultiplier, name) {
    	this.pos = createVector(x, y);
    	this.size = size;
    	this.acceleration = acceleration;
    	this.deceleration = deceleration;
    	this.maxSpeed = maxSpeed;
    	this.currentSpeed = createVector(0, 0);
    	this.angle = 0;
    	this.rotationSpeed = rotationSpeed;
		this.speedMultiplier = speedMultiplier;
		this.prevPos = createVector(x, y);
		this.prevAngle = this.angle;
		this.name = name;
    }

	broadcastData(open) {
        // Check if position or angle has changed
		if (open) {
			const data = {
				type: 'newPlayer',
				name: this.name,
				pos: this.pos,
				angle: this.angle
			};
			socket.emit(JSON.stringify(data));
		} else if (this.pos.x !== this.prevPos.x || this.pos.y !== this.prevPos.y || this.angle !== this.prevAngle) {
            const data = {
				type: 'updatePlayer',
				name: this.name,
                pos: this.pos,
                angle: this.angle
            };

            // Send updated data to the server
            socket.emit(JSON.stringify(data));

            // Update previous position and angle
            this.prevPos.set(this.pos);
            this.prevAngle = this.angle;
        }
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

		if (Math.abs(this.currentSpeed.mag()) < 1) {
			this.currentSpeed.setMag(0);
		}
	
		this.pos.add(p5.Vector.mult(p5.Vector.mult(this.currentSpeed, dt), 2 * this.speedMultiplier));
	}
	
	
  
    display() {
    	push();
    	rectMode(CENTER);
    	translate(this.pos.x, this.pos.y);
    	rotate(this.angle);
    	//image(carSprite, 0, 0, this.size, this.size)
		square(0, 0, this.size);
		line(0, 0, 0, -this.size / 2);
    	pop();

		//handle data broadcast
		this.broadcastData(false);
    }
}