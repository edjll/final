let engine = new Engine(),
	groundWidth = 1024,
	groundHeight = 768,
	scale = engine.canvas.height / groundHeight;

engine.addGround(new Ground('./image/background/ground_1.png', groundWidth, groundHeight, scale));
engine.addGround(new Ground('./image/background/ground_2.png', groundWidth, groundHeight, scale));
engine.addGround(new Ground('./image/background/ground_3.png', groundWidth, groundHeight, scale));

engine.ground[1].render.position.x = engine.ground[0].render.position.x + groundWidth * scale;
engine.ground[2].render.position.x = engine.ground[1].render.position.x + groundWidth * scale;

engine.player = new Player('./image/hero/idle.png',   1501,  801,
						   './image/hero/run.png',    1000, 1600,
						   './image/hero/shot.png',   2751,  800,
						   './image/hero/jump.png',    250,  400,
						   './image/hero/death.png',  1250, 1200,
						   './image/hero/attack.png', 1250,  800,
						   './image/hero/hurt.png',   1250,  800,
						   20, engine.canvas.height * 0.59, scale);

engine.player.arrows = new Arrows('./image/hero/arrow.png', scale);

engine.interface = new Interface( './image/hero/avatar.png',
							   './image/skills/attack.png',
							   './image/skills/jump.png',
							   './image/skills/shoot.png',
							   './image/skills/arrows.png', 80, 80, 60, scale);

engine.bots = new Bots('./image/enemy/idle.png',   
					   './image/enemy/run.png',
					   './image/enemy/hurt.png',
					   './image/enemy/death.png',  
					   './image/enemy/attack.png',
					   './image/enemy/remove.png',
					  	engine.canvas.height * 0.67, scale);

engine.update = () => {

	if (!engine.player.hurtActive) {

		if (engine.player.input.shot) {
			if (engine.player.shotCooldown || engine.player.gravityActive || engine.player.attackActive || engine.player.threeArrowActive) {
				engine.player.input.shot = false;
			} else {
				if (engine.player.shot()) {
					engine.player.input.shot = false;
				}
				engine.player.input.jump = false;
			}
		}

		if (engine.player.input.threeArrow) {
			if (engine.player.threeArrowCooldown || engine.player.gravityActive || engine.player.attackActive || engine.player.shotActive || engine.player.input.shot) {
				engine.player.input.threeArrow = false;
			} else {
				if (engine.player.threeArrow()) {
					engine.player.input.threeArrow = false;
				}
				engine.player.input.jump = false;
			}
		}

		if (engine.player.input.attack) {
			if (engine.player.attackCooldown || engine.player.gravityActive || engine.player.input.shot || engine.player.shotActive || engine.player.attackCooldown || engine.player.input.threeArrow || engine.player.threeArrowActive) {
				engine.player.input.attack = false;
			} else {
				if (engine.player.attack()) {
					engine.player.input.attack = false;
				}
				engine.player.input.jump = false;
			}
		}

		if (engine.player.input.jump && !engine.player.attackActive) {
			if (engine.player.jumpCooldown) {
				engine.player.input.jump = false;
			} else {
				engine.player.jump();
				if (engine.player.jumpFrame == 20) {
					engine.player.input.jump = false;
					engine.player.jumpFrame = 0;
					engine.player.jumpCooldown = true;
					engine.player.jumpTimeCoolDownStart = engine.player.time;
				}
			}
		}

		if (engine.player.input.isKeyDown('ArrowLeft') && !(engine.player.input.shot 				&&  engine.player.shotActive)
													   && !(engine.player.input.attack 				||  engine.player.attackActive) 
													   && !(engine.player.input.isKeyDown('Space')  && !engine.player.gravityActive) 
													   && !(engine.player.input.threeArrow 			&&  engine.player.threeArrowActive)) {
			if (!engine.player.input.jump) {
				engine.player.frame     = 2;
			}

			engine.player.frameHurt		= 12;
			engine.player.frameJump		= 6;
			engine.player.frameIdle 	= 0;
			engine.player.frameShot 	= 4;
			engine.player.frameAttack  	= 10;
			engine.player.frameDeath 	= 8;
			
			engine.player.translate(-5 * scale, 0);

			if ((Math.floor(-engine.camera.x / groundWidth / scale)) % 3 == 0) {

				engine.ground[0].render.position.x = engine.ground[1].render.position.x - groundWidth * scale;

			} else if ((Math.floor(-engine.camera.x / groundWidth / scale)) % 3 == 1) {

				engine.ground[1].render.position.x = engine.ground[2].render.position.x - groundWidth * scale;

			} else if ((Math.floor(-engine.camera.x / groundWidth / scale)) % 3 == 2) {

				engine.ground[2].render.position.x = engine.ground[0].render.position.x - groundWidth * scale;

			}
		}

		if (engine.player.input.isKeyDown('ArrowRight') && !(engine.player.input.shot 				&&  engine.player.shotActive) 
												 		&& !(engine.player.input.attack 			||  engine.player.attackActive) 
												 		&& !(engine.player.input.isKeyDown('Space') && !engine.player.gravityActive) 
												 		&& !(engine.player.input.threeArrow 		&&  engine.player.threeArrowActive)) {
			if (!engine.player.input.jump) {
				engine.player.frame 	= 3;
			}

			engine.player.frameHurt		= 13;
			engine.player.frameJump		= 7;
			engine.player.frameIdle 	= 1;
			engine.player.frameShot 	= 5;
			engine.player.frameAttack  	= 11;
			engine.player.frameDeath 	= 9;

			engine.player.translate(5 * scale, 0);

			if ((Math.floor(-engine.camera.x / groundWidth / scale)) % 3 == 0) {
	 
				engine.ground[2].render.position.x = engine.ground[1].render.position.x + groundWidth * scale;

			} else if ((Math.floor(-engine.camera.x / groundWidth / scale)) % 3 == 1) {

				engine.ground[0].render.position.x = engine.ground[2].render.position.x + groundWidth * scale;

			} else if ((Math.floor(-engine.camera.x / groundWidth / scale)) % 3 == 2) {

				engine.ground[1].render.position.x = engine.ground[0].render.position.x + groundWidth * scale;

			}
		}

		if (	!engine.player.input.isKeyDown('ArrowLeft') 
			&& 	!engine.player.input.isKeyDown('ArrowRight') 
			&&  !engine.player.input.jump 
			&& 	!engine.player.input.shot 
			&& 	!engine.player.input.attack 
			&& 	!engine.player.input.threeArrow) {

			engine.player.frame = engine.player.frameIdle;
			engine.player.translate(0, 0);
		}

	}

	//camera position in window
	let localPosition = engine.getLocalPosition(engine.player);

	//player translate to left
	if (localPosition.x < engine.canvas.width * 0.2) {
		engine.camera.x += 5 * scale;
	}
	if (engine.camera.x > 0) {
		engine.camera.x  = 0;
	}

	//player translate to right
	if (localPosition.x > engine.canvas.width * 0.6) {
		engine.camera.x -= 5 * scale;
	}
}