//Universal functions to be used in many script files with load_code('script_name')

//find and return the inventory slot number of an item of the given name. level can optionally be specified to search for item with given name AND level.
//if qty is given a value, the function will return an array with item slot and item quantity in format [item_slot, item_quantity]
function findItem(iName, iLvl = null, qty = false){
    let itemArr = [];
    for(let i in character.items){
        if(character.items[i] && character.items[i].name == iName){
            if(iLvl){
                if(iLvl == character.items[i].level){
                    itemArr.push(i);
                }
            }
            else itemArr.push(i);
        }
        if(qty) itemArr.push(character.items[i].q);
        return itemArr;
    }
}