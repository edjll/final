class Bot {
	constructor(imageIdle,   imageIdleWidth,   imageIdleHeight, 
				imageRun,    imageRunWidth,    imageRunHeight,
				imageHurt,   imageHurtWidth,	  imageHurtHeight,
				imageDeath,  imageDeathWidth,  imageDeathHeight,
				imageAttack, imageAttackWidth, imageAttackHeight,
				imageResurrection, imageResurrectionWidth, imageResurrectionHeight,
				x, y, scale) {
		this.position = new Vector(x, y);

		this.frame 			= 10;
		this.frameAttack 	= 9;
		this.frameIdle 		= 1;
		this.frameDeath 	= 7;
		this.frameHurt 		= 5;

		this.stepTranslate = 2;

		this.scale = scale;

		this.render = [
							new Render(imageIdle,   this.position.x, this.position.y, imageIdleWidth,   imageIdleHeight,   this.scale,   0, 11,  4, 6, 10),  // 0  left  idle
							new Render(imageIdle,   this.position.x, this.position.y, imageIdleWidth,   imageIdleHeight,   this.scale,  12, 11,  4, 6, 10),  // 1  right idle
							new Render(imageRun,    this.position.x, this.position.y, imageRunWidth,    imageRunHeight,    this.scale,   0, 15,  4, 8, 10),  // 2  left  run
							new Render(imageRun,    this.position.x, this.position.y, imageRunWidth,    imageRunHeight,    this.scale,  16, 15,  4, 8, 10),  // 3  right run
							new Render(imageHurt,   this.position.x, this.position.y, imageHurtWidth,   imageHurtHeight,   this.scale,   0, 11,  4, 6, 10),  // 4  left  hurt
							new Render(imageHurt,   this.position.x, this.position.y, imageHurtWidth,   imageHurtHeight,   this.scale,  12, 11,  4, 6, 10),  // 5  right hurt
							new Render(imageDeath,  this.position.x, this.position.y, imageDeathWidth,  imageDeathHeight,  this.scale,   0, 11,  4, 6, 10),  // 6  left  death
							new Render(imageDeath,  this.position.x, this.position.y, imageDeathWidth,  imageDeathHeight,  this.scale,  12, 11,  4, 6, 10),  // 7  right death
							new Render(imageAttack, this.position.x, this.position.y, imageAttackWidth, imageAttackHeight, this.scale,   0, 11,  4, 6, 10),  // 8 left  attack
							new Render(imageAttack, this.position.x, this.position.y, imageAttackWidth, imageAttackHeight, this.scale,  12, 11,  4, 6, 10),  // 9 right attack
							new Render(imageResurrection, this.position.x, this.position.y, imageResurrectionWidth, imageResurrectionHeight, this.scale,  0, 11,  4, 3, 10),  //10 left  resurrection
						];

		this.render[10].position.x = this.position.x - this.render[this.frame - this.frame % 2].frameWidth * this.scale * 0.6;

		this.cooldown = false;
		this.timeCooldownStart = undefined;
		this.timeCooldownEnd = undefined;

		this.attackActive = false;

		this.hurtActive = false;
		this.hurtHp = 0;

		this.hp = 30;

		this.deathActive = false;

		this.score = 100;
	}

	attack() {
		if (!this.cooldown) {
			if (this.render[this.frameAttack].last) {
				this.render[this.frameAttack].last = false;
				this.cooldown = true;
				this.attackActive = false;
				this.timeCooldownStart = performance.now();
				this.render[this.frame].point = true;
			} else {
				this.attackActive = true;
				this.frame = this.frameAttack;
			}
		} else {
			this.timeCooldownEnd = performance.now()
			this.frame = this.frameIdle;
			this.cooldownReset();
		}
	}

	cooldownReset() {
		if (this.timeCooldownEnd > this.timeCooldownStart + 2000) {
			this.cooldown = false;
		}
	}

	hurt(x, hp, width, player) {
		if (x + width * this.scale > this.render[this.frame].position.x + this.render[this.frame - this.frame % 2].frameWidth * this.scale * 0.6 && x < this.render[this.frame].position.x + this.render[this.frame - this.frame % 2].frameWidth * this.scale * 0.4) {
			if (!this.hurtActive) {
				this.hurtHp = hp;
			}
			if (this.hp <= this.hurtHp) {
				if (this.deathActive) {
					this.score = 0;
				}
				this.deathActive = true;
			} else {
				this.hurtAnimation();
			}
			return true;
		} else {
			return false;
		}
	}

	hurtAnimation() {
		if (this.render[this.frameHurt].last) {
			this.hurtActive = false;
			this.render[this.frameHurt].last = false;
		} else {
			if (this.frame != this.frameHurt) {
				this.render[this.frame].frame = this.render[this.frame].frameStart;
			}
			if (this.hurtHp > 0 && this.hp > 0) {
				this.hp -= 1;
				this.hurtHp -= 1;
			}
			this.hurtActive = true;
			this.frame = this.frameHurt;
			this.render[this.frame].position.x = this.position.x;
			this.render[this.frame - this.frame % 2].position.x = this.position.x - this.render[this.frame - this.frame % 2].frameWidth * this.scale * 0.6;
		}
	}

	look(x, width) {
		if (this.position.x + this.render[this.frame].frameWidth * 0.95 > x + width) {
			if (this.frameAttack != 8) {
				this.render[this.frame].frame = this.render[this.frame].frameStart;
			}
			this.frameAttack 	= 8;
			this.frameIdle 		= 0;
			this.frameDeath 	= 6;
			this.frameHurt 		= 4;
		} else if (this.position.x - this.render[this.frame].frameWidth * 0.1 < x) {
			if (this.frameAttack != 9) {
				this.render[this.frame].frame = this.render[this.frame].frameStart;
			}
			this.frameAttack 	= 9;
			this.frameIdle 		= 1;
			this.frameDeath 	= 7;
			this.frameHurt 		= 5;
		}
	}

	death(bots) {
		if (this.render[this.frameDeath].controlFrame) {
			if (bots.indexOf(this) != -1) {
				bots.splice(bots.indexOf(this), 1);
			}
		} else {
			if (this.hurtHp > 0 && this.hp > 0) {
				this.hp -= 1;
				this.hurtHp -= 1;
			}
			this.deathActive = true;
			this.frame = this.frameDeath;
			this.render[this.frame].position.x = this.position.x;
			this.render[this.frame - this.frame % 2].position.x = this.position.x - this.render[this.frame - this.frame % 2].frameWidth * this.scale * 0.6;
		}
	}

	translate(x, width) {
		if (!this.hurtActive) {
			this.deltaRight = Math.floor((this.position.x + 10 * this.scale - (x + width * this.scale * 0.5)) / this.stepTranslate);
			this.deltaLeft = Math.floor((x + 10 * this.scale - (this.position.x + this.render[this.frame].frameWidth * this.scale * 0.5)) / this.stepTranslate);
			if ((this.render[this.frame].position.x <= x && this.render[this.frame].position.x + this.render[this.frame].frameWidth * this.scale * 0.5 >= x) || (
				 this.render[this.frame].position.x >= x && this.render[this.frame].position.x + this.render[this.frame].frameWidth * this.scale * 0.23 <= x + width * this.scale * 0.5) || this.attackActive) {
				this.attack();
			} else {
				if (this.deltaLeft > 0) {
					this.frame = 3;
					this.position.x += this.stepTranslate;
				} else if (this.deltaRight > 0) {
					this.frame = 2;
					this.position.x -= this.stepTranslate;
				} else {
					this.frame = 1;
				}
				if (this.position.x < 0) {
					this.position.x = 0;
				}
			}
			this.render[this.frame].position.x = this.position.x;
			this.render[this.frame - this.frame % 2].position.x = this.position.x - this.render[this.frame].frameWidth * this.scale * 0.6;
		}
	}

	resurrection() {
		if (this.render[10].controlFrame) {
			return true;
		}
		return false;
	}

	draw(ctx, x, y, width, bots) {

		if (this.hurtActive) {
			this.hurtAnimation();
		}

		if (this.deathActive) {
			this.death(bots);
		}
		
		if (!this.deathActive && this.resurrection()) {
			this.translate(x, width);
		}
		this.render[this.frame].draw(ctx);

		this.look(x, width);

		
		let hpFill = ctx.createLinearGradient(this.render[this.frame].position.x + this.render[this.frame].frameWidth * this.scale * 0.5 * Math.abs(~this.frame % 2) + 20 * this.scale, this.render[this.frame].position.y + 15 * this.scale,
										  	  this.render[this.frame].position.x + this.render[this.frame].frameWidth * this.scale * 0.5 * Math.abs(~this.frame % 2) + 20 * this.scale, this.render[this.frame].position.y + 8 + 15 * this.scale);

		hpFill.addColorStop(0, "#d8263f");
		hpFill.addColorStop(1, "#5f111c");

		ctx.fillStyle = hpFill;

		ctx.fillRect(this.render[this.frame].position.x + this.render[this.frame].frameWidth * this.scale * 0.5 * Math.abs(~this.frame % 2) + 20 * this.scale, this.render[this.frame].position.y + 15 * this.scale, this.hp * 1.8 * this.scale,  8 * this.scale);

		ctx.fillStyle = 'black';

		ctx.fillRect(this.render[this.frame].position.x + this.render[this.frame].frameWidth * this.scale * 0.5 * Math.abs(~this.frame % 2) + 20 * this.scale + this.hp * 1.8 * this.scale, this.render[this.frame].position.y + 15 * this.scale, (30 - this.hp) * 1.8 * this.scale,  8 * this.scale);
	}
}