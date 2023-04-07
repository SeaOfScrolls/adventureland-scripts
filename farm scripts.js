//script for bot character farming/monster hunting/doing events
//NOT FINISHED YET
//mobList MUST include any event monsters that you include in your event whitelist

const potions = ['hpot1', 'mpot1'];
const mobList = ['wabbit', 'bat', 'goldenbat'];
let state;

function getState(){ //determine what character should be doing
    if(character.rip) return 'dead';
    if(checkPotions() || character.esize < 4) return 'resupply';
    if(checkEvent) return 'event';
    if(character.s[monsterhunt]) return 'mhunt';
    return 'idle';
}

//check our potion status
function checkPotions(){
    for(let i in potions){
        if (findItem(potions[i], null, true)[1] < 20){ //if we have less than 20 of either type of potions
            return true;
        }
    }
    return false;
}

//update character state every 10 seconds
async function stateLoop(){
    state = getState();

    setTimeout(getState, 1000 * 10);
}

//Asynchronous loop to handle both movement to and at destination
async function moveLoop(){
    switch(state){
        case 'resupply':
            //go get potions
            break;
        
        case 'event':
            //if at event, get in range to attack event, if not at event, go to event
            break;

        case 'mhunt':
            //if at mhunt, get in range to attack mhunt monster, else go to mhunt monster
            break;

        case 'idle':
            //go get mhunt
            break;
    }
    setTimeout(moveLoop, 200)
}

async function attackLoop(){
    let target = get_targeted_monster();

    if(target && can_attack(target) && character.mp > character.mp_cost){
        await attack(target);
		reduce_cooldown('attack', Math.min(...parent.pings));
    }

    else{
        target = getNearest({'pathCheck': true, target: mobList});
        change_target(target);
    }

    setTimeout(attackLoop, Math.max(nextSkill('attack'), 10))
}

async function potionLoop(){

}