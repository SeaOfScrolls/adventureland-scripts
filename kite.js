//Functions for use in basic pathfinding and kiting, rewritten to experiment around with using ChatGPT to write code

const moveDist = 100;
const step = .25;
const maxSteps = 8;

//function to determine if an enemy can attack a theoretical character object at coordinates newX, newY
function targetCanAttack(target, newX, newY){
    let ch = {'x': newX, 'y': newY, 'width': 54, 'height': 68};
    if(target.range > distance(target, ch)){
        return true
    }
    return false;
}

function findAngle(target) {
    // Calculate the differences in the x and y coordinates
    let dx = character.x - target.x;
    let dy = character.y - target.y;
  
    // Calculate the angle between the two points using Math.atan2()
    let angle = Math.atan2(dy, dx);
  
    // Return the angle in radians
	console.log(angle+' dx:'+dx+' dy:'+dy);
    return angle;
  }

function getCoordinatesAtDistance(angle, dist) {
    let x = dist * Math.cos(angle);
    let y = dist * Math.sin(angle);
    return [character.x + x, character.y + y];
  }

function findNearestAngle(step, maxSteps, dist) {
  let target = get_targeted_monster();
  let angle = findAngle(target);
  let currentAngle = angle;
  
  // Check the initial angle
  let initialCoords = getCoordinatesAtDistance(currentAngle, dist);
  if (can_move_to(initialCoords[0], initialCoords[1]) && !targetCanAttack(target, initialCoords[0], initialCoords[1])) {
    return initialCoords;
  }

  // Check angles sequentially above and below the initial angle
  for (let i = 0; i <= maxSteps; i++) {
    // Check angle above the initial angle
    let angleAbove = currentAngle + i * step;
    if (angleAbove >= 2 * Math.PI) {
      angleAbove -= 2 * Math.PI;
    }
    let coordsAbove = getCoordinatesAtDistance(angleAbove, dist);
    if (can_move_to(coordsAbove[0], coordsAbove[1]) && !targetCanAttack(target, coordsAbove[0], coordsAbove[1])) {
      return coordsAbove;
    }

    // Check angle below the initial angle
    let angleBelow = currentAngle - i * step;
    if (angleBelow < 0) {
      angleBelow += 2 * Math.PI;
    }
    let coordsBelow = getCoordinatesAtDistance(angleBelow, dist);
    if (can_move_to(coordsBelow[0], coordsBelow[1]) && !targetCanAttack(target, coordsBelow[0], coordsBelow[1])) {
      return coordsBelow;
    }
  }
  
  // If no valid angle is found within the maximum number of steps, return null
  return null;
}

function findOppositeAngle(angle) {
  // Normalize the angle to the range [0, 2*pi)
  angle = angle % (2 * Math.PI);
  
  // Add pi to the angle to find the opposite angle
  let oppositeAngle = angle + Math.PI;
  
  // Normalize the opposite angle to the range [0, 2*pi)
  oppositeAngle = oppositeAngle % (2 * Math.PI);
  
  return oppositeAngle;
}

//VERY basic example of how to use the functiosn for kiting

setInterval(() =>{
	
	Regen();
	loot();
	let target = get_targeted_monster();
	if(!target){
		target = get_nearest_monster({type: 'poisio'});
		change_target(target);
		if(!target && !smart.moving){
			smart_move('poisio')
		}
	}
	if (!smart.moving){
		if(distance(target, character) > character.range){
			let a = getCoordinatesAtDistance(findOppositeAngle(findAngle(target)), character.range * .9);
			move(a[0], a[1]);
		}
		if(!is_on_cooldown('attack')) attack(target);

		if(!character.moving && distance(character, target) < target.range * 2){
			let moveTo = findNearestAngle(step, maxSteps, moveDist);
			draw_line(character.x, character.y, moveTo[0], moveTo[1], 2, 0x00FFC0);
			move(moveTo[0], moveTo[1]);
		}
	}
	clear_drawings();
	draw_circle(target.x, target.y, .5 * target.height + target.range, 2, 0xFF0000);
	draw_circle(character.x, character.y, character.range + 34, 2, 0x0050C0);
	draw_line(character.x, character.y, target.x, target.y, 2, 0xCF00CF);

	
}, 100)