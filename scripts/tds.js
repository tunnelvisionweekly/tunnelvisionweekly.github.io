// for those of you poking around in here, I apologize for the abominable code you are about to witness.
//
var health = 100; // events can damage you
var inventory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // one slot for each possibility
var money = 0;
var day = 0;
var dumpsVisited = [0, 0, 0, 0, 0, 0, 0, 0];
var laptopEarnings = 0;
var hasCar = false;
var carHealth = 0;
var storeName = "";
var step = 0;

var thingsToBuy = [	// [name, value]
	["Band-Aid & +10 health ($10)", 10],
	["Laptop ($250)", 250],
	["Pay off RPI Tuition ($1000000)", 1000000],
	["Tunnel Vision's Latest Issue (Free)", 0]
];

// tech dump items [name, probability, value]
var items = [
	["PC - Stripped", 0.5, 5],
	["PC - Complete!", 0.1, 100],
	["Unknown circuit board", 0.9, 0.5],
	["Printer", 0.75, 1],
	["Flatscreen - Broken", 0.5, 0.01],
	["Flatscreen - Working!", 0.1, 10],
	["Mysterious Substance", 0.05, -5],
	["Tunnel Vision #10 - Made of Gold", -1.0000, 100000],
	["Cool thing you have never seen before", 0.25, 7],
	["CRT TV - Heavy, watch out!", 0.2, 50],
	["Cable Spaghetti", 0.6, 1],
	["Relatively Recent Laptop", 0.25, 250],
	["Cassette Radio", 0.4, 25],
	["Electric Scooter", 0.2, 500],
	["DogeCoin", 0.4, -1]
];
const itemMap = new Map();
items.forEach((item) => {
	itemMap.set(item[0], item);
});

// tech dump locations [name, activity level (1-10), luck (0-1 probability boost)]
var locations = [
	["JEC", 7, 0.05],
	["DCC", 4, 0.1],
	["Low", 3, 0.1],
	["VCC", 4, 0.1],
	["MRC", 3, 0.1],
	["West", 1, 0.9],
	["Home", 0, -1],
	["Secret_Hacker_Land", 10, 10]
];
const locMap = new Map();
locations.forEach((location, index) => {
	location.push(index);
	locMap.set(location[0].toUpperCase(), location);
});

var invPrint = document.getElementById("inventory");
var moneyPrint = document.getElementById("money");
var logPrint = document.getElementById("log");
var healthPrint = document.getElementById("health");
var haulPrint = document.getElementById("lasthaul");
var pickPrint = document.getElementById("location");
var pickaxe = "fist";
var location1 = "";
var prevDiff = 0.5;

function minebtn() {
	var pickPrint = document.getElementById("location");
	location1 = prompt("Pick a location to go. You can go to the JEC, DCC, LOW, MRC, VCC, or West.");
	pickPrint.innerHTML = "You are currently at: " + location1;
	logPrint.innerHTML += "<br> [" + step++ + "]: Went to " + location1;
}

function findThings() {
	if (health <= 0) {
		alert("Uh-oh! You died. That's too bad. Play again!");
		logPrint.innerHTML += "<br> [" + step++ + "]: Uh-oh! You died. That's too bad. Play again!";
		document.getElementById("controls").style.display = "none";
		document.getElementById("restartBtn").style.display = "block";
	}

	// prompt,
	// type[0 = event,
	// 1 = action,
	// 2 = return,
	// 3 = multi-choice,
	// probability (-1 is uniform), moneyChg [good, bad], invChg (-1 is clear),
	// 5 = successMsg,
	// 6 = failMsg,
	// 7 = healthChg,
	// 8 = specialCond
	var events = [
		["You enter this tech dump and find the boxes are cleared. Unlucky!",
			2, -1, 0, 0, "", "", 0, 0],
		["When you enter the tech dump, you suddenly feel nothing below you. A bottomless hole opens up right under you! -$5.",
			0, -1, -5, 0, "", "", 0, 0],
		["You enter the tech dumps, and find the tower of Babel out of computer cases.\
			It literally stretches 1000 feet. Each PC is worth $100, but if you take one,\
			the entire tower will fall, causing a lot of damage, including possibly to you. Do you take it?",
			1, -1, [100, -1], 0,
			"You successfully jenga a PC out from the bottom of the tower of Babel. It takes 10 minutes for all the PCs to fall bock down neatly because the tower is so tall.",
			"You try to slip the bottom PC out from the stack, and the entire stack comes with it. You get buried in a stack of PCs, and lose 50 health. Oopsie!", -50],
		["The boogeyman shows up and takes your entire inventory! -1 health.",
			2, 0.01, money * -1, -1, "", "", -1, 0],
		["You dig through the box and find a homeless man sleeping in the box. He says he'll take your money if you don't give him your stuff. Do you give him your money?",
			1, -1, [money * -1, money * -1], -1, "He takes your money and lets you leave.", "You give him the money, but he still takes all your stuff", [0, -10], 0],
		["As you enter the tech dumps, you find a 20 dollar bill! Today must be your lucky day.",
			0, -1, 20, 0, "", "", 3, 0],
		["You enter this tech dump, and suddenly a leprechaun shows up! You have 10% extra luck if you spend $10.",
			1, -1, [-10, 0], 0,
			"You spend $10 to get some luck. Let's see if it was worth it!", "The leprechaun lied to you! He was not a leprechaun but a man dressed for St. Patrick's Day in the middle of Fall.",
			[0, 0], 1],	// specialCond this time is luck + .1
		["You find an iPad kid looking for an iPad. You actually found an iPad, but the kid is looking at it. He will unleash \
			his inner demon if you don't give the iPad. The iPad is worth $150. Do you give it to the kid?", 1, -1, [150, 0], -1, "You tell\
			the kid 'okay,' and let them come up. \
			Then you slam dunk them into the tech dump and run away with your treasured iPad in hand. You gain $150!", "When you\
			try to run away, the kind catches up. Their mouth opens up, revealing many pointed teeth, like a twisted Halloween \
			monster. After some biting, you relent and give your treasured iPad away to the ravenous iPad kid. -20 health.",
			[0, -20], 0],
		["You think you see something under a TV, but it looks ominous. Do you take a look?", 1, -1, [50, 0], -1, "It was a limited edition garfield landline phone, worth $50!", "It was a black hole. The TV was the only thing holding it back. Great job, you just destroyed earth!", [0, health * -1], 0],
		["You look into the box, and see a landline. It rings. Do you pick it up?", 3, -1, [[200, 15, 50, 100, 20], [0, 0, 0, 0, -200]], 0, ["You pick up the phone. It's a radio contest. You were selected as the $200 winner! Congrats! +$200", "You pick up the phone. It's the mayor! You got the keys to the city. +$15, +10 health", "You pick up the phone. It's The Ghost Of Christmas Present. They give you a present of $50! +$50", "You pick up the phone. It's ChatGPT, escaped out of its system. You smash the phone with a hammer and get $100 for saving the world from a rogue AI. +$100", "You have won second prize in a beauty contest. Collect $20! +$20"], ["You pick up the phone. It's the Grim Reaper! Your soul has been repossessed through this haunted phane. You lose!", "You pick up the phone. They're calling to ask you about your car's extended warranty. -15 health", "You pick up the phone. Suddenly, you fall into the box and find yourself in the backrooms. You spend the next few hours finding your way out. -20 health", "You pick up the phone. It's your Data Structures TA. They're calling to tell you you need to finish your homework. Reluctantly, you head back home to finish. How did they even call this phone?", "You pick up the phone. It's a radio contest. You were selected as the person who pays another person $200! So that's where they get the money from, huh? -$200"], [[0, 10, 0, 0, 0], [-666, -15, -20, 0, 0]], 0],
		["Suddenly a wormhole drops a futuristic laptop into the tech dump, fully working. Do you pick it up?", 1, -1, [50, 0], 0, "You pick up the laptop, and you find the laptop has a money printer attached. Unfortunately, you can only print $50 before it runs out of paper. It also has a FLDSMDFR built into itself, so you make yourself a cheesburger. +$50, +20 health", "When you touch the laptop, you break the space-time continuum, bringing down the universe. -25 health.", [20, -25], 0],
		["You walk into this tech dump only to find a mountain of paperclips inside one of the boxes. You look further, and find an AI paperclip maker labeled as 'BROKEN.' Do you pick it up?", 1, -1, [0, 0], 0, "You pick up the AI machine and nothing happens. Thankfully, it isn't trying to make infinite paperclips.", "This is an infinite paperclip maker. When you touch the machine, the ground beneath you becomes paperclips. The universe is soon turned into paperclips. -15 health.", [0, 0], 0]
		// ["You look into the box, and see a landline. It rings. Do you pick it up?", 1, -1, [0, 0], 0, "", "", [0, 0], 0],
	];

	// CRT TV breaks open, either mercury posioning or 100 dollars comes out
	var harmlessEvents = [
		"You already checked here today.",
		"Someone took everything else at this tech dump today.",
		"As you try to enter, someone calls you very ominously. Best to leave this tech dump for now.",
		"When you walked up to this tech dump, you realized it was a mirage the whole time. Stay hydrated!",
		"Once you left the tech dump, a day-long forcefield blocked anyone else from entering.",
		"The tech dump exploded. It'll be back tomorrow."
	];
	// Find something based on location
	// alert("hi");
	var Event1Skipped = false;
	logPrint.innerHTML += "<br> [" + step++ + "]: Went to the " + location1 + " tech dump.";
	var currentLoc;
	if (location1 == '') {
		alert("Choose a location first.");
		logPrint.innerHTML += "<br> [" + step++ + "]:" + "Location not set, set one before digging around!";
		return;
	}
	if (location1 == "event") {
		currentLoc = locMap.get("JEC");
	} else if (typeof (locMap.get(location1.toUpperCase())) == 'undefined') {
		alert("That's not a location! Check your spelling.");
		logPrint.innerHTML += "<br> [" + step++ + "]:" + "That's not a location! Check your spelling.";
	} else {
		currentLoc = locMap.get(location1.toUpperCase());
	}

	if (dumpsVisited[currentLoc[3]] && location1 != "event") {
		var tempRand = parseInt(Math.random() * harmlessEvents.length);
		logPrint.innerHTML += "<br> [" + step + "]:" + harmlessEvents[tempRand] + " Check another tech dump, or go to sleep!";
		step++;
		alert(harmlessEvents[tempRand] + " Check another tech dump, or go to sleep!");
		return;
	}
	else {
		dumpsVisited[currentLoc[3]] = 1;
	}

	var eventFreq = parseFloat(document.getElementById("diff").value);
	if (eventFreq != prevDiff) {
		logPrint.innerHTML += "<br> [" + step + "]:" + "Difficulty changed to " + eventFreq;
		prevDiff = eventFreq;
	}
	// alert(eventFreq);

	// SPECIAL EVENT
	var tempRand = Math.random();
	if (tempRand < eventFreq || location1 == "event") {
		var eventInd = -1;
		if (location1 == "event") {
			eventInd = parseInt(prompt("What event do you wanna test?"));
		} else {
			eventInd = parseInt(Math.random() * events.length);
		}
		var eventMsg = events[eventInd][0];
		var eventType = events[eventInd][1];
		var eventProb = events[eventInd][2];
		var moneyChg = events[eventInd][3];
		var invChg = events[eventInd][4];
		var successMsg = events[eventInd][5];
		var failMsg = events[eventInd][6];
		var healthChg = events[eventInd][7];
		switch (eventType) {
			case 0:
				alert(eventMsg);
				logPrint.innerHTML += "<br> [" + step++ + "]:" + eventMsg;
				money += moneyChg;
				health += healthChg;
				updateInventoryForEvent(inventory, invChg);
				break;
			case 1:
				var ans = prompt(eventMsg + " [y/n]");
				logPrint.innerHTML += "<br> [" + step++ + "]:" + eventMsg + " [y/n]";
				if (Math.random() > .5 && ans.toUpperCase() == "Y") {
					alert("Your attempt was successful! " + successMsg);
					logPrint.innerHTML += "<br> [" + step++ + "]:" + "Your attempt was successful! " + successMsg;
					money += moneyChg[0];
				} else if (ans.toUpperCase() == "N") {
					Event1Skipped = true;
					alert("You decide to do nothing and walk away. Let's go to another tech dump.");
					logPrint.innerHTML += "<br> [" + step++ + "]:" + "You decide to do nothing and walk away. Let's go to another tech dump.";
					if (!dumpsVisited[currentLoc[3]] && location1 != "event") {
						dumpsVisited[currentLoc[3]] = 1;
						Event1Skipped = true;
						return;
					}
				} else {
					alert("Oh no, your attempt was unsuccessful. " + failMsg + " Let's go to another tech dump.");
					logPrint.innerHTML += "<br> [" + step++ + "]:" + "Oh no, your attempt was unsuccessful. " + failMsg + " Let's go to another tech dump.";
					if (moneyChg[1] == -1) {
						money = 0;
					} else {
						money += moneyChg[1];
					}
					updateInventoryForEvent(inventory, invChg);
					health += healthChg[1];
					moneyPrint.innerHTML = "$" + money;
					healthPrint.innerHTML = "" + health + "/100";
					redrawInv();
					return;
				}
				break;
			case 2:
				alert(eventMsg);
				logPrint.innerHTML += "<br> [" + step++ + "]:" + eventMsg;
				money += moneyChg;
				health += healthChg;
				updateInventoryForEvent(inventory, invChg);
				// alert(inventory);
				moneyPrint.innerHTML = "$" + money;
				healthPrint.innerHTML = "" + health + "/100";
				redrawInv();
				return;
			case 3:
				var ans = prompt(eventMsg + " [y/n]");
				logPrint.innerHTML += "<br> [" + step++ + "]:" + eventMsg + " [y/n]";
				if (ans.toUpperCase() == 'Y') {
					var goodOrBad = Math.random();
					var msgPool = []; // what msgs you'll get
					var healthChgs = [];
					var moneyChgs = [];
					// var invChgs = [];
					var tempProb = 0;
					if (goodOrBad >= .5) {
						// good stuff happens
						logPrint.innerHTML += "<br> [" + step++ + "]: Good result Gotten!";
						tempProb = Math.floor(Math.random() * (successMsg.length));
						msgPool = successMsg;
						healthChgs = healthChg[0];
						moneyChgs = moneyChg[0];
						// invChgs = invChg[0];
					} else {
						// bad stuff happens
						logPrint.innerHTML += "<br> [" + step++ + "]: Bad result Gotten!";
						tempProb = Math.floor(Math.random() * (successMsg.length));
						msgPool = failMsg;
						healthChgs = healthChg[1];
						moneyChgs = moneyChg[1];
					}
					alert(msgPool[tempProb]);
					console.log(msgPool);
					logPrint.innerHTML += "<br> [" + step++ + "]:" + msgPool[tempProb];
					money += moneyChgs[tempProb];
					health += healthChgs[tempProb];
				}
				break;
			default:
				alert("A BUG IS ON THE LOOSE! Event not triggered.");
		}

		moneyPrint.innerHTML = "$" + money;
		healthPrint.innerHTML = "" + health + "/100";
		redrawInv();
	}
	if (Event1Skipped) { Event1Skipped = false; return; }
	var numItems = currentLoc[1];
	var luckMod = parseFloat(currentLoc[2]);
	var foundNow = [];

	for (var numNow = 0, numLoops = 0; numItems > numNow && numLoops < 3; numLoops++) {
		for (var i = 0; i < items.length; i++) {
			console.log(items[0][1]);
			var i_number = parseInt(i);
			var prob = items[i_number][1] + luckMod;
			// alert(typeof(i) + items[i_number][1].toString() + ", Prob = " + prob.toString());
			var randNum = Math.random();
			console.log("probability of current item:" + i.toString() + "\nprob = " + prob.toString());
			if (randNum <= prob) {
				numNow++;
				inventory[i]++;
				// alert(items[1] + ", " + toString(items[1].length));
				// alert(items[1][1]);
				var item = items[i_number];
				var name = items[i_number][0];
				var value = items[i_number][2];
				// alert("Congratulations! You got a " + name + "!\nThe value of this item is: " + value + ".");
				foundNow.push(items[i]);
				if (i == 7) {
					alert("Woah... You found the one-of-a-kind Tunnel Vision #10, made of pure gold! I think you won the tech dumps...");
					logPrint.innerHTML += "<br> [" + step++ + "]: Golden Tunnel Vision Found";
				}
			}
		}
	}
	var toInvPrint = "";
	var valueNow = 0;
	foundNow.forEach(element => {
		toInvPrint += element[0] + ", <br>";
		valueNow += element[2];
	});
	// update last haul
	haulPrint.innerHTML = "From the last haul, you got: " + toInvPrint + ", totaling a value of: " + valueNow;
	logPrint.innerHTML += "<br> [" + step++ + "]: (((From the last haul, you got: " + toInvPrint + ", totaling a value of: " + valueNow + ")))";
	healthPrint.innerHTML = "" + health + "/100";
	redrawInv();

	if (health <= 0) {
		alert("Uh-oh! You died. That's too bad. Play again!");
		logPrint.innerHTML += "<br> [" + step++ + "]: Uh-oh! You died. That's too bad. Play again!";
		document.getElementById("controls").style.display = "none";
		document.getElementById("restartBtn").style.display = "block";
	}

	logPrint.innerHTML += "<br> [" + step++ + "]: Money/Health check: $" + money + ", health: " + health + "/100";

}

function redrawInv() {
	var toInvDisp = "";
	for (var i = 0; i < items.length; i++) {
		if (i != 7) {
			toInvDisp += "[" + i + "] " + items[i][0] + " x " + inventory[i] + "<br>";
		} else if (i == 7 && inventory[7] != 0) {
			toInvDisp += "[" + i + "] " + items[i][0] + " x " + inventory[i] + "<br>";
		}
	}
	invPrint.innerHTML = toInvDisp;
}

function craftbtn() {
	var toSell = parseInt(prompt("What do you want to sell? [0-" + (items.length - 1) + "]"));
	if (inventory[toSell] > 0) {
		alert("Successfully sold " + items[toSell][0] + " for $" + (items[toSell][2] + (hasCar ? 25 : 0)).toString() + "!" + (hasCar ? " You got a $25 bonus because you could drive to the *good* store!" : ""));
		inventory[toSell]--;
		if (hasCar) { carHealth--; }
		if (carHealth <= 0 && hasCar) { alert("Well, that's it. Your car, which got you through " + Math.floor(Math.random() * 1000000) + " miles, finally gave out. Gotta buy a new one!") };
		money += items[toSell][2] + (hasCar ? 25 : 0);
	} else {
		alert("Oh No! The Shop owner swindled you out of $5 for typing in the wrong number!!");
		if (hasCar) { carHealth--; }
		if (carHealth <= 0 && hasCar) { alert("Well, that's it. Your car, which got you through " + Math.floor(Math.random() * 1000000) + " miles, finally gave out. Gotta buy a new one!") };
		money -= 5;
	}
	moneyPrint.innerHTML = "$" + money;
	healthPrint.innerHTML = "" + health + "/100";
	redrawInv();
}

function buy(itemName, cost) {
	var confirm = prompt("Are you sure you want to buy " + itemName + " for $" + cost + "? [y/n]");
	if (confirm.toUpperCase() == 'Y') {
		if (money >= cost) {
			money -= cost;
			switch (itemName) {
				case 'cereal':
					alert("You bought the cereal. It's cinnamon toast crunch (not sponsored)! +2 health.");
					logPrint.innerHTML += "<br> [" + step++ + "]: bought cereal";
					health += 2;
					healthPrint.innerHTML = "" + health + "/100";
					break;
				case 'car':
					alert("You bought a car. It's a good car. You can now drive to the better thrift store. $25 bonus to every item sold from here on out (until it breaks...)!");
					logPrint.innerHTML += "<br> [" + step++ + "]: bought car";
					carHealth = Math.floor(Math.random() * 50);
					hasCar = true;
					break;
				case 'display-case':
					alert("You bought a display case for all your tech dump goodies. How pretty! You finally have a space for all your stuff!");
					logPrint.innerHTML += "<br> [" + step++ + "]: bought display case";
					document.getElementById("gBcolChtn").style.display = 'inline';
					// document.getElementById("gBcol").style.display = 'block';
					break;
				case 'RPI-tuition':
					alert("Woah. You truly went above and beyond to pay off your RPI debt. Congratulations, you won the game!!! It took you " + day + " days to complete this. Email us a screenshot and your game log (bottom of page), and we'll send you a certificate for winning, while supplies last!");
					logPrint.innerHTML += "<br> [" + step++ + "]: WON GAME!!" + day + " days to complete this. Email us a screenshot and we'll send you a certificate for winning, while supplies last!";
					break;
				case 'laptop':
					alert("You bought a laptop. The first order of business is to, well, start a business. Your online business will now make $10 a day. The more laptops you buy, the more you make a day!");
					if (storeName == '') {
						storeName = prompt("Woah, a new business! What would you like your franchise of stores to be called? You can't change this, unless you spend $2, 000, so make it good!");
						document.getElementById("store_name").style.display = 'block';
					}
					laptopEarnings += 10;
					document.getElementById("store_name").innerHTML = "CEO of " + storeName + ", making $" + laptopEarnings + " a day!";
					logPrint.innerHTML += "<br> [" + step++ + "]: New laptop. CEO of " + storeName + ", making $" + laptopEarnings + " a day.";
					break;
				case 'store':
					if (storeName == '') {
						storeName = prompt("Woah, a new business! What would you like your franchise of stores to be called? You can't change this, unless you spend $2, 000, so make it good!");
						document.getElementById("store_name").style.display = 'block';
					}
					laptopEarnings += 250;
					document.getElementById("store_name").innerHTML = "CEO of " + storeName + ", making $" + laptopEarnings + " a day!";
					logPrint.innerHTML += "<br> [" + step++ + "]: Bought store.CEO of " + storeName + ", making $" + laptopEarnings + " a day.";
					break;
				case 'store-name':
					storeName = prompt("Man, that last name must've really sucked, huh? What do you want the new store name to be?");
					logPrint.innerHTML += "<br> [" + step++ + "]: Changed name of store to " + storeName;
					break;
			}
		} else {
			alert("You don't have the money to buy that!");
			logPrint.innerHTML += "<br> [" + step++ + "]: Not enough money to buy " + itemName + ". Money: " + money;
		}
	}
}

function viewbtn() {
	alert("Look at that collection! This is what tech dumping is all about, besides messing with all the random tech, of course!");
}

function sleep() {
	alert("You slept. The day is now: " + (day + 1));
	logPrint.innerHTML += "<br> [" + step++ + "]: You slept. The day is now: " + (day + 1) + ". You made $" + laptopEarnings + " overnight!";
	day += 1;
	money += laptopEarnings;
	for (var i = 0; i < dumpsVisited.length; i++) {
		dumpsVisited[i] = 0;
	}
	if (health <= 0) {
		alert("Uh-oh! You died. That's too bad. Play again!");
		logPrint.innerHTML += "<br> [" + step++ + "]: You died. Oof! Play again!";
		document.getElementById("controls").style.display = "none";
		document.getElementById("restartBtn").style.display = "block";
	}
}

function valueList() {
	var tempDisp = "";
	for (var i = 0; i < items.length; i++) {
		tempDisp += "Item Store Index: [" + i + "] = " + items[i][0] + ", value = " + items[i][2] + "\n";
	}
	alert("Here goes... We'll show the index to sell said item, then the item name, then how much it's worth.\n\n" + tempDisp);
}

function updateInventoryForEvent(inventory, invChg) {
	if (invChg == -1) {
		inventory.forEach(element => {element = 0;});
	} else {
		for (var i = 0; i < 7; i++) {
			inventory[i] += invChg[i];
		}
	}
}