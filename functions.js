//Universal functions to be used in many script files with load_code('script_name')

//find and return the inventory slot number of an item of the given name. level can optionally be specified to search for item with given name AND level.
//if qty is given a value, the function will return an array with item slot and item quantity in format [item_slot, item_quantity]
//is using qty but not level, second parameter must be null(I don't think there are any stackable items with a level, so this should always be the case)
function findItem(iName, iLvl = null, qty = false){//could possibly improve by taking an object as arg instead, allowing exclusion of arguments without having to pass null
    let itemArr = [];
    for(let i in character.items){
        if(character.items[i] && character.items[i].name == iName){
            if(iLvl){
                if(iLvl == character.items[i].level){
                    itemArr.push(i);
                }
            }
            else itemArr.push(i);
            if(itemArr[0]){
                if(qty) itemArr.push(character.items[i].q);
                return itemArr;
            }
        }
    }
}

//Modification of default get_nearest_monster function to accept an array of possible target monsters
//could be useful to create a nearby monster priority check function instead of this
//example input: {'target': ['goo', 'bee'], 'notargetCheck': true, 'pathCheck': true}
function getNearest(args){
    let lowD = 99999;
	let target;
	for(id in parent.entities){
		let current = parent.entities[id];
		for(let i in args.target){
			if(args.target[i] != current.mtype) continue;
			if(args.notargetCheck && current.target !=character.name) continue; //could improve to check array for possible targets e.g. only party members
			if(args.pathCheck && !can_move_to(current)) continue;
			let currD = parent.distance(character, current);
			if(currD < lowD) lowD = currD, target = current;
		}
	}
	return target;
}

//Finds and returns the lowest hp % object from a given array
//partyArr should be an array of character objects in order to ensure proper prioritization of heals
function lowestParty(partyArr){
    let percents = [];
    for(let i in partyArr){
        percents.push(partyArr[i].hp / partyArr[i].max_hp);
    }
    return partyArr[percents.indexOf(Math.min(...percents))]; //could be more performant to use a function that returns the index of the lowest element more simply
}