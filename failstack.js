//an attempt to figure out the logic to automate failstacking, purely meant as an excercise

const failItem = 'helmet';
const failLevel = 8;
const failNum = 10;

//returns true if character inventory has greater than or equal to amount number of itemName at level itemLevel
function enoughFail(amount, itemName, itemLevel){
    let count;
    for(let i in character.items){
        if (!character.items[i]) continue;
        if (character.items[i].name == itemName && character.items[i].level == itemLevel) count++;
        if (count >= amount) return true;
    }
    return false;
}

async function getUpgradeChance(upgradeItem, upgradeScroll){
    let chance;
    await upgrade(upgradeItem, upgradeScroll, null, true).then((data) => {
        chance = data.chance;
    })
    return chance;
}

async function upgradeUntil(itemObj){
	for(let i in character.items){
		if(character.items[i] && character.items[i].name == itemObj.name && character.items[i].level == itemObj.lvl){
			return;
		}
	}
	if(character.esize > 2){
		for(let i = character.esize; i > 2; i--){
			await buy_with_gold(itemObj.name);
		}
	}
	let bandaid = [itemObj.name];
	await horizUpgrade(bandaid, itemObj.lvl);
	
	return await upgradeUntil(itemObj)
}

async function failStack(upgradeItem, stackItem, stackNum, stackLevel, acceptableUpgrade){

    let upgradeScroll = 'scroll'+item_grade(upgradeItem);
    let failScroll = 'scroll'+item_grade({'name': stackItem, 'level': stackLevel});
    let upgradeChance = await getUpgradeChance(upgradeItem, upgradeScroll);
    let upgradeDelta;

    if(!enoughFail(stackNum, stackItem, stackLevel)){
        upgradeUntil({'name': stackItem, 'lvl': stackLevel});
    }
    for(let i in character.items){
        if(!character.items[i]) continue;
        if(character.items[i].name != stackItem) continue;
        if(character.items[i].level != stackLevel) continue;
        await upgrade(character.items[i], failScroll).then(() => {
            if(!success){
                upgradeDelta = upgradeChance - getUpgradeChance(upgradeItem, upgradeScroll);
            }
            //else do upgrades until scroll is legendary
        })
    }
    if(upgradeDelta >= acceptableUpgrade){
        //do upgrade of upgradeItem
    }
}

failStack('yourItemHere', failItem, failNum, failLevel, .5);