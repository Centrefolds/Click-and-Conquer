// Update the updates values to be consistent with the play style
// Add a share button
// Add a link to a reddit discussion
// Create wikipedia page and link it to it
// Put the thing online
// Add google analytics
// Add a stealth consequence
// Change alignment of the play/pause buttons
// Change alignment of the planet name
// Check everything on several browsers
// Pass over the code & improve it (ex: lengths...)

//////////
// SAVE //
//////////

function impExp(){
	if (document.getElementById('impexp').style.display == 'block'){
		document.getElementById('impexp').style.display = 'none';
		document.getElementById('impexpField').value = '';
	} else {
		document.getElementById('impexp').style.display = 'block';
	}
}

function bake_cookie(name, value) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + 30);
	var cookie = [name, '=', JSON.stringify(value),'; expires=.', exdate.toUTCString(), '; domain=.', window.location.host.toString(), '; path=/;'].join('');
	document.cookie = cookie;
}
function read_cookie(name) {
	var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
	result && (result = JSON.parse(result[1]));
	return result;
}
function save(savetype){
	//Create objects and populate them with the variables, these will be stored in cookies
	//Each individual cookie stores only ~4000 characters, therefore split currently across two cookies
	//Save files now also stored in localStorage, cookies relegated to backup
	saveVar = {
		gold:planets[0].resources[0].value
	}
	saveVar2 = {
		science:planets[0].resources[1].value
	}
	//Create the cookies
	bake_cookie('civ',saveVar);
	bake_cookie('civ2',saveVar2);
	//set localstorage
	try {
		localStorage.setItem('civ', JSON.stringify(saveVar));
		localStorage.setItem('civ2', JSON.stringify(saveVar2));
	} catch(err) {
		console.log('Cannot access localStorage - browser version may be too old or storage may be corrupt')
	}
	//Update console for debugging, also the player depending on the type of save (manual/auto)
	console.log('Attempted save');
	if (savetype == 'export'){
		var string = '[' + JSON.stringify(saveVar) + ',' + JSON.stringify(saveVar2) + ']';
		var compressed = LZString.compressToBase64(string);
		console.log('Compressing Save');
		console.log('Compressed from ' + string.length + ' to ' + compressed.length + ' characters');
		document.getElementById('impexpField').value = compressed;
		//gameLog('Saved game and exported to base64');
	}
	if ((read_cookie('civ') && read_cookie('civ2')) || (localStorage.getItem('civ') && localStorage.getItem('civ2'))){
		console.log('Savegame exists');
		if (savetype == 'auto'){
			console.log('Autosave');
			//gameLog('Autosaved');
		} else if (savetype == 'manual'){
			//alert('Game Saved');
			console.log('Manual Save');
			//gameLog('Saved game');
		}
	};
	try {
		xmlhttp = new XMLHttpRequest();
		xmlhttp.overrideMimeType('text/plain');
		xmlhttp.open("GET", "version.txt?r=" + Math.random(),true);
		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4) {
				var sVersion = parseInt(xmlhttp.responseText);
				if (version < sVersion){
					versionAlert();
				}
			}
		}
		xmlhttp.send(null)
	} catch (err) {
		console.log('XMLHttpRequest failed')
	}
}

function toggleAutosave(){
	//Turns autosave on or off. Default on.
	if (autosave == "on"){
		console.log("Autosave toggled to off")
		autosave = "off";
		document.getElementById("toggleAutosave").innerHTML = "Enable Autosave"
	} else {
		console.log("Autosave toggled to on")
		autosave = "on";
		document.getElementById("toggleAutosave").innerHTML = "Disable Autosave"
	}
}

function deleteSave(){
	//Deletes the current savegame by setting the game's cookies to expire in the past.
	var really = confirm('Really delete save?'); //Check the player really wanted to do that.
	if (really){
        document.cookie = ['civ', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
		document.cookie = ['civ2', '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; path=/; domain=.', window.location.host.toString()].join('');
		localStorage.removeItem('civ');
		localStorage.removeItem('civ2');
        //gameLog('Save Deleted');
	}
}

/*function rename(){
	//Prompts player, uses result as new civName
	n = prompt('Please name your civilisation',civName);
	if (n != null){
		civName = n;
		document.getElementById('civName').innerHTML = civName;
	}
}*/


function load(loadType){
	var loadVar = {},
		loadVar2 = {};
		
	if (loadType == 'cookie'){
		//check for cookies
		if (read_cookie('civ') && read_cookie('civ2')){
			loadVar = read_cookie('civ');
			loadVar2 = read_cookie('civ2');
			//gameLog('Loaded saved game from cookie');
			//gameLog('Save system switching to localStorage.');
		} else {
			console.log('Unable to find cookie');
			return false;
		};
	}
	
	if (loadType == 'localStorage'){
		//check for local storage
		try {
			string1 = localStorage.getItem('civ');
			string2 = localStorage.getItem('civ2');
		} catch(err) {
			console.log('Cannot access localStorage - browser may not support localStorage, or storage may be corrupt')
		}
		if (string1 && string2){
			loadVar = JSON.parse(string1);
			loadVar2 = JSON.parse(string2);
			//gameLog('Loaded saved game from localStorage')
		} else {
			console.log('Unable to find variables in localStorage. Attempting to load cookie')
			load('cookie');
			return false;
		}
	}
	
	if (loadType == 'import'){
		//take the import string, decompress and parse it
		var compressed = document.getElementById('impexpField').value;
		var decompressed = LZString.decompressFromBase64(compressed);
		var revived = JSON.parse(decompressed);
		//set variables to load from
		loadVar = revived[0];
		loadVar2 = revived[1];
		//gameLog('Imported saved game');
		//close import/export dialog
	}
}

load('localStorage');


/////////////////////
// INPUT VARIABLES //
/////////////////////

var Time=0;
var play=false;
var Prefixes = ["", "K", "M", "G", "T", "P", "E"];
var planets=[];
var timeBetweenEvents1=60;
var timeBetweenEvents2=60;
var timeBetweenEvents3=60;
var datasets=[];
var limitsRadar=[1,1,1,1,1,1,1];
var numClick=0;
var SHIPS=0;
var PLANETSLOST=0;
var NUMPEOPLE=0;
var YearsREALLYPLAYED=0;
var users=[];
var userName="";
var numUser="";
var civilizationScore=0;
var LENGTH=0;
var activeUsersNb=0;
var totalSoldiers=0;
var totalPoliticians=0;
var totalProphets=0;


////////////
// GALAXY //
////////////

// Galaxy resources

var galaxyResources=[
	ships={
		name:"ships",
		value:15
	},
	energy={
		name:"energy",
		value:200,
		cap:0,
		rate:0
	},
	unobtainium={
		name:"unobtainium",
		value:1000,
		cap:0,
		rate:0
	},
	cristals={
		name:"cristals",
		value:1000,
		cap:0,
		rate:0
	}
];

var galaxyTechno={
	propulsion:{
		name: "Propulsion",
		cost:[0,100,0,0],
		value:0,
		increment:1.5,
		percentageBuyable:0
	},
	orbitalSupport:{
		name: "Orbital support",
		cost:[0,0,100,0],
		value:0,
		increment:1.5,
		percentageBuyable:0
	},
	intergalacticTrade:{
		name: "Intergalactic trade",
		cost:[0,0,0,100],
		value:0,
		increment:1.5,
		percentageBuyable:0
	},
	cargoShip:{
		name: "Cargo ship",
		cost: [1,0,0,0],
		value:0,
		increment:2,
		percentageBuyable:0
	},
	solarPanel:{
		name: "Solar panel",
		cost: [2,0,0,0],
		effect: [0,0.1,0,0],
		value:0,
		increment:1.1,
		percentageBuyable:0		
	},
	miningVessel:{
		name: "Mining vessel",
		cost: [10,1000,0,0],
		effect: [0,0,0.1,0],
		value:0,
		increment:1.1,
		percentageBuyable:0		
	},
	terraformingBeam:{
		name: "Terraforming beam",
		cost: [0,1000,1000,0],
		effect: [0,0,0,0.1],
		value:0,
		increment:1.1,
		percentageBuyable:0		
	},
	spaceX:{
		name: "Space X",
		cost: [500,0,0,0],
		value:0,
		increment:1.1,
		percentageBuyable:0		
	}
};
	
// Galaxy update functions

function updateGalaxyResources(){
	totalSoldiers=0;
	totalPoliticians=0;
	totalProphets=0;
	for (var Nb=0;Nb<planets.length;Nb++){
		totalSoldiers+=planets[Nb].pop[2].value;
		totalPoliticians+=planets[Nb].pop[3].value;
		totalProphets+=planets[Nb].pop[6].value;
	};
	for (var Techno in galaxyTechno){
		calculatePercentage(Techno);
	};
	
	for (var Nb=0;Nb<planets.length;Nb++){
		planets[Nb].discoveryChance=Math.min(100,planets[Nb].discoveryChanceInit+galaxyTechno.propulsion.value*10);
		if (!planets[Nb].Revealled && planets[Nb].timeCount===0){ 
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Discovery chance:</p></br><p class='textPlanet'>"+planets[Nb].discoveryChance+"%</p></div>";
		};
	};
};

function updateGalaxyButtons(){
	
	UpdateValue("ships",galaxyResources[0].value,0);
	for (var i=1;i<4;i++){
		UpdateValue(galaxyResources[i].name,galaxyResources[i].value,1);
		UpdateValue(galaxyResources[i].name+"Cap",galaxyResources[i].cap,1);
		UpdateValue(galaxyResources[i].name+"Rate",galaxyResources[i].rate,1);
	};
	
	UpdateValue("totalSoldiers",totalSoldiers,0);
	UpdateValue("totalPoliticians",totalPoliticians,0);
	UpdateValue("totalProphets",totalProphets,0);
	
	if (galaxyResources[0].value>0){ document.getElementById("cargoShip").style.display= 'block'; document.getElementById("solarPanel").style.display= 'block'; };
	if (galaxyResources[1].value>0){ document.getElementById("miningVessel").style.display= 'block'; document.getElementById("propulsion").style.display= 'block';};
	if (galaxyResources[2].value>0){ document.getElementById("terraformingBeam").style.display= 'block'; document.getElementById("orbitalSupport").style.display= 'block';};
	if (galaxyResources[2].value>0){ document.getElementById("intergalacticTrade").style.display= 'block';};
	
	if (galaxyResources[0].value>0 && galaxyTechno.spaceX.value===0){document.getElementById("spaceX").style.display= 'block'} else {document.getElementById("spaceX").style.display= 'none'};
	
	for (var Techno in galaxyTechno){		
		document.getElementById("percentage"+Techno).style.width=galaxyTechno[Techno].percentageBuyable+"%";
		UpdateValue(Techno+"value",galaxyTechno[Techno].value,0);
		for (var i=0;i<4;i++){
			UpdateValue(galaxyResources[i].name+"Cost"+Techno,galaxyTechno[Techno].cost[i],1);
			if(galaxyTechno[Techno].effect!==undefined){			
				UpdateValue(galaxyResources[i].name+"Gain"+Techno,galaxyTechno[Techno].effect[i],1);
				UpdateColorValue(galaxyTechno[Techno].effect[i] >= 0,galaxyResources[i].name+"Gain"+Techno);
			};
			UpdateColorValue(galaxyResources[i].value >= galaxyTechno[Techno].cost[i],galaxyResources[i].name+"Cost"+Techno);	
		};
		var technoNb=0;
		var buyIsPossible=[];
		buyIsPossible[technoNb]=true;
		for (var i=0;i<4;i++){
			buyIsPossible[technoNb] = buyIsPossible[technoNb] && (galaxyResources[i].value >= galaxyTechno[Techno].cost[i]) ;
		};
		if (buyIsPossible[technoNb]){
			document.getElementById(Techno).style.display = 'block';
		};
		UpdateButton(buyIsPossible[technoNb],Techno); 
		technoNb+=1;
	};
};

// Galaxy buy & updates functions

function BuyGalaxyTechno(Techno){
	numClick+=1;
	var buyIsPossible=true;
	for (var i=0;i<4;i++){
		buyIsPossible = buyIsPossible && (galaxyResources[i].value >= galaxyTechno[Techno].cost[i]);
	};
	if (buyIsPossible){
		galaxyTechno[Techno].value+=1;
		galaxyTechno[Techno].appears=false;
		for (var i=0;i<4;i++){
			galaxyResources[i].value -= galaxyTechno[Techno].cost[i];
			galaxyTechno[Techno].cost[i]=galaxyTechno[Techno].cost[i]*galaxyTechno[Techno].increment;
		};
		updateGalaxyResources();
		updateGalaxyButtons();
		if (Techno==="orbitalSupport"){openStratPage();};
	};
};

function calculatePercentage(Techno){
	var totalResource=0;
	var totalCost=0;
			
	for (var i=0;i<4;i++){
		if (galaxyTechno[Techno].cost[i]-galaxyResources[i].value>0){ 
			totalResource += galaxyResources[i].value;
		} else {
			totalResource += galaxyTechno[Techno].cost[i];
		};
		totalCost+=galaxyTechno[Techno].cost[i];
		galaxyTechno[Techno].percentageBuyable=Math.min(100,totalResource/totalCost*100);
	};
};
				
function Produce(){
	galaxyResources[1].cap=100*(1+galaxyTechno.cargoShip.value);
	galaxyResources[2].cap=100*(1+galaxyTechno.cargoShip.value);
	galaxyResources[3].cap=100*(1+galaxyTechno.cargoShip.value);
	
	galaxyResources[1].rate=galaxyTechno.solarPanel.effect[1]*galaxyTechno.solarPanel.value;
	galaxyResources[2].rate=galaxyTechno.miningVessel.effect[2]*galaxyTechno.miningVessel.value;
	galaxyResources[3].rate=galaxyTechno.terraformingBeam.effect[3]*galaxyTechno.terraformingBeam.value;
	
	galaxyResources[1].value=Math.min(galaxyResources[1].cap,galaxyResources[1].value+galaxyResources[1].rate);
	galaxyResources[2].value=Math.min(galaxyResources[2].cap,galaxyResources[2].value+galaxyResources[2].rate);
	galaxyResources[3].value=Math.min(galaxyResources[3].cap,galaxyResources[3].value+galaxyResources[3].rate);

	var bonusScore=1;
	for (var i=1;i<4;i++){
		if(galaxyResources[i].value>0){
			bonusScore=i+1;
		};
	};
	civilizationScore=	prettifyOnly(galaxyResources[0].value*bonusScore + nbPlanetControlled()*100+ (totalSoldiers + totalPoliticians + totalProphets)/10);
};

///////////////////////
// GENERAL FUNCTIONS //
///////////////////////

// Disable right-click
document.oncontextmenu = document.body.oncontextmenu = function() {return false;}

// Initial alert

if (!read_cookie('civ') && !localStorage.getItem('civ')){
swal({
	title: "Welcome to Click & Conquer !",
	html: "</br>You are a supervillain and you desperately want to conquer Earth and establish your dominion over the entire world population.</br></br> Unfortunately for the moment, you are a little bit out of cash ...</br></br>Hit the play button & start stealing some money!</br>",
	confirmButtonColor: "#DD6B55",
	confirmButtonText: "Let's conquer the world!",
	allowOutsideClick: false,
	allowEscapeKey: false,
	imageUrl: "image/Achievement.png",
	imageWidth: 100,
	width: 800
}).then(function (result) {
	swal({
		html: 'Please write your supervillain name:',
		input: 'text',
		width: 500,
		showCancelButton: false,
		allowOutsideClick: false,
		inputValidator: function (value) {
			return new Promise(function (resolve, reject) {
			if (value) {
				resolve()
			} else {
				reject('You need to write something!')
			}
			})
		}
	}).then(function (result) {
		userName=result;
		users.push({
			name: result,
			active: true,
			civilizationScore:0
		});
		numUser=users.length-1;
		swal({
			type: 'success',
			html: 'Welcome to Earth, ' + result+' !'
		})
		document.getElementById("initialPannel").style.display="none";
	})
});
numClick+=3;
} else {
	document.getElementById("initialPannel").style.display="none";
};

function sortUsers(){
	activeUsersNb=0;
	users.sort(function(a, b) {
		return b.civilizationScore - a.civilizationScore
	});
	var L=users.length;
	for (var i=0; i<L;i++){
		if (users[i].name===userName){
			numUser=i;
		};	
		if (users[i].active){
			activeUsersNb+=1;
		};
	};
};	

function updateRanking(){
	document.getElementById("UserName").innerHTML=users[numUser].name;
	document.getElementById("CIVILIZATIONSCORE").innerHTML=civilizationScore;
	users[numUser].civilizationScore=civilizationScore;
	document.getElementById("UserRank").innerHTML=numUser+1;
	document.getElementById("NumberOfUsers").innerHTML=users.length;
	document.getElementById("NumberOfActiveUsers").innerHTML=activeUsersNb;
	
	if (document.getElementById("PlayersTable").style.display!=="none"){
		document.getElementById("PlayersTable").innerHTML="<tr><td class='orange'><b> Rank </b></td><td class='orange'><b> Name </b></td><td class='orange'><b> Score </b></td></tr>";
		document.getElementById("PlayersTable").style="min-width: 300px; width: 50%; margin: auto; position: relative;";
		var L=users.length;
		var K=0;
		while (K<10){
			if (K>=L){
				K=10;
			} else if (users[K].active){
				createDivPlayer(K);
				K+=1;
			} else {
				K+=1;
			};
		};
	};
};

function ShowPlayers(){
	document.getElementById("PlayersTable").style.display="block";
	updateRanking();
	document.getElementById("ShowPlayers").onclick=function(){HidePlayers()};
	document.getElementById("ShowPlayers").innerHTML="<i style='font-size:10'>Hide players</i>";
};
function HidePlayers(){
	document.getElementById("PlayersTable").style.display="none";
	document.getElementById("ShowPlayers").onclick=function(){ShowPlayers()};
	document.getElementById("ShowPlayers").innerHTML="<i style='font-size:10'>Show top 10 active players</i>";
};

//Windows

function openAchievementsWindow(){
	document.getElementById("chartsPannel").style.display="none";
	document.getElementById("achievementPannel").style.display="block";
	updateStats();
	for (var Achievement in Achievements){
		if (Achievements[Achievement].reached){
			createDivAchievement(Achievement);
		};
	};
	numClick+=1;
};

function closeAchievementsWindow(){
	document.getElementById("achievementPannel").style.display="none";
	numClick+=1;
};

function openStratPage(){
	document.getElementById("chartsPannel").style.display="none";
	document.getElementById("achievementPannel").style.display="none";
	document.getElementById("stratPagebackground").style.display="block";
	datasets=[];
	var myNode = document.getElementById("myNode");
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	};
	
	for (var Nb=0; Nb<planets.length; Nb++){
		CreateDivGalaxy(Nb);
	};
	updateGalaxyResources();
	updateGalaxyButtons();
	numClick+=1;	
};

function closeStratPage(){
	document.getElementById("stratPagebackground").style.display="none";
	numClick+=1;
};

function openChartsWindow(){
	document.getElementById("achievementPannel").style.display="none";
	document.getElementById("chartsPannel").style.display="block";
	document.getElementById("ChartHeader").innerHTMLy="Planet";
	for (var Nb=1; Nb<planets.length; Nb++){
		if(document.getElementById("planetButton"+Nb)===null && planets[Nb].Revealled){
			CreateDivPlanet(Nb);
		};
	};
	for(var Nb=0; Nb<planets.length;Nb++){
		for (var i=0;i<8;i++){
			if (typeof(canvas[Nb][i])!=="undefined"){	
				canvas[Nb][i].destroy();
			};
		};
	};
	numClick+=1;
};
	
function printCharts(val){
	numClick+=1;
	for(var Nb=0; Nb<planets.length;Nb++){
		planets[Nb].chartsBeingDisplayed=false;
		if (typeof(canvas[Nb][0])!=="undefined"){	
			for (var i=0;i<8;i++){
				canvas[Nb][i].destroy();
			};
		};
	};
	planets[val].chartsBeingDisplayed=true;
	document.getElementById("ChartHeader").innerHTML=planets[val].Name;
	var ctxChart = [];
	for (var nb=0;nb<planets.length;nb++){
		ctxChart[nb]=[];
		for (var i=0;i<8;i++){
			ctxChart[nb][i]=document.getElementById("canvas"+i).getContext("2d");
		};
	};
	
	for (var i=0;i<4;i++){	
		canvas[val][i]=new Chart(ctxChart[val][i], configChart[val][i]);
	};
	canvas[val][4]= new Chart(ctxChart[val][4], resourcesChart[val]);
	canvas[val][5]= new Chart(ctxChart[val][5], statusChart[val]);
	canvas[val][6]= new Chart(ctxChart[val][6], popChart[val]);
	canvas[val][7]= new Chart(ctxChart[val][7], winChart[val]);		
};
	
function closeChartsWindow(){
	numClick+=1;
	document.getElementById("chartsPannel").style.display="none";
	for(var Nb=0; Nb<planets.length;Nb++){
		planets[Nb].chartsBeingDisplayed=false;
		if (typeof(canvas[Nb][0])!=="undefined"){	
			for (var i=0;i<8;i++){
				canvas[Nb][i].destroy();
			};
		};
	};

};

function reducePlanetTab(){
	document.getElementById("ReduceTabPlanet").innerHTML="<i style='font-size:10'>Expand</i>";
	document.getElementById("ReduceTabPlanet").onclick=function() { expandPlanetTab(); };
	document.getElementById("stratPagetotal").style.height="20%";
	document.getElementById("stratPagetotal2").style.top="22%";	
	document.getElementById("stratPagetotal2").style.height="66%";	
};
function expandPlanetTab(){
	document.getElementById("ReduceTabPlanet").innerHTML="<i style='font-size:10'>Reduce</i>";
	document.getElementById("ReduceTabPlanet").onclick=function() { reducePlanetTab(); };
	document.getElementById("stratPagetotal").style.height="65%";
	document.getElementById("stratPagetotal2").style.top="67%";
	document.getElementById("stratPagetotal2").style.height="21%";	
};

function reducePlanetImage(){
	document.getElementById("ReduceImagePlanet").innerHTML="<i style='font-size:10'>Expand</i>";
	document.getElementById("ReduceImagePlanet").onclick=function() { expandPlanetImage(); };
	document.getElementById("ReduceImagePlanet").className="closeButton black";
	
	document.getElementById("PlanetImage").style.display="none";
	document.getElementById("PlanetDescription").style.display="none";
};
function expandPlanetImage(){
	document.getElementById("ReduceImagePlanet").innerHTML="<i style='font-size:10'>Reduce</i>";
	document.getElementById("ReduceImagePlanet").onclick=function() { reducePlanetImage(); };
	document.getElementById("ReduceImagePlanet").className="closeButton white";
	document.getElementById("PlanetImage").style.display="inline-block";
	document.getElementById("PlanetDescription").style.display="block";
};

// Round of the values to plot in HTML
function prettifyOnly(input){
	if (isNaN(input)!==true) {
		var output = Math.round(input * 100)/100;
		input= output;
	} ;
	return input;
};
	
// Round of the values to plot in HTML & includes prefixes for high values
function prettify(input,nbDec){
    if (!(isNaN(input))) {
		var output = Math.round(input * Math.pow(10,nbDec))/Math.pow(10,nbDec);
		input= output;
	} 
    var tier = Math.log10(input) / 3 | 0;
    if(tier == 0) return input;
    var scale = Math.pow(10, tier * 3);
    var scaled = input / scale;
    return scaled.toFixed(1) + Prefixes[tier];
}

// Prints date & time
function monthsTime (){
	var month=Math.floor(prettifyOnly(Time-Math.floor(Time))*12);
	var listOfMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Dec"]
	return listOfMonths[month]+" "+Math.floor(Time);
};

function duration (T){
	if (T===Infinity){
		return "---";
	};
	var day=Math.floor(T/(3600*24));
	var hour=Math.floor((T-day*3600*24)/3600);
	var min=Math.floor((T-day*3600*24-hour*3600)/60);
	var sec=Math.floor((T-day*3600*24-hour*3600-min*60));
	if (day ===0){
		if (hour===0){
			if (min===0){
				if (sec===0){
					return "---";
				} else {
					return sec+"s";
				};
			} else {
				return min+"m "+sec+"s";
			};
		} else { 
			return hour+"h "+min+"m "+sec+"s";
		};
	} else { 
		return day+"d "+hour+"h "+min+"m "+sec+"s";
	};
};

function Play(){
	play=true;
	numClick+=1;
	if (Time ===0) {log("","You started the game","")} else {log("","You resumed the game","")}; 
	document.getElementById("PlanetImage").style="opacity:1";
	document.getElementById("TITLE").innerHTML="Click & Conquer (play)";
	document.getElementById("PauseImage").src="image/pause.png";document.getElementById("PauseImage").style="cursor:pointer";
	document.getElementById("PlayImage").src="image/play-green.png";document.getElementById("PlayImage").style="cursor:default";
	updateGameResources(); 
	updateGameButtons(); 
	document.getElementById("Titre9").style.display = 'block';
};

function Pause(){
	numClick+=1;
	play=false;
	disactivateAllButtons();
	log("","You paused the game","");
	document.getElementById("PlanetImage").style="opacity:0.5";
	document.getElementById("TITLE").innerHTML="Click & Conquer (pause)";
	document.getElementById("PauseImage").src="image/pause-green.png";document.getElementById("PauseImage").style="cursor:default";
	document.getElementById("PlayImage").src="image/play.png";document.getElementById("PlayImage").style="cursor:pointer";
};

//////////////////////
// PLANET FUNCTIONS //
//////////////////////	

// Initialization of all the planets	

function discoverPlanet(Name, Src, Scientists, Soldiers, Politicians, Population, Area, GWP, Climate, GovType, TechLevel,discoveryChance){
	planets[planets.length]={
		
		// CHARACTERISTICS OF THE PLANET
		
		Name: Name,
		Image: Src,
		discoveryChanceInit:discoveryChance,
		discoveryChance:0,
		Soldiers: Soldiers,
		Politicians: Politicians,
		popPlanet: [1000000,Scientists, Soldiers, Politicians,1000000,1000000,1000000,1000000],
		Population: Population,
		TechLevel: TechLevel,
		TechLevelText: "",
		Area: Area,
		Density: Population/Area,
		GWP: GWP,
		Climate: Climate,
		GovType: GovType,
		WarStatus: "Peace",
		War: false,
		warTimer: 0,
		Revealled: false,
		Controlled: false,
		Lost: false,
		Active:false,
		ShowReasearched: false,
		chartsBeingDisplayed: false,
		timeCount:0,
		
		
		TIMEPLANET:0,
		UPGRADESPLANET:0,
		SHIPSPLANET:0,
		
		// MAIN GAME RESOURCES
		
		// Main game resources
		
		bonusRate: 0,
		populationCap: 0,
		stealth: 0,
		followers: 0,
		followersRate: 0,
		approval: 0,
		approvalRate: 0,
		stupidity: 0,
		firepower: 0,
		planetFirepower: 0,
		planetApproval: 0,
		WarEffect: 1,
		EventEffect: 0,
		eventDuration: 0,
		firepowerRate:0,
		followersRatio:0,
					
		// Main resources
		resources: [
			money= {
				name: "money",
				value: 0,
				cap: 0,
				rate: 0,
				timeTillCap: 0,
				EventEffect:0
			},
			science= {
				name: "science",
				value: 0,
				cap: 0,
				rate: 0,
				timeTillCap: 0,
				EventEffect:0
			},
			weapons= {
				name: "weapons",
				value: 0,
				cap: 100,
				rate: 0,
				timeTillCap: 0,
				EventEffect:0
			},
			faith= {
				name: "faith",
				value: 0,
				cap: 0,
				rate: 0,
				timeTillCap: 0,
				EventEffect:0
			}
		],
		
		// All population
		pop: [
			thiefs= {
				name: "thief",
				value: 0,
				cost: [5000,0,0,0],
				prod: [0,0,0,0],
				increment: 1.15,
				timeTillAffordable: 0,
				percentageBuyable: 0
			},
			scientists= {
				name: "scientist",
				value: 0,
				cost: [10000,1000,0,0],
				prod: [0,0,0,0],
				increment: 1.1,
				timeTillAffordable: 0,
				percentageBuyable: 0
			},
			soldiers= {
				name: "soldier",
				value: 0,
				cost: [10000,0,1000,0],
				prod: [0,0,0,0],
				increment: 1.1,
				timeTillAffordable: 0,
				percentageBuyable: 0
			},
			politician= {
				name: "politician",
				value: 0,
				cost: [50000,0,10000,0],
				prod: [0,0,0,0],
				increment: 1.1,
				timeTillAffordable: 0
			},
			guru= {
				name: "guru",
				value: 0,
				cost: [10000,0,0,1000],
				prod: [0,0,0,0],
				increment: 1.1,
				timeTillAffordable: 0,
				percentageBuyable: 0
			},
			lobbist= {
				name: "lobbist",
				value: 0,
				cost: [15000,15000,15000,15000],
				prod: [0.1,0.1,0.1,0.1],
				increment: 1.1,
				timeTillAffordable: 0
			},
			prophet= {
				name: "prophet",
				value: 0,
				cost: [10000,0,0,50000],
				prod: [0,0,0,0],
				increment: 1.1,
				timeTillAffordable: 0,
				percentageBuyable: 0
			},
			recruiter= {
				name: "recruiter",
				value:0,
				recruitScientistNumber: 0,
				recruitSoldierNumber: 0,
				recruitGuruNumber: 0,
				recruitPoliticianNumber: 0,
				valueFree: 0,
				cost: [100000,100000,100000,100000],
				prod: [0,0,0,0],
				increment: 1.1,
				timeTillAffordable: 0,
				percentageBuyable: 0
			}
		],
		
		totalPopulation: 0,		
		populationDead: 0,
		
		recruitScientistRate:0,
		recruitSoldierRate:0,
		recruitPoliticianRate:0,
		recruitGuruRate:0,
		
		recruitScientist: function (Nb){
			numClick+=1; if (!play) {Play(); numClick-=1;};
			if ((this.pop[7].valueFree>0&&Nb>0) || (this.pop[7].recruitScientistNumber>0&&Nb<0)) {
				this.pop[7].recruitScientistNumber+=Nb;
				this.pop[7].valueFree-=Nb;
			};
		},
		recruitSoldier: function (Nb){
			numClick+=1; if (!play) {Play();numClick-=1;};
			if ((this.pop[7].valueFree>0&&Nb>0) || (this.pop[7].recruitSoldierNumber>0&&Nb<0)) {
				this.pop[7].recruitSoldierNumber+=Nb;
				this.pop[7].valueFree-=Nb;
			};
		},
		recruitGuru: function (Nb){
			numClick+=1; if (!play) {Play();numClick-=1;};
			if ((this.pop[7].valueFree>0&&Nb>0) || (this.pop[7].recruitGuruNumber>0&&Nb<0)) {
				this.pop[7].recruitGuruNumber+=Nb;
				this.pop[7].valueFree-=Nb;
			};
		},
		recruitPolitician: function (Nb){
			numClick+=1; if (!play) {Play();numClick-=1;};
			if ((this.pop[7].valueFree>0&&Nb>0) || (this.pop[7].recruitPoliticianNumber>0&&Nb<0)) {
				this.pop[7].recruitPoliticianNumber+=Nb;
				this.pop[7].valueFree-=Nb;
			};
		},
		
		// All upgrades with their cost
		techno: {
			pickpocketTraining: {
				cost: [1000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			drugLab: {
				cost: [25000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			armedRobbery: {
				cost: [100000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			mortgageFund: {
				cost: [1000000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			IA: {
				cost: [500000,500000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			automation: {
				cost: [100000,100000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			hoursWeek: {
				cost: [25000,10000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			underpaidIntern: {
				cost: [10000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			mercenaries: {
				cost: [10000,1000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			warChild: {
				cost: [50000,0,15000,0],
				effect: 0,  timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			drones: {
				cost: [100000,50000,100000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			cyberAttack: {
				cost: [500000,500000,500000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			createCult: {
				cost: [10000,0,1000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			weeklyMeetings: {
				cost: [0,0,0,10000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			area51: {
				cost: [1000,1000,1000,1000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			pacificIsland: {
				cost: [100000,100000,100000,100000],percentageBuyable:0,
				effect: 0, timeTillAffordable:0,
				appears: false
			},
			darkSideOfTheMoon: {
				cost: [500000,500000,500000,500000],percentageBuyable:0,
				effect: 0, timeTillAffordable:0,
				appears: false
			},
			wallStreet: {
				cost: [15000,1500,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			taxHeavens: {
				cost: [150000,0,10000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			internet: {
				cost: [10000,15000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			wikipedia: {
				cost: [100000,100000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			badNeighborhood: {
				cost: [10000,0,15000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			submarine: {
				cost: [100000,10000,100000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			buildPyramids: {
				cost: [10000,10000,0,10000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			knife: {
				cost: [15000,1500,2000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			machineGun: {
				cost: [50000,75000,10000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			ballisticMissile: {
				cost: [200000,350000,35000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			nanovirus: {
				cost: [500000,500000,100000,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			holligans: {
				cost: [20000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			facebook: {
				cost: [100000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			flatEarthTheory: {
				cost: [500000,50000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			candyCrush: {
				cost: [1000000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			writeHollyBook: {
				cost: [10000,0,1500,5000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			humanSacrifice: {
				cost: [50000,0,20000,20000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			wololo: {
				cost: [0,0,0,200000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			inquisition: {
				cost: [500000,0,500000,500000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			microphone: {
				cost: [100000,50000,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			politicalParty: {
				cost: [25000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			massMedia: {
				cost: [250000,150000,0,2000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			makeAmerica: {
				cost: [500000,0,500000,500000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			blackmail: {
				cost: [15000,15000,15000,15000],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			HRManagement: {
				cost: [250000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			oilIndustry: {
				cost: [100000,0,0,0],
				effect: 0, timeTillAffordable:0,percentageBuyable:0,
				appears: false
			},
			fuckImOuttaHere: {
				cost: [1000000,1000000,1000000,1000000],percentageBuyable:0,
				effect: 0, timeTillAffordable:0,
				appears: false
			}
		},
		
		//ACTION METHODS OF THE PLANET
		
		// First money click button
		StealMoney: function(number){
			numClick+=1; if (!play) {Play();numClick-=1;};
			if (this.resources[0].value<this.resources[0].cap){
				this.resources[0].allTimeValue+=(Math.min(this.resources[0].value + number, this.resources[0].cap)-this.resources[0].value);
				this.resources[0].value = Math.min(this.resources[0].value + number*(1+this.techno.drugLab.effect)*(1+this.techno.armedRobbery.effect)*(1+this.techno.mortgageFund.effect), this.resources[0].cap);
			};
			for (var i=0; i<4; i++){
				if (Math.random()<0.5) {
					this.resources[i].value = prettifyOnly(Math.min(this.resources[i].value + number, this.resources[i].cap));
				};
			};
			this.calculateMainGameResources();
			updateGameResources();  
			updateGameButtons();
		},
		 
		// Works for all population types requiring basic resources
		Hire: function(nbPop){
			numClick+=1; if (!play) {Play();numClick-=1;};
			var buyIsPossible=true;
			for (var i=0;i<this.resources.length;i++){
				buyIsPossible = buyIsPossible && (this.resources[i].value >= this.pop[nbPop].cost[i]);
			};
			
			if (buyIsPossible && (this.popPlanet[nbPop]>=0) &&(this.totalPopulation < this.populationCap)){
				this.pop[nbPop].value+=1; 
				this.popPlanet[nbPop]-=1;
				this.totalPopulation+=1;
				if (nbPop===7){ this.pop[nbPop].valueFree+=1;};
				for (var i=0;i<this.resources.length;i++){
					this.resources[i].value-=this.pop[nbPop].cost[i];
					this.pop[nbPop].cost[i] = Math.floor(this.pop[nbPop].cost[i] * Math.pow(this.pop[nbPop].increment,this.pop[nbPop].value));
				};
				this.calculateMainGameResources();
				updateGameResources(); 
				updateGameButtons(); 
				NUMPEOPLE+=1;
				//updateGamePopulation(); // To do

			};
		},
		
		// Kill function which works for all population types 
		Kill: function(nbPop){
			if (this.pop[nbPop].value>0){
				this.pop[nbPop].value-=1;
				this.totalPopulation-=1;
				this.populationDead+=1;
				this.calculateMainGameResources();
				updateGameResources(); 
				updateGameButtons(); 
			};
		},
		
		//Random kill function for the Rebellion
		KillRandom: function(){
			var sum = 0;
			var random = (1-Math.random())*this.totalPopulation;
			for (var i=0; i<this.pop.length; i++){
				if (random === 0){
					console.log("Problem");
					break;
				} else {
					if(sum<random){
						sum+=this.pop[i].value;
					} else {
						this.pop[i-1].value-=1;
						this.totalPopulation-=1;
						this.populationDead+=1;
						this.calculateMainGameResources();
						updateGameResources(); 
						updateGameButtons();
						break;
					};		
				};				
			};
		},
				
		//Random kill function for the Planet
		KillRandomPlanet: function(){
			var sum = 0;
			var random = (1-Math.random())*(this.popPlanet[1]+this.popPlanet[2]+this.popPlanet[3]);
			for (var i=1; i<4; i++){
				if (random === 0){
					console.log("Problem");
					break;
				} else {
					if(sum<random){
						sum+=this.popPlanet[i];
					} else {
						this.popPlanet[i-1]-=1;
						this.populationDead+=1;
						this.calculateMainGameResources();
						updateGameResources(); 
						updateGameButtons();
						break;
					};
				};					
			};
		},
		
		// Repeated function to update production every loop		
		Produce: function(){ 
			for (var i=0;i<this.resources.length;i++){
				if (this.resources[i].value<=this.resources[i].cap && this.resources[i].value>=0){
					if (this.resources[i].rate >0){
						this.resources[i].value = Math.min(this.resources[i].value + this.resources[i].rate, this.resources[i].cap);
						this.resources[i].timeTillCap=(this.resources[i].cap-this.resources[i].value)/this.resources[i].rate;
					} else if (this.resources[i].rate <0){
						this.resources[i].value = Math.max(this.resources[i].value + this.resources[i].rate, 0);
						this.resources[i].timeTillCap=-this.resources[i].value/(this.resources[i].rate);
					} else {
						this.resources[i].timeTillCap=0;
					};
				};
				this.resources[i]=prettifyOnly(this.resources[i]);
			};
			if (this.followers<this.Population){
				this.followers=Math.min(this.Population, this.followers+this.followersRate);
			};
			if (this.recruitScientistRate>=100) {
				if(this.totalPopulation<this.populationCap) {
					this.pop[1].value+=1; 
					NUMPEOPLE+=1; 
					Achievements["jobInterview"].reached=true; 
					this.recruitScientistRate-=100;
				} else { 
					this.recruitScientistRate-=1;
				};
			};
			if (this.recruitSoldierRate>=100) {
				if(this.totalPopulation<this.populationCap) {
					this.pop[2].value+=1; 
					NUMPEOPLE+=1; 
					Achievements["jobInterview"].reached=true; 
					this.recruitSoldierRate-=100;
				} else { 
					this.recruitSoldierRate-=1;
				};
			};	
			if (this.recruitPoliticianRate>=100) {
				if(this.totalPopulation<this.populationCap) {
					this.pop[3].value+=1; 
					NUMPEOPLE+=1; 
					Achievements["jobInterview"].reached=true; 
					this.recruitPoliticianRate-=100;
				} else { 
					this.recruitPoliticianRate-=1;
				};
			};		
			if (this.recruitGuruRate>=100) {
				if(this.totalPopulation<this.populationCap) {
					this.pop[4].value+=1; 
					NUMPEOPLE+=1; 
					Achievements["jobInterview"].reached=true; 
					this.recruitGuruRate-=100;
				} else { 
					this.recruitGuruRate-=1;
				};
			};		
			
			this.calculateMainGameResources();
			updateGameResources();  
			updateGameButtons(); 
		},
		
		
		// Buy a technology
		BuyTechno: function (Techno){
			numClick+=1; if (!play) {Play();numClick-=1;};
			var buyIsPossible=true;
			for (var i=0;i<this.resources.length;i++){
				buyIsPossible = buyIsPossible && (this.resources[i].value >= this.techno[Techno].cost[i]);
			};
			if (buyIsPossible){
				this.techno[Techno].effect=1;
				this.techno[Techno].appears=this.ShowReasearched;
				//document.getElementById(Techno).innerHTML = document.getElementById(Techno).innerHTML+'(Researched)';
				for (var i=0;i<this.resources.length;i++){
					this.resources[i].value -= this.techno[Techno].cost[i];
				};
				this.calculateMainGameResources();
				updateGameResources();  
				updateGameButtons(); 
				
			};
		},
		
		calculateTimeTillAffordable: function(j){
			var timeResource = [0,0,0,0];
			var totalResource=0;
			var totalCost=0;
			
			if (!isNaN(j)){ // works for population
				for (var i=0;i<4;i++){
					if (this.pop[j].cost[i]-this.resources[i].value>0){ totalResource += this.resources[i].value;} else {totalResource += this.pop[j].cost[i];};
					totalCost+=this.pop[j].cost[i];
					this.pop[j].percentageBuyable=Math.min(100,totalResource/totalCost*100);
				}
				if ((Math.floor(this.resources[0].rate)<=0 && this.resources[0].value<this.pop[j].cost[0]) || (Math.floor(this.resources[1].rate)<=0 && this.resources[1].value<this.pop[j].cost[1]) || (Math.floor(this.resources[2].rate)<=0 && this.resources[2].value<this.pop[j].cost[2]) || (Math.floor(this.resources[3].rate)<=0 && this.resources[3].value<this.pop[j].cost[3])) {
					return(Infinity);
				} else {
					for (var i=0;i<4;i++){	
						if (this.resources[i].rate>0 && this.pop[j].cost[i]!==0 && this.resources[i].value<this.pop[j].cost[i]) { timeResource[i] = (this.pop[j].cost[i]-this.resources[i].value)/this.resources[i].rate;};
					};
				};
				return Math.floor(Math.max(timeResource[0], timeResource[1], timeResource[2], timeResource[3]));
				
				
				
			} else { // works for technologies
				for (var i=0;i<4;i++){
					if (this.techno[j].cost[i]-this.resources[i].value>0){ totalResource += this.resources[i].value;} else {totalResource += this.techno[j].cost[i];};
					totalCost+=this.techno[j].cost[i];
					this.techno[j].percentageBuyable=Math.min(100,totalResource/totalCost*100);
				}
				if ((Math.floor(this.resources[0].rate)<=0 && this.resources[0].value<this.techno[j].cost[0]) || (Math.floor(this.resources[1].rate)<=0 && this.resources[1].value<this.techno[j].cost[1]) || (Math.floor(this.resources[2].rate)<=0 && this.resources[2].value<this.techno[j].cost[2]) || (Math.floor(this.resources[3].rate)<=0 && this.resources[3].value<this.techno[j].cost[3])) {
					return(Infinity);
				} else {
					for (var i=0;i<4;i++){	
						if (this.resources[i].rate>0 && this.techno[j].cost[i]!==0 && this.resources[i].value<this.techno[j].cost[i]) { timeResource[i] = (this.techno[j].cost[i]-this.resources[i].value)/this.resources[i].rate;};
					};
				};
				return Math.floor(Math.max(timeResource[0], timeResource[1], timeResource[2], timeResource[3]));
			};	
		},
		
		// Main function to calculate resources, resourcesCap, and main game resources
		calculateMainGameResources: function(){
			
			var totalTechResearched = 0;
			var totalTech = 0;
			for (var T in this.techno){
				totalTech+=1;
				if (this.techno[T].effect>0) {
					totalTechResearched+=1;
				};
			};
			this.UPGRADESPLANET=totalTechResearched;
			
			this.base=[50,15,15,50];
			this.baseProdPop=[
				this.base[0]*this.pop[0].value,
				this.base[1]*this.pop[1].value,
				this.base[2]*this.pop[2].value,
				this.base[3]*this.pop[4].value
			];
			this.updatesEffect=[
				(1+this.techno.drugLab.effect)*(1+this.techno.armedRobbery.effect)*(1+this.techno.mortgageFund.effect)-1,
				(1+this.techno.hoursWeek.effect)*(1+this.techno.automation.effect)*(1+this.techno.IA.effect)-1,
				(1+this.techno.warChild.effect)*(1+this.techno.drones.effect)*(1+this.techno.cyberAttack.effect)-1,
				(1+this.techno.weeklyMeetings.effect)*(1+this.resources[3].EventEffect)-1
			];
			this.lobbistEffect=[
				this.pop[5].value*this.pop[5].prod[0],
				this.pop[5].value*this.pop[5].prod[1],
				this.pop[5].value*this.pop[5].prod[2],
				this.pop[5].value*this.pop[5].prod[3]
			];
			this.populationCost=[
				-this.pop[1].prod[1]/4/(1+this.techno.wikipedia.effect*4)*this.pop[1].value-this.pop[2].prod[2]/2/(1+this.techno.warChild.effect*4)/(1+this.techno.cyberAttack.effect)*this.pop[2].value-this.pop[0].prod[0]*this.pop[0].value/100*this.pop[3].value,
				-this.pop[1].prod[1]*this.pop[1].value/100*this.pop[3].value,
				-this.pop[2].prod[2]*this.pop[2].value/100*this.pop[3].value,
				-this.pop[3].prod[3]*this.pop[3].value/100*this.pop[3].value
			];
			
			// Calculate bonus rate
			this.bonusRate=(0.9*this.populationDead+10*nbPlanetControlled()+0.1*nbDeathsTotal()+galaxyTechno.intergalacticTrade.value*20)*Math.pow(this.WarEffect,2)/100;
			
			// Calculate main resources rates
			this.pop[0].prod[0]=this.base[0]*(1+this.updatesEffect[0])*(1+this.lobbistEffect[0])*(1+this.resources[0].EventEffect);
			
			this.pop[1].prod[1]=this.base[1]*(1+this.updatesEffect[1])*(1+this.lobbistEffect[1])*(1+this.resources[1].EventEffect);
			this.pop[1].prod[0]=-this.pop[1].prod[1]/4/(1+this.techno.wikipedia.effect*4);
			
			this.pop[2].prod[2]=this.base[2]*(1+this.updatesEffect[2])*(1+this.lobbistEffect[2])*(1+this.resources[2].EventEffect);
			this.pop[2].prod[0]=-this.pop[2].prod[2]/2/(1+this.techno.warChild.effect*4)/(1+this.techno.cyberAttack.effect);
			
			this.pop[3].prod=[-this.pop[0].prod[0]*this.pop[0].value/100, -this.pop[1].prod[1]*this.pop[1].value/100,-this.pop[2].prod[2]*this.pop[2].value/100,-this.pop[3].prod[3]*this.pop[3].value/100];
			
			this.pop[4].prod[3]=this.base[3]*(1+this.updatesEffect[3])*(1+this.resources[3].EventEffect);
			
			for (var i=0;i<this.resources.length;i++){ 
				this.resources[i].rate=0;
				for (var nbPop=0;nbPop<this.pop.length;nbPop++){
					this.resources[i].rate+=this.pop[nbPop].prod[i]*this.pop[nbPop].value;
				};
				this.resources[i].rate = prettifyOnly(this.resources[i].rate*(1+this.bonusRate));
			};
			
			//Calculate population cap (space)
			this.populationCap = Math.floor(Math.pow(this.Population,0.1)*2*(1+galaxyTechno["orbitalSupport"].value*0.2)*(1+this.techno.area51.effect)*(1+this.techno.pacificIsland.effect)*(1+this.techno.darkSideOfTheMoon.effect));
			
			//Calculate cap for main resources
			this.resources[0].initialCap = (this.GWP/this.Population+this.popPlanet[3]*800)/4*(1+galaxyTechno["orbitalSupport"].value*0.2);
			this.resources[0].cap = (this.resources[0].initialCap+1000*Math.pow(this.totalPopulation,1))*(1+this.techno.blackmail.effect/2)*(1+this.techno.wallStreet.effect)*(1+this.techno.taxHeavens.effect);
			
			this.resources[1].initialCap =(5000*this.TechLevel+this.popPlanet[2]*800)/3*(1+galaxyTechno["orbitalSupport"].value*0.2);
			this.resources[1].cap = (this.resources[1].initialCap+1000*Math.pow(this.totalPopulation,1))*(1+this.techno.internet.effect)*(1+this.techno.wikipedia.effect)*(1+this.techno.IA.effect)*(1+this.techno.blackmail.effect/2);

			this.resources[2].initialCap =(10000+this.popPlanet[1]*800)/3*(1+galaxyTechno["orbitalSupport"].value*0.2);
			this.resources[2].cap= (this.resources[2].initialCap+1000*Math.pow(this.totalPopulation,1))*(1+this.techno.badNeighborhood.effect)*(1+this.techno.submarine.effect)*(1+this.techno.blackmail.effect/2);
			
			this.resources[3].initialCap =(1/this.TechLevel*20000+200*(this.popPlanet[1]+this.popPlanet[2]+this.popPlanet[3]))/3*(1+galaxyTechno["orbitalSupport"].value*0.2);
			this.resources[3].cap = (this.resources[3].initialCap+1000*Math.pow(this.totalPopulation,1))*(1+this.techno.buildPyramids.effect)*(1+this.techno.weeklyMeetings.effect)*(1+this.techno.blackmail.effect/2);
			
			// Calculate stealth
			this.stealth=Math.min(100,this.totalPopulation*(1-this.stupidity)*5-this.pop[6].value*15);
			
			// Calculate firepower
			this.firepower=this.pop[2].value*(1+this.techno.knife.effect)*(1+this.techno.machineGun.effect)*(1+this.techno.ballisticMissile.effect)*(1+this.techno.nanovirus.effect);	
			this.planetFirepower=this.popPlanet[2]*Math.pow(2,this.TechLevel);
			if (this.planetFirepower===0) {this.firepowerRate=1;} else {this.firepowerRate=this.firepower/this.planetFirepower;};

			// Calculate stupidity level
			this.stupidity=Math.min(1,totalTechResearched/100+this.techno.holligans.effect*0.1+this.techno.facebook.effect*0.1+this.techno.flatEarthTheory.effect*0.15+this.techno.candyCrush.effect*0.2);
			
			// Calculate followers
			this.followersRate=(100*this.pop[4].value+2/10000000*this.Population*this.pop[6].value)*(1+this.techno.writeHollyBook.effect)*(1+this.techno.humanSacrifice.effect)*(1+this.techno.wololo.effect)*(1+this.techno.inquisition.effect);
			this.followersRatio=this.followers/this.Population;
			
			// Calculate approvalRate
			this.approval=this.pop[3].value*Math.max(0.1,this.stupidity)*3*(1+this.techno.microphone.effect)*(1+this.techno.massMedia.effect)*(1+this.techno.makeAmerica.effect);
			this.planetApproval=this.popPlanet[3]*this.TechLevel*(1-this.stupidity);
			if (this.approval>0) {this.approvalRate = this.approval/(this.approval+this.planetApproval); };
			
			// Update recruiter production
			
			this.recruitScientistRate+=this.pop[7].recruitScientistNumber*0.0002*100;
			this.recruitSoldierRate+=this.pop[7].recruitSoldierNumber*0.0002*100;
			this.recruitPoliticianRate+=this.pop[7].recruitPoliticianNumber*0.0002*100;
			this.recruitGuruRate+=this.pop[7].recruitGuruNumber*0.0002*100;
			
			// Update time till affordable & percentage for line
			
			for (var i=0; i<this.pop.length; i++){
				this.pop[i].timeTillAffordable = this.calculateTimeTillAffordable(i);
			};
			for (var Tech in this.techno){
				this.techno[Tech].timeTillAffordable = this.calculateTimeTillAffordable(Tech);
			};
		},	
		
		// Victory functions - strategic board functions	
		
		Win: function(){
			swal("You win !", "You've done it ! You've conquered "+this.Name+" !", "success");
			log(this.Name,"YOU WIN ! You've done it ! You've conquered "+this.Name+" ! Congratulations !","green");
			this.Controlled=true;
			this.War=false;
			document.getElementById("winBar").style.display = 'block';
			document.getElementById("DeclareWar").style.display = 'none';
			document.getElementById("MakePeace").style.display = 'none';
			document.getElementById("OrganiseElections").style.display = 'none';
			document.getElementById("RuleOfGod").style.display = 'none';
			document.getElementById("BuyShip").style.display = 'block';
		},
		
		Loose: function(){
			Pause();
			Achievements["hillary"].reached=true;
			this.War=false;
			swal("You loose !", "Say goodbye to "+this.Name+", looser.", "error");
			log(this.Name,"YOU LOOSE ! Say goodbye to "+this.Name+", looser.","red");
			document.getElementById("lostBar").style.display = 'block';
			this.Lost=true;
			PLANETSLOST+=1;
			for (var i=1;i<5;i++){document.getElementById("B"+i).style.display="none";};
		},
		
		MakeWar: function(){
			if (this.planetFirepower<=0){
				this.Win();
				Achievements["putin"].reached=true;
			} else if (this.firepower<=0){
				this.Loose();
			} else {
				var RebellionPower = Math.pow(this.firepower, Math.random()+1);
				var PlanetPower = Math.pow(this.planetFirepower, Math.random()+1);
			
				if (Math.random()>0.9){
					if (RebellionPower>=PlanetPower){
						this.KillRandomPlanet();
					} else {
						this.KillRandom();
					};
				};
			
				if (Math.random()>0.7){
					var soldiersLost = this.pop[2].value-Math.max(0,this.pop[2].value-Math.floor(1+this.planetFirepower/this.firepower));
					var soldiersLostPlanet = this.popPlanet[2]-Math.max(0,this.popPlanet[2]-Math.floor(1+this.firepower/this.planetFirepower));
					this.pop[2].value=Math.max(0,this.pop[2].value-Math.floor(1+this.planetFirepower/this.firepower));
					this.popPlanet[2]=Math.max(0,this.popPlanet[2]-Math.floor(1+this.firepower/this.planetFirepower));
					this.totalPopulation-=soldiersLost;
					this.populationDead+=soldiersLost+soldiersLostPlanet;	
					if (soldiersLost===1){log(this.Name,"You loose "+soldiersLost+" soldier","black");} else {log(this.Name,"You loose "+soldiersLost+" soldiers","black");}
					if (soldiersLostPlanet===1){log(this.Name,"The enemy looses "+soldiersLostPlanet+" soldier","black");} else {log(this.Name,"The enemy looses "+soldiersLostPlanet+" soldiers","black");}
				};
				
				this.calculateMainGameResources();
				updateGameResources(); 
				updateGameButtons(); 
			};				
		},
		
		MakePeace: function(){
			numClick+=1; if (!play) {Play();numClick-=1;};
			if (this.GovType==="Autoritarism" || this.GovType==="Totalitarism"){
				logRandom(this.Name,["Your peace demand was rejected. You fool !","Ahahahaha : you will die !","You never learn, do you ?"],"red");
			} else {
				this.War=false;
				logRandom(this.Name,["PEACE : You seem to be lucky. Here, take a peace cookie","PEACE : Let's burrow the war hatchet. Peace is declared","PEACE : Well, seems that you made peace after all ;)","PEACE : Weapons are down. Party time !","PEACE : Well, that's a pretty signature on that peace treaty !"],"green");
			};
		},
		
		OrganiseElections: function(){
			numClick+=3; if (!play) {Play();numClick-=1;};
			var self=this;
			
			if (this.GovType==="Democracy"){
				
				swal({
					title: "Are you sure?",
					html: "You are about to organise elections in a democracy. </br></br>You need an approval ratio of at least 50% to win ! If you have a lower approval, we advise you to cancel. </br></br>Do you want to proceed to the election ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's vote!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "Elections !", text: "Elections are organized", imageUrl: "image/Elections.jpg", imageWidth: 100});
					log(self.Name,"ELECTIONS : You organised elections","red");
					if (self.approval>0 && self.approval/self.planetApproval>0.5) {
						self.Win();
						Achievements["trump"].reached=true;
					} else {
						self.popPlanet[3]=Math.round(1.1*self.popPlanet[3]);
						log(self.Name,"ELECTIONS : You lost the elections ! :( </br> The number of politicians on the planet increased by 10%","red");
						
					};	
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "Elections cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
											
			} else if (this.GovType==="Totalitarism") {
			
				swal({title: "Not possible", text: "You cannot organise elections in a totalitarian regime", imageUrl: "image/Elections.jpg", imageWidth: 100});
			
			
			} else if (this.GovType==="Autoritarism") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to organise elections in a disctatorship. </br></br>You need an approval ratio of at least 80% to win or else a lot of your politicians will be murdered by the regime ! If you have a lower approval, we advise you to cancel. </br></br>Do you want to proceed to the election ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's vote!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "Elections !", text: "Elections are organized", imageUrl: "image/Elections.jpg", imageWidth: 100});
					log(self.Name,"ELECTIONS : You organised elections","red");
					if (self.approval>0 && self.approval/self.planetApproval>0.8) {
						Achievements["trump"].reached=true;
						self.Win();
					} else {
						self.populationDead+=Math.round(self.pop[3].value/2);
						self.totalPopulation-=Math.round(self.pop[3].value/2);
						self.pop[3].value=Math.round(self.pop[3].value/2);
						log(self.Name,"ELECTIONS : You lost the elections ! :( </br> You lost half of your politicians","red") 
					};
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "Elections cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			} else if (this.GovType==="Theocracy") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to organise elections in a theocracy, which is obviously a bad idea.</br></br> If you do so, the regime will crush your political party and declare you an endless war until you are completely forgotten from this planet. </br></br>Do you REALLY want to proceed to the election ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's vote!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "Civil war !", text: "Elections will try to be organized, but will result in civil war in 5 years", imageUrl: "image/Elections.jpg", imageWidth: 100});
					log(self.Name,"ELECTIONS : You organised elections","red");
					self.War=true;
					self.warTimer=50;
					self.WarEffect = 0.5;
					self.populationDead+=self.pop[3].value;
					self.totalPopulation-=self.pop[3].value;
					self.pop[3].value = 0;
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "Elections cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			};
			this.calculateMainGameResources();
			updateGameResources(); 
			updateGameButtons();
		},
		
		DeclareWar: function(){
			numClick+=3; if (!play) {Play();numClick-=1;};
			var self=this;
			
			if (this.GovType==="Democracy"){
				swal({
					title: "Are you sure?",
					html: "You are about to declare war to a democracy. You will be able to make peace afterwards. </br></br>Do you want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's go to war!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "War declared !", text: "War will start in 5 years", imageUrl: "image/War.jpg", imageWidth: 100});
					log(self.Name,"War will start in 5 years","red");
					self.warTimer=50;
					self.War=true;
					self.WarEffect = 1;
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "War cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
				
			} else if (this.GovType==="Totalitarism") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to declare war to a totalitarian regime, which is obviously a bad idea. </br></br>You will NOT be able to make peace afterwards. The regime will most probably crush you given the lack of supplies and the full support of the population. </br></br>Do you REALLY want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's go to war!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
						swal({title: "War declared !", text: "War will start in 5 years", imageUrl: "image/War.jpg", imageWidth: 100});
						log(self.Name,"War will start in 5 years","red");
						self.War=true;
						self.warTimer=50;
						self.WarEffect = 0.5;
						self.popPlanet[2] += self.popPlanet[1];
						self.popPlanet[1]=0;
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "War cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			} else if (this.GovType==="Autoritarism") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to declare war to a dictatorship. You will NOT be able to make peace afterwards. </br></br>Do you want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's go to war!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "War declared !", text: "War will start in 5 years", imageUrl: "image/War.jpg", imageWidth: 100});
					log(self.Name,"War will start in 5 years","red");
					self.War=true;
					self.warTimer=50;
					self.WarEffect = 1;
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "War cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			} else if (self.GovType==="Theocracy") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to declare war to a theocracy, which is not the best idea. </br></br>All your priest and prophets will fight you will all their strength. </br></br>Do you REALLY want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's go to war!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "War declared !", text: "War will start in 5 years", imageUrl: "image/War.jpg", imageWidth: 100});
					log(self.Name,"War will start in 5 years","red");
					self.War=true;
					self.warTimer=50;
					self.WarEffect = 0.5;
					self.popPlanet[2] += self.pop[4].value+self.pop[7].value;
					self.totalPopulation-=(self.pop[4].value+self.pop[7].value);
					self.pop[4].value=0;
					self.pop[7].value=0;
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "War cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});

			};
			this.calculateMainGameResources();
			updateGameResources(); 
			updateGameButtons();
		},
		
		RuleOfGod : function(){
			numClick+=3; if (!play) {Play();numClick-=1;};
			var self=this;
			
			if (this.GovType==="Democracy"){
				
				swal({
					title: "Are you sure?",
					html: "You are about to force a planet religion in a democracy, which is obviously a bad idea. </br></br>If you do so, the regime will crush your religious rebellion and declare you an endless war until you are completely forgotten from this planet. </br></br>Do you REALLY want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's enter holy crusade!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "Holy war declared !", text: "War will start in 5 years", imageUrl: "image/God.jpg", imageWidth: 100});
					log(self.Name,"War will start in 5 years","red");
					self.War=true;
					self.warTimer=50;
					self.WarEffect = 0.5;
					self.populationDead+=Math.round(self.pop[4].value/2)+Math.round(self.pop[7].value/2);
					self.totalPopulation-=Math.round(self.pop[4].value/2)+Math.round(self.pop[7].value/2);
					self.pop[4].value = Math.round(self.pop[4].value/2);
					self.pop[7].value = Math.round(self.pop[7].value/2);
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "Crusade cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			} else if (this.GovType==="Totalitarism") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to force a planet religion in a totalitarian regime. </br></br> Although not a bad idea, the regime will declare war but will remain weakened during the war. You will NOT be able to make peace afterwards. </br></br> Do you want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's force religion!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "Holy war declared !", text: "War will start in 5 years", imageUrl: "image/God.jpg", imageWidth: 100});
					log(self.Name,"War will start in 5 years","red");
					self.War=true;
					self.warTimer=50;
					self.WarEffect = 1/this.followersRatio;
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "Cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			} else if (this.GovType==="Autoritarism") {
				
				swal({title: "Not possible", text: "You cannot rule by religion in a dictatorship - this is against the interest of the Mighty Great Leader", imageUrl: "image/God.jpg"});
			
			} else if (this.GovType==="Theocracy") {
				
				swal({
					title: "Are you sure?",
					html: "You are about to force a planet religion in a theocracy. </br></br> You need to have converted at least 75% of the planet population to succeed, or you will loose followers. </br></br> Do you want to continue ?",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Yes, let's force religion!",
					cancelButtonText: "No, I made a mistake",
					width: 800
				}).then(function () {
					swal({title: "Religious crusade declared !", text: "There shall only be one true God", imageUrl: "image/God.jpg", imageWidth: 100});
					log(self.Name,"Holy shit - You enter a religious crusade","red");
					if (self.followersRate>75) {
						self.Win();
						Achievements["rael"].reached=true;
					} else {
						self.followers=self.followers*3/4;
						log(self.Name,"There shall only be one true God - unfortunately it is not you </br> You lost a quarter of your followers","red");
					};
				}, function (dismiss) {
					if (dismiss === 'cancel') {
						swal({title: "Cancelled", text: "Wise decision", imageUrl: "image/Peace.png", imageWidth: 100});
					};
				});
				
			};
			this.calculateMainGameResources();
			updateGameResources(); 
			updateGameButtons();
		},
		
		// Initialization
		Initialize: function(){
			document.getElementById('thiefButton').style.display = 'none';
			document.getElementById('soldierButton').style.display = 'none';
			document.getElementById('scientistButton').style.display = 'none';
			document.getElementById('politicianButton').style.display = 'none';
			document.getElementById('guruButton').style.display = 'none';
			document.getElementById('lobbistButton').style.display = 'none';
			document.getElementById('prophetButton').style.display = 'none';
			document.getElementById('recruiterButton').style.display = 'none';
			
			for (var Tech in this.techno) {
				document.getElementById(Tech).style.display= 'none';
			};
						
			document.getElementById('STEALTH').style.display = 'none';
			document.getElementById('FOLLOWERS').style.display = 'none';
			document.getElementById('APPROVAL').style.display = 'none';
			document.getElementById('FIREPOWER').style.display = 'none';
			document.getElementById('STUPIDITY').style.display = 'none';
			document.getElementById('BONUSRATE').style.display = 'none';
			document.getElementById('EVENTRATE').style.display = 'none';
			
			document.getElementById('PLANET').style.display = 'none';
			document.getElementById('THIEFS').style.display = 'none';
			document.getElementById('SCIENTISTS').style.display = 'none';
			document.getElementById('SOLDIERS').style.display = 'none';
			document.getElementById('POLITICIANS').style.display = 'none';
			document.getElementById('GURUS').style.display = 'none';
			document.getElementById('LOBBISTS').style.display = 'none';
			document.getElementById('PROPHETS').style.display = 'none';
			document.getElementById('RECRUITERS').style.display = 'none';
			document.getElementById('RECRUITERBUTTONS').style.display = 'none';
			
			document.getElementById("BuyShip").style.display = 'none';
			document.getElementById('DeclareWar').style.display = 'none';
			document.getElementById('OrganiseElections').style.display = 'none';
			document.getElementById('RuleOfGod').style.display = 'none';
			
			document.getElementById("Titre1").style.display = 'none'; 
			document.getElementById("Titre2").style.display = 'none';
			document.getElementById("Titre3").style.display = 'none';
			document.getElementById("Titre4").style.display = 'none';
			document.getElementById("Titre6").innerHTML = '   ';
			document.getElementById("Titre7").style.display = 'none';
			document.getElementById("Titre5").style.display = 'none';
		}
		
	};
};
		
function UpdateTechLevel() {
	for (var i=0;i<planets.length;i++){			
			if 			(planets[i].TechLevel>=4) 									{ planets[i].TechLevelText = "Futuristic"; }
			else if 	(3<=planets[i].TechLevel && planets[i].TechLevel <4) 		{ planets[i].TechLevelText = "High-tech"; }
			else if 	(2<=planets[i].TechLevel && planets[i].TechLevel <3) 		{ planets[i].TechLevelText = "Low-tech"; }
			else if 	(planets[i].TechLevel <2) 									{ planets[i].TechLevelText = "Primitive"; };
	};
};			
		
// Initialization of the game
// Source of the planets name & charact : https://en.wikipedia.org/wiki/List_of_Foundation_universe_planets

discoverPlanet('Earth', 'image/planet/i.jpg',30,30,40,7500000000,149000000,75000000000000,'Temperate','Democracy',3,100);
discoverPlanet('Comporellon', 'image/planet/d.jpg',40,50,10,2500000,10000000,40000000000,'Polar','Autoritarism',3,90);
discoverPlanet('Aurora', 'image/planet/l.jpg',50,100,40,200000000,25000000,11000000000000,'Harsh','Totalitarism',4,80);
discoverPlanet('Vega', 'image/planet/q.jpg',12,20,50,1500000000,55000000,7500000000000,'Grassland','Autoritarism',4,60);
discoverPlanet('Euterpe', 'image/planet/e.jpg',10,25,70,780000000,31000000,46000000000000,'Equatorial','Totalitarism',3,50);
discoverPlanet('Hesperos', 'image/planet/g.jpg',5,5,5,7200000,250000,150000000000,'Temperate','Totalitarism',2,40);
discoverPlanet('Solaria', 'image/planet/m.jpg',2,50,0,20000,7800,1200000000,'Arid','Theocracy',4,30);
discoverPlanet('Alpha', 'image/planet/j.jpg',250,5,5,2000000,15000,32000000000,'Maritime','Democracy',4,20);
discoverPlanet('Helicon', 'image/planet/r.jpg',3,15,72,2000000,7520000,2000000000,'Temperate','Theocracy',2,10);
discoverPlanet('Arcturus', 'image/planet/c.jpg',10,120,35,7500000000,2500000000,75000000000000,'Temperate','Totalitarism',2,0);
discoverPlanet('Derowd', 'image/planet/k.jpg',5,5,250,780000000,31000000,4000000000,'Dry','Democracy',1,0);
discoverPlanet('Eos', 'image/planet/h.jpg',100,4,45,2500000,7520000000,10000000000,'Ice cap','Totalitarism',4,0);
discoverPlanet('Kalgan', 'image/planet/p.jpg',72,200,180,120000000000,550000000,110000000000000000,'Semi-tropical','Totalitarism',4,0);
discoverPlanet('Terminus', 'image/planet/b.jpg',250,75,75,10200000000,55000000,7500000000000000,'Tropical','Democracy',4,0);
discoverPlanet('Trantor', 'image/planet/o.jpg',50,60,220,15000000000,194000000,850000000000000,'Humid continental','Autoritarism',4,0);
discoverPlanet('Gaia', 'image/planet/p.jpg',500,500,500,1000000000,10000000,100000000000,'Continental','Theocracy',1,0);
discoverPlanet('Gamma', 'image/planet/a.jpg',5,5,5,10000000,10000000,85000000000,'Lunar','Totalitarism',2,0);

planets[0].Revealled=true;
planets[0].Active=true;

for (var i=0;i<planets.length;i++){
	planets[i].calculateMainGameResources();
};
planets[0].calculateMainGameResources();planets[0].Initialize();
updateGameResources();
updateGameButtons();
updateMainPlanetData();

// Creates a new planet in the Chart tab
function CreateDivPlanet(Nb){
	var li = document.createElement('li');
	var span = document.createElement('span');
	span.innerHTML = planets[Nb].Name;
	span.setAttribute('id', 'planetButton'+Nb);
	span.setAttribute('onclick', "printCharts("+Nb+");");
	li.appendChild(span);
	document.getElementById("ULPlanet").appendChild(li);
};

function createDivPlayer(K){
	var tr = document.createElement('tr');
	var J=K+1;
	tr.innerHTML = "<td><b>"+ J +"</b></td>"+
					"<td><b>"+ users[K].name +"</b></td>"+
					"<td><b>"+ users[K].civilizationScore +"</b></td>";
	document.getElementById("PlayersTable").appendChild(tr);
};

function createDivEvent(Year,Name,Text,Class){
	var tr = document.createElement('tr');
	tr.innerHTML = "<td width=40px>"+Year+"</td><td width=40px>"+Name+"</td><td>"+Text+"</td>";
	tr.className=Class+ " LOG";
	document.getElementById("logTable").appendChild(tr);
};

// Creates a new planet in the Galaxy tab
function CreateDivGalaxy(Nb){
	
	var DisclaimerPlanet= document.createElement('div');
	DisclaimerPlanet.setAttribute('class', 'planetDisclaimer');
	DisclaimerPlanet.setAttribute('id', 'planetDisclaimer'+Nb);
	
	if(!planets[Nb].Revealled && planets[Nb].timeCount===0){
		DisclaimerPlanet.setAttribute('style', 'background-color: rgba(30,15,30,0.1);');
		DisclaimerPlanet.innerHTML="<div class='Infobox' style='margin-bottom: 0px; font-size: 12;'><i>Left click: </i>SEND SHIP </br> <i>Right click: </i>COMPARE </div>";
		DisclaimerPlanet.setAttribute('onclick', 'sendShip('+Nb+')');
	}
	else if (planets[Nb].timeCount>0){
		DisclaimerPlanet.setAttribute('style', 'background-color: rgba(30,15,30,0.1);');
		DisclaimerPlanet.innerHTML="<div class='Infobox' style='margin-bottom: 0px; font-size: 12;'><i>Right click: </i>COMPARE </div>";
	}
	else if (planets[Nb].Controlled){
		DisclaimerPlanet.setAttribute('style', 'background-color: #46D246;');
		DisclaimerPlanet.innerHTML="<div class='Infobox' style='margin-bottom: 0px; font-size: 12;'><i>Left click: </i>ACCESS PLANET </br><i>Right click: </i>COMPARE </div>";
		DisclaimerPlanet.setAttribute('onclick', 'selectPlanet('+Nb+')');
	}
	else if (planets[Nb].Lost){
		DisclaimerPlanet.setAttribute('style', 'background-color: #DB6A6A;');
		DisclaimerPlanet.innerHTML="<div class='Infobox' style='margin-bottom: 0px; font-size: 12;'><i>Right click: </i>COMPARE </div>";
	}
	else {
		DisclaimerPlanet.setAttribute('style', 'background-color: rgba(30,15,30,0.3);');
		DisclaimerPlanet.innerHTML="<div class='Infobox' style='margin-bottom: 0px; font-size: 12;'><i>Left click: </i>ACCESS PLANET </br><i>Right click: </i>COMPARE </div>";
		DisclaimerPlanet.setAttribute('onclick', 'selectPlanet('+Nb+')');
	};
	
	var Text0Planet = document.createElement('div');
	Text0Planet.setAttribute('class', 'PlanetTextVertical');
	var span = document.createElement('span');
	span.innerHTML = "<b>"+planets[Nb].Name+"</b>";
	span.setAttribute('style', 'writing-mode:vertical-rl;');
	Text0Planet.appendChild(span);
	
	planets[Nb].calculateMainGameResources();
	var Text1Planet = document.createElement('div');
	Text1Planet.setAttribute('class', 'PlanetText');
	Text1Planet.innerHTML = "<table><tr><td>Population: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].Population,0)+"</span></td></tr>"+
							"<tr><td>Area: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].Area,0)+"km2</span></td></tr>"+
							"<tr><td>GWP: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].GWP,0)+"$</span></td></tr>"+
							"<tr><td>Political system: </td><td ><span class='textPlanet'>"+planets[Nb].GovType+"</span></td></tr>"+
							"<tr><td>Climate: </td><td ><span class='textPlanet'>"+planets[Nb].Climate+"</span></td></tr>"+
							"<tr><td>Tech level: </td><td ><span class='textPlanet'>"+planets[Nb].TechLevelText+"</span></td></tr></table>";
	
	var Text2Planet = document.createElement('div');
	Text2Planet.setAttribute('class', 'PlanetText');
	
	Text2Planet.innerHTML = "<table><tr><td>Money cap: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].resources[0].initialCap,0)+"$</span></td></tr>"+
							"<tr><td>Science cap: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].resources[1].initialCap,0)+"</span></td></tr>"+
							"<tr><td>Weapons cap: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].resources[2].initialCap,0)+"</span></td></tr>"+
							"<tr><td>Faith cap: </td><td ><span class='textPlanet'>"+prettify(planets[Nb].resources[3].initialCap,0)+"</span></td></tr>"+
							"<tr><td>Soldiers: </td><td ><span class='textPlanet'>"+planets[Nb].Soldiers+"</span></td></tr>"+
							"<tr><td>Politicians: </td><td ><span class='textPlanet'>"+planets[Nb].Politicians+"</span></td></tr></table>";

	var ImagePlanet = document.createElement('div');
	ImagePlanet.setAttribute('class', 'ImagePlanetGalaxy');
	ImagePlanet.setAttribute('id','ImagePlanetGalaxy'+Nb);
		
	DisclaimerPlanet.appendChild(Text0Planet);
	DisclaimerPlanet.appendChild(Text1Planet);
	DisclaimerPlanet.appendChild(Text2Planet);
	DisclaimerPlanet.appendChild(ImagePlanet);
	
	document.getElementById("myNode").appendChild(DisclaimerPlanet);
	
	document.getElementById('planetDisclaimer'+Nb).oncontextmenu = function() {
		compareRadar(Nb);
	};
	
	if(!planets[Nb].Revealled && planets[Nb].timeCount===0){
		ImagePlanet.setAttribute('style', 'background-image:repeating-radial-gradient(circle, rgba(30,15,30,0.1), rgba(30,15,30,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);');
		ImagePlanet.innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Discovery chance:</p></br><p class='textPlanet'>"+planets[Nb].discoveryChance+"%</p></div>";
	} else if (planets[Nb].timeCount>80){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(30,15,30,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Take-off</p></div>";
	} else if (planets[Nb].timeCount>60){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(50, 205, 50,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Space travel</p></div>";
	} else if (planets[Nb].timeCount>20){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(50, 205, 50,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(50, 205, 50,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Space travel</p></div>";
	} else if (planets[Nb].timeCount>1){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(50, 205, 50,0.1) 22px,rgba(50, 205, 50,0.3) 22px, rgba(50, 205, 50,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Landing</p></div>";
	}else {
		ImagePlanet.setAttribute('style', 'background-image:url('+planets[Nb].Image+'); background-size: contain;');
	};
}

// New planet discovery

function BuyShip(){
	numClick+=1; if (!play) {Play();numClick-=1;};
	galaxyResources[0].value+=1;
	SHIPS+=1;
	Achievements["pauliac"].reached=true;
	for (var Nb=0;Nb<planets.length;Nb++){
		if (planets[Nb].Active){
			planets[Nb].SHIPSPLANET+=1;
		};
	};
	if (galaxyResources[0].value===1) {
		openStratPage();
		swal({title: "Space travel !", html: "You constructed a ship </br></br> You now have access to the galaxy strategic pannel to explore & conquer other planets", imageUrl: "image/Spaceship.jpg"});
		document.getElementById("changeScreenStrat").display="block";
	}
};

function sendShip(Nb){
	numClick+=3; if (!play) {Play();numClick-=1;};
	if (galaxyResources[0].value>=1){
		swal({
			title: 'Are you sure?',
			text: 'You are about to send one ship to '+planets[Nb].Name,
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, send it',
			cancelButtonText: 'No, maybe later',
		}).then(function() {
			galaxyResources[0].value-=1;
			planets[Nb].stage=4;
			planets[Nb].success=Math.random()*100;
			if(planets[Nb].discoveryChance<planets[Nb].success) {
				planets[Nb].stage=Math.min(3,Math.floor(Math.random()*4));
			};
			log(planets[Nb].Name, "You have sent a ship to "+planets[Nb].Name,"green");
			planets[Nb].timeCount=100;
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(30,15,30,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Take-off</p></div>";
		});	
	};
};
	
function updateShipStatus(Nb){

	if (planets[Nb].timeCount===80){
		if(planets[Nb].stage>=1){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(50, 205, 50,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Space travel</p></div>";
		} else {
			swal('Failure','The ship to '+planets[Nb].Name+' was destroyed during the take-off phase','error');
			log(planets[Nb].Name, "Ship destroyed","red");
			planets[Nb].timeCount=0;
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(30,15,30,0.1), rgba(30,15,30,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Discovery chance:</p></br><p class='textPlanet'>"+planets[Nb].discoveryChance+"%</p></div>";
		};
	}
	if (planets[Nb].timeCount===60){
		if(planets[Nb].stage>=2){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(50, 205, 50,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(50, 205, 50,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Space travel</p></div>";
		} else {
			swal('Failure','The ship to '+planets[Nb].Name+' was destroyed during the travel phase','error');
			log(planets[Nb].Name, "Ship destroyed","red");
			planets[Nb].timeCount=0;
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(30,15,30,0.1), rgba(30,15,30,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Discovery chance:</p></br><p class='textPlanet'>"+planets[Nb].discoveryChance+"%</p></div>";
		};
	}
	if (planets[Nb].timeCount===20){
		if(planets[Nb].stage>=3){
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(50, 205, 50,0.1), rgba(50, 205, 50,0.1) 22px,rgba(50, 205, 50,0.3) 22px, rgba(50, 205, 50,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Ship sent</p><p class='textPlanet'>Landing</p></div>";
		} else {
			swal('Failure','The ship to '+planets[Nb].Name+' was destroyed during the landing phase','error');
			log(planets[Nb].Name, "Ship destroyed","red");
			planets[Nb].timeCount=0;
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:repeating-radial-gradient(circle, rgba(30,15,30,0.1), rgba(30,15,30,0.1) 22px,rgba(30,15,30,0.3) 22px, rgba(30,15,30,0.2) 44px);';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="<div class='bubble'><p style='color:black; top: 50px;'>Discovery chance:</p></br><p class='textPlanet'>"+planets[Nb].discoveryChance+"%</p></div>";
		};
	}
	if (planets[Nb].timeCount===1){
		if(planets[Nb].stage>=4){
			
			swal('Good job!','You have discovered '+planets[Nb].Name+' !','success');
			log(planets[Nb].Name, "Ship successfully landed - You have discovered "+planets[Nb].Name+' !',"green");
			
			document.getElementById('ImagePlanetGalaxy'+Nb).style= 'background-image:url('+planets[Nb].Image+'); background-size: contain;';
			document.getElementById('ImagePlanetGalaxy'+Nb).innerHTML="";
			document.getElementById('planetDisclaimer'+Nb).style='background-color: rgba(30,15,30,0.3);';
			document.getElementById('planetDisclaimer'+Nb).onclick=function () { selectPlanet(Nb); };
			discoverNewPlanet(Nb);
		};
	};
}
		
function discoverNewPlanet(Nb){
	for (var i=0;i<planets.length;i++){
		if (planets[i].Active){
			 planets[i].Active=false;
		};
	};
	planets[Nb].Revealled=true;
	changePlanet(Nb);
	var displayedChartTransition=displayedChart;
	displayedChart="Null";
	changeChart(displayedChartTransition);
}

// Switch between planets

function updateOnclickChange(planetNb){
	document.getElementById("moneyButton").onclick		= function () { planets[planetNb].StealMoney(2500); };	
	document.getElementById("thiefButton").onclick		= function () { planets[planetNb].Hire(0); };
	document.getElementById("scientistButton").onclick	= function () { planets[planetNb].Hire(1); };
	document.getElementById("soldierButton").onclick	= function () { planets[planetNb].Hire(2); };
	document.getElementById("politicianButton").onclick	= function () { planets[planetNb].Hire(3); };
	document.getElementById("guruButton").onclick		= function () { planets[planetNb].Hire(4); };
	document.getElementById("lobbistButton").onclick	= function () { planets[planetNb].Hire(5); };
	document.getElementById("prophetButton").onclick	= function () { planets[planetNb].Hire(6); };
	document.getElementById("recruiterButton").onclick	= function () { planets[planetNb].Hire(7); };
	
	document.getElementById("DeclareWar").onclick		= function () { planets[planetNb].DeclareWar(); };
	document.getElementById("OrganiseElections").onclick= function () { planets[planetNb].OrganiseElections(); };
	document.getElementById("RuleOfGod").onclick		= function () { planets[planetNb].RuleOfGod(); };
	document.getElementById("BuyShip").onclick			= function () { planets[planetNb].BuyShip(); };
	document.getElementById("MakePeace").onclick		= function () { planets[planetNb].MakePeace(); };
	
	document.getElementById("pickpocketTraining").onclick= function () { planets[planetNb].BuyTechno("pickpocketTraining"); };
	document.getElementById("drugLab").onclick= function () { planets[planetNb].BuyTechno("drugLab"); };
	document.getElementById("armedRobbery").onclick= function () { planets[planetNb].BuyTechno("armedRobbery"); };
	document.getElementById("mortgageFund").onclick= function () { planets[planetNb].BuyTechno("mortgageFund"); };
	document.getElementById("IA").onclick= function () { planets[planetNb].BuyTechno("IA"); };
	document.getElementById("automation").onclick= function () { planets[planetNb].BuyTechno("automation"); };
	document.getElementById("hoursWeek").onclick= function () { planets[planetNb].BuyTechno("hoursWeek"); };
	document.getElementById("underpaidIntern").onclick= function () { planets[planetNb].BuyTechno("underpaidIntern"); };
	document.getElementById("mercenaries").onclick= function () { planets[planetNb].BuyTechno("mercenaries"); };
	document.getElementById("warChild").onclick= function () { planets[planetNb].BuyTechno("warChild"); };
	document.getElementById("drones").onclick= function () { planets[planetNb].BuyTechno("drones"); };
	document.getElementById("cyberAttack").onclick= function () { planets[planetNb].BuyTechno("cyberAttack"); };
	document.getElementById("createCult").onclick= function () { planets[planetNb].BuyTechno("createCult"); };
	document.getElementById("weeklyMeetings").onclick= function () { planets[planetNb].BuyTechno("weeklyMeetings"); };
	document.getElementById("area51").onclick= function () { planets[planetNb].BuyTechno("area51"); };
	document.getElementById("pacificIsland").onclick= function () { planets[planetNb].BuyTechno("pacificIsland"); };
	document.getElementById("darkSideOfTheMoon").onclick= function () { planets[planetNb].BuyTechno("darkSideOfTheMoon"); };
	document.getElementById("wallStreet").onclick= function () { planets[planetNb].BuyTechno("wallStreet"); };
	document.getElementById("taxHeavens").onclick= function () { planets[planetNb].BuyTechno("taxHeavens"); };
	document.getElementById("internet").onclick= function () { planets[planetNb].BuyTechno("internet"); };
	document.getElementById("wikipedia").onclick= function () { planets[planetNb].BuyTechno("wikipedia"); };
	document.getElementById("badNeighborhood").onclick= function () { planets[planetNb].BuyTechno("badNeighborhood"); };
	document.getElementById("submarine").onclick= function () { planets[planetNb].BuyTechno("submarine"); };
	document.getElementById("buildPyramids").onclick= function () { planets[planetNb].BuyTechno("buildPyramids"); };
	document.getElementById("knife").onclick= function () { planets[planetNb].BuyTechno("knife"); };
	document.getElementById("machineGun").onclick= function () { planets[planetNb].BuyTechno("machineGun"); };
	document.getElementById("ballisticMissile").onclick= function () { planets[planetNb].BuyTechno("ballisticMissile"); };
	document.getElementById("nanovirus").onclick= function () { planets[planetNb].BuyTechno("nanovirus"); };
	document.getElementById("holligans").onclick= function () { planets[planetNb].BuyTechno("holligans"); };
	document.getElementById("facebook").onclick= function () { planets[planetNb].BuyTechno("facebook"); };
	document.getElementById("flatEarthTheory").onclick= function () { planets[planetNb].BuyTechno("flatEarthTheory"); };
	document.getElementById("candyCrush").onclick= function () { planets[planetNb].BuyTechno("candyCrush"); };
	document.getElementById("writeHollyBook").onclick= function () { planets[planetNb].BuyTechno("writeHollyBook"); };
	document.getElementById("humanSacrifice").onclick= function () { planets[planetNb].BuyTechno("humanSacrifice"); planets[planetNb].KillRandom(); log(planets[planetNb].Name, "You sacrificed an heretic", "red"); };
	document.getElementById("wololo").onclick= function () { planets[planetNb].BuyTechno("wololo"); };
	document.getElementById("inquisition").onclick= function () { planets[planetNb].BuyTechno("inquisition"); planets[planetNb].Population=80/100*planets[planetNb].Population;  updateMainPlanetData(); log(planets[planetNb].Name, "Nobody expects the Spanish inquisition : 20% of the planet population was killed", "red"); };
	document.getElementById("microphone").onclick= function () { planets[planetNb].BuyTechno("microphone"); };
	document.getElementById("politicalParty").onclick= function () { planets[planetNb].BuyTechno("politicalParty"); };
	document.getElementById("massMedia").onclick= function () { planets[planetNb].BuyTechno("massMedia"); };
	document.getElementById("makeAmerica").onclick= function () { planets[planetNb].BuyTechno("makeAmerica"); };
	document.getElementById("blackmail").onclick= function () { planets[planetNb].BuyTechno("blackmail"); };
	document.getElementById("HRManagement").onclick= function () { planets[planetNb].BuyTechno("HRManagement"); };
	document.getElementById("oilIndustry").onclick= function () { planets[planetNb].BuyTechno("oilIndustry"); };
	document.getElementById("fuckImOuttaHere").onclick= function () { planets[planetNb].BuyTechno("fuckImOuttaHere"); };

	// TO DO : understand why the function below does not work
	/*
	var A = Object.keys(planets[planetNb].techno).length;
	for (var i=0; i<A; i++) {
		var Tech = Object.getOwnPropertyNames(planets[planetNb].techno)[i];
		document.getElementById(Tech).onclick= function () {planets[planetNb].BuyTechno(Tech);};
	 };
	 
	for (var Tech in planets[planetNb].techno) {
		document.getElementById(Tech).onclick= function () {planets[planetNb].BuyTechno(Tech);};
	};*/
};

// Switch planet functions

function changePlanet(Nb){
	planets[Nb].Active=true;
	planets[Nb].calculateMainGameResources();
	planets[Nb].Initialize();
	updateGameResources();
	updateGameButtons();
	updateMainPlanetData();
	updateOnclickChange(Nb);
	if (planets[Nb].Lost){
		for (var i=1;i<5;i++){document.getElementById("B"+i).style.display="none";};
		document.getElementById("lostBar").style.display = 'block';
	} else{
		for (var i=1;i<5;i++){document.getElementById("B"+i).style.display="block";};
		document.getElementById("lostBar").style.display = 'none';
	};
};

var NB=0;

function nextPlanet(Nb){
	NB=Nb;
	var L= planets.length;
	if (NB+1<L){
		NB+=1;
		if (!planets[NB].Revealled) {
			nextPlanet(NB);
		};
	} else {
		if (planets[0].Revealled){
			NB=0;
		} else {
			nextPlanet(0);
		};
	};
};

function previousPlanet(Nb){
	NB=Nb;
	var L= planets.length;
	if (NB>0){
		NB-=1;
		if (!planets[NB].Revealled) {
			previousPlanet(NB);
		};
	} else {
		if (planets[L-1].Revealled){
			NB=L-1;
		} else {
			previousPlanet(L-1);
		};
	};
};

function changePlanetPlus(){
	numClick+=1;
	var Nb=0;
	for (var i=0;i<planets.length;i++){
		if (planets[i].Active){
			Nb=i;
		};
	};
	planets[Nb].Active=false;
	nextPlanet(Nb);
	changePlanet(NB);
	var displayedChartTransition=displayedChart;
	displayedChart="Null";
	changeChart(displayedChartTransition);
};

function changePlanetMoins(){
	numClick+=1;
	var Nb=0;
	for (var i=0;i<planets.length;i++){
		if (planets[i].Active){
			Nb=i;
		};
	};
	planets[Nb].Active=false;
	previousPlanet(Nb);
	changePlanet(NB);
	var displayedChartTransition=displayedChart;
	displayedChart="Null";
	changeChart(displayedChartTransition);
};	

function selectPlanet(Nb){
	numClick+=1; 
	for (var i=0;i<planets.length;i++){
		planets[i].Active=false;
	};
	planets[Nb].Active=true;
	
	changePlanet(Nb);
	
	var displayedChartTransition=displayedChart;
	displayedChart="Null";
	changeChart(displayedChartTransition);
	
	closeStratPage();
};	

//////////////////
// ACHIEVEMENTS //
//////////////////

// Global achievement functions

var AchievementsReached=0;

function nbPlanetControlled(){
	var k=0;
	for (var i=0;i<planets.length;i++){
		if (planets[i].Controlled){
			k+=1;
		};
	};
	return k;
};
function nbDeathsTotal(){
	var k=0;
	for (var i=0;i<planets.length;i++){
		k+=planets[i].populationDead;
	};
	return k;
};

function verifyAchievements(){
	
	if (nbPlanetControlled()>=10){Achievements["napoleon"].reached=true;};
	if (nbDeathsTotal()>=10){Achievements["khan"].reached=true;};
	if (planets[0].UPGRADESPLANET===44){Achievements["ELI5"].reached=true;};
	
	for (var Nb=0;Nb<planets.length;Nb++){
		if (planets[Nb].Controlled) { Achievements["cesar"].reached=true; };
		if (planets[Nb].resources[0].value>=1000000){ Achievements["gates"].reached=true; };
		if (planets[Nb].pop[3].value>=30){ Achievements["kabila"].reached=true; };
		if (planets[Nb].pop[6].value>=30){ Achievements["jesus"].reached=true; };
		if (planets[Nb].bonusRate>=1){ Achievements["bonus"].reached=true; };
		if (galaxyTechno["orbitalSupport"].value*0.2>=1){ Achievements["cap"].reached=true; };
		if (Time>=10*3600*24/10){ Achievements["addict"].reached=true; };
		if (Time>=2*3600/10){ Achievements["beginner"].reached=true; };
		if (galaxyResources[2]>=42){ Achievements["pandora"].reached=true; };
		if (numClick>=5181){ Achievements["click"].reached=true; };
		if (civilizationScore>=1000){ Achievements["CivVI"].reached=true; };
	};
};

var Achievements = {
	jobInterview: {name: "Job interview", condition: "Recruit someone", reached: false},
	cesar: {name: "Ave, Cesar", condition: "Conquer a planet by any mean", reached: false},
	trump: {name: "Donald Trump", condition: "Conquer a planet through politics", reached: false},
	rael: {name: "Hallelujah", condition: "Conquer a planet through religion", reached: false},
	putin: {name: "Vladimir Putin", condition: "Conquer a planet through military power", reached: false},
	hillary: {name: "Hillary Clinton", condition: "Loose a planet", reached: false},
	napoleon: {name: "Napoleon", condition: "Conquer 10 planets", reached: false},
	pauliac : {name: "F. Pauliac", condition: "Build a ship", reached: false},
	gates: {name: "Bill Gates", condition: "Reach 1 M$", reached: false},
	kabila: {name: "Kabila", condition: "Have 30 politicians or more on a planet", reached: false},
	jesus: {name: "Jesus", condition: "Have 30 prophets or more on a planet", reached: false},
	bonus: {name: "A. Estanislao", condition: "Reach a bonus rate of 100%", reached: false},
	cap: {name: "Uncle Scrooge", condition: "Double the resources' cap", reached: false},
	khan: {name: "Gengis Khan", condition: "More than 100 deaths", reached: false},
	addict: {name: "Addict", condition: "Play for more than 10 days", reached: false},
	beginner: {name: "Way to go", condition: "Play for more than 2 hours", reached: false},
	pandora: {name: "Pandora", condition: "Reach 42 unobtainium", reached: false},
	click:{name: "Just. One. More.", condition: "5181 clicks", reached: false},
	// TO DO thankyou:{name: "Thank you !", condition: "Share this game", reached: false},
	// TO DO goldstar:{name: "Reddit gold", condition: "Contribute to the game development", reached: false},
	ELI5:{name: "ELI5", condition: "Research all updates on Earth", reached: false},
	CivVI:{name: "Civilization VI", condition: "Reach a civilization score of 1000", reached:false}
};


function createDivAchievement(Achievement){
	if (document.getElementById(Achievements[Achievement].name)===null){
		var DivAchievement=document.createElement('div');
		var colour=Colour();
		if (Achievement ==="goldstar"){
			var A="<td style='width:15%; min-width:50px;'><img src='image/AchievementGold.png' style='width:40px'></td>";
		} else {
			var A="<td style='width:15%; min-width:50px;'><img src='image/Achievement.png' style='width:40px'></td>";
		};
		DivAchievement.setAttribute('class', 'container');
		DivAchievement.setAttribute('id', Achievements[Achievement].name);
		DivAchievement.setAttribute('style', 'width:94%; background-color:'+colour+'0.6); padding:1%;');
		DivAchievement.innerHTML = 
			"<table><tr>"+
			A+
			"<td style='width:25%; min-width:150px'><b>"+Achievements[Achievement].name+"</b></td>"+
			"<td>"+Achievements[Achievement].condition+"</td>"+
			"</tr></table>";
		document.getElementById("myNode2").appendChild(DivAchievement);
	};
};

// Not used in order not to add too many alerts

/*function reachAnAchievement(Achievement){
	AchievementsReached+=1;
	Achievements[Achievement].reached=true;
	swal({
		title: "Achievement unlocked!",
		text: Achievements[Achievement].name+" - "+Achievements[Achievement].condition,
		timer: 3000,
		showConfirmButton: true,
		imageUrl: "image/Achievement.png"
	});
};*/ 

function updateStats(){
	
	var BONUSRATE2=10*nbPlanetControlled()+0.1*nbDeathsTotal()+galaxyTechno.intergalacticTrade.value*20;
	var TIMEPLAYED=duration(Time*10);
	var TIMEREALLYPLAYED=duration(YearsREALLYPLAYED*10);
	
	UpdateValue("NUMCLICKS",numClick,0);
	UpdateValue("SHIPS",SHIPS,0);
	UpdateValue("PLANETSCONQUERED",nbPlanetControlled(),0);
	UpdateValue("PLANETSLOST",PLANETSLOST,0);
	UpdateValue("BONUSRATE2",BONUSRATE2,0);
	UpdateValue("NUMPEOPLE",NUMPEOPLE,0);
	UpdateValue("NUMDEATHS",nbDeathsTotal(),0);
	UpdateValue("TIMEPLAYED",TIMEPLAYED,0);
	UpdateValue("TIMEREALLYPLAYED",TIMEREALLYPLAYED,0);
	UpdateValue("CIVILIZATIONSCORE",civilizationScore,0);

	for (var Nb=0;Nb<planets.length;Nb++){
		if (planets[Nb].Active){
			UpdateValue("TIMEPLANET",duration(planets[Nb].TIMEPLANET*10),0);
			UpdateValue("UPGRADESPLANET",planets[Nb].UPGRADESPLANET,0);
			UpdateValue("POPULATIONPLANET",planets[Nb].totalPopulation,0);
			UpdateValue("SHIPSPLANET",planets[Nb].SHIPSPLANET,0);
		};
	};
};				

////////////
// EVENTS //
////////////

var eventRessource = [
	{ logArray:["This is your lucky day", "You robbed a famous painting", "That was a large wallet", "Your bank made a mistake"], ressource:0},
	{ logArray:["This is your lucky day", "You made a fantastic discovery today", "Well, that was unexpected", "Suddenly, everything exploded"], ressource:1},
	{ logArray:["This is your lucky day", "Look what I found on the plane", "You have dinner with the mafia", "You find an old battlefield"], ressource:2},
	{ logArray:["This is your lucky day", "Wololo wololo wololo", "Bring your kid to church week", "Public stoning"], ressource:3}
];

var eventRate = [
	{ logArray:["It's dividends time", "Your drug cartel finds a new delivery system", "You hacked the bank computer system", "People don't trust the system anymore and carry lots of cash"], ressource:0},
	{ logArray:["Rise of science salaries", "Nerds are becoming less popular and focus on their work", "NASA fundings", "Publication of fake papers"], ressource:1},
	{ logArray:["Civil war occuring", "Terror attack in capital city", "Rise of delinquency", "Weapons mandatory in each university"], ressource:2},
	{ logArray:["It's a miracle ! Allelluia ", "Still no answer to the Life & Death question", "Gurus supply food & shelter", "Prophet turned water into wine"], ressource:3},
	{ logArray:["Bankrupcy - there is no one to steal anymore", "Your drug dealer consumes too much drugs","Stock market crash", "Increasing number of surveillance cameras"], ressource:0},
	{ logArray:["Percentage of scientists having a girlfriend has risen", "Stupidity reaches high levels", "Global warming is considered a prank", "Some chinese paper contradicts gravity"], ressource:1},
	{ logArray:["Peace treaty signed - civil war ended" ,"Embargo in the developping countries", "No more steel for ammunition", "Reduction of armed robberies"], ressource:2},
	{ logArray:["Death of the pope", "Scientific discovery contradicts the Holly Book", "Church child abuse", "A prophet has a headache"], ressource:3},
];

var eventPop = ["THE DELUGE", "NUCLEAR MELTDOWN", "METEORITE", "SUPERVOLCANO", "BUBONIC PLAGUE", "EBOLA"];

function selectRandomRevealledPlanet(){
	var J=Math.min(planets.length-1,Math.floor(Math.random()*planets.length));
	if (planets[J].Revealled) {
		return J;
	} else {
		return selectRandomRevealledPlanet();
	};
};

function createEvent(){
	
	if (Math.random()<0.0001 && timeBetweenEvents1===0){
		var J=selectRandomRevealledPlanet();
		if (!planets[J].Lost && planets[J].Revealled){
			var I=Math.min(eventRessource.length-1, Math.floor(Math.random()*eventRessource.length));
			var K=Math.min(eventRessource[I].logArray.length-1,Math.floor(Math.random()*eventRessource[I].logArray.length)); 
			var Value = Math.floor(Math.random()*750+250);
			timeBetweenEvents1=15;
			log(planets[J].Name, eventRessource[I].logArray[K]+" : +"+Value+" "+planets[J].resources[eventRessource[I].ressource].name,"blue");
			planets[J].resources[eventRessource[I].ressource].value=Math.min(planets[J].resources[eventRessource[I].ressource].value+Value,planets[J].resources[eventRessource[I].ressource].cap);
		};
	};
	
	if (Math.random()<0.00001 && timeBetweenEvents2===0){
		var J=selectRandomRevealledPlanet();
		if (!planets[J].Lost && planets[J].Revealled){
			var K=Math.min(eventRate[I].logArray.length-1,Math.floor(Math.random()*eventRate[I].logArray.length)); 
			var I=Math.min(eventRate.length-1, Math.floor(Math.random()*eventRate.length));
			var Value = Math.floor(Math.random()*25+10);
			if (I >3) {Value=-Value;};
			var Duration = Math.round(Math.random()*5+1.5);
			if (Value>=0){
				log(planets[J].Name, eventRate[I].logArray[K]+" : "+planets[J].resources[eventRate[I].ressource].name+" rate +"+Value+"% during "+Duration+" minutes","green");
			} else {
				log(planets[J].Name, eventRate[I].logArray[K]+" : "+planets[J].resources[eventRate[I].ressource].name+" rate "+Value+"% during "+Duration+" minutes","red");
			};
			planets[J].eventDuration=Duration*60;
			planets[J].resources[eventRate[I].ressource].EventEffect+=Value/100;
			timeBetweenEvents2=60;
		};
	};
	
	if (Math.random()<0.000001 && timeBetweenEvents3===0){
		var J=selectRandomRevealledPlanet();
		if (!planets[J].Lost && planets[J].Revealled){
			var Value1 = Math.floor(Math.random()*25);
			var Value2 = Math.round(Math.random()*5);
			var Value3 = Math.round(Math.random()*5);
			var K=Math.min(eventPop.length-1,Math.floor(Math.random()*eventPop.length)); 
			log(planets[J].Name, eventPop[K]+" : "+Value1+"% of the planet population died. </br> Among them were "+Value2+" of your people and "+Value3+" of the planet's people","red");
			planets[J].Population=(100-Value1)/100*planets[J].Population;
			for (var i=0; i<Value2; i++){
				planets[J].KillRandom();
			};
			for (var i=0; i<Value3; i++){
				planets[J].KillRandomPlanet();
			};
			timeBetweenEvents3=300;
			updateMainPlanetData();
			updateGameResources();
			updateGameButtons();
		};
	};
};

function log(planet,message,className){
	createDivEvent(monthsTime(),planet,message,className);
};

function logRandom(planet, Array,typeOfEvent){
	log(planet,Array[Math.floor(Math.random()*Array.length)],typeOfEvent);
};

function clearLog(){
	document.getElementById("logTable").innerHTML="";
	numClick+=1;
};
function plusLog(){
	var H=document.getElementById("logDiv").style.height;
	H = parseInt(H.substring(0,H.length-1))+5;
	document.getElementById("logDiv").style.height=H+"%";
	numClick+=1;
};
function minusLog(){
	var H=document.getElementById("logDiv").style.height;
	H = Math.max(10,parseInt(H.substring(0,H.length-1))-5);
	document.getElementById("logDiv").style.height=H+"%";
	numClick+=1;
};

////////////////////////////////
// HTML UPDATE FOR GAME ITEMS //
////////////////////////////////

function UpdateButton(condition,Id){
	if (condition){document.getElementById(Id).className="TT ActionButton";} else { document.getElementById(Id).className="TT ActionButtonDisabled"; };
};
function UpdateColorValue(condition,Id){
	if (condition){document.getElementById(Id).className="green";} else { document.getElementById(Id).className="red"; };
};
function UpdateValue(Id, value, nbDec){
	document.getElementById(Id).innerHTML=prettify(value, nbDec);
};
function UpdateTimeTill(Id, value){
	document.getElementById(Id).innerHTML=duration(value);
};

function updateMainPlanetData(){
	for (var i=0;i<planets.length;i++){
		if (planets[i].Active){
			
			document.getElementById("PlanetImage").src=planets[i].Image;
			UpdateValue("planetName",planets[i].Name,0); 
			UpdateValue("planetPopulation",planets[i].Population,0); 
			UpdateValue("planetArea",planets[i].Area,0); 
			UpdateValue("planetGWP",planets[i].GWP,0); 
			UpdateValue("planetStatus",planets[i].WarStatus,0); 
			UpdateValue("planetPoliticalSystem",planets[i].GovType,0); 
			UpdateValue("planetClimate",planets[i].Climate,0); 
			
			UpdateTechLevel();
			UpdateValue("techLevel",planets[i].TechLevelText,0); 
			
		};
	};
};

function updateGameResources(){
	for (var i=0;i<planets.length;i++){
		if (planets[i].Active){
					
			UpdateValue("stealth",planets[i].stealth,1); 
			UpdateValue("followers",planets[i].followers,0); 
			UpdateValue("followersRate",planets[i].followersRate,0); 
			UpdateValue("approvalRate",planets[i].approvalRate*100,1); 
			UpdateValue("firepower",planets[i].firepower,0); 
			UpdateValue("stupidity",planets[i].stupidity*100,1);
			UpdateValue("bonusRate",planets[i].bonusRate*100,1);
			UpdateValue("planetFirepower",planets[i].planetFirepower,0); 			
			
			for (var k=0;k<4;k++){
				UpdateValue(planets[i].resources[k].name,planets[i].resources[k].value,1);
				UpdateValue(planets[i].resources[k].name+"Rate",planets[i].resources[k].rate,1); 
				UpdateValue(planets[i].resources[k].name+"Cap",planets[i].resources[k].cap,1);
				
				document.getElementById(planets[i].resources[k].name+"Base").innerHTML=prettify(planets[i].baseProdPop[k], 0)+" /s";
				document.getElementById(planets[i].resources[k].name+"UpgradesRate").innerHTML="<i>"+"+ "+prettify(planets[i].updatesEffect[k]*100, 0)+"%"+"</i>";
				document.getElementById(planets[i].resources[k].name+"LobbistRate").innerHTML="<i>"+"+ "+prettify(planets[i].lobbistEffect[k]*100, 0)+"%"+"</i>";
				document.getElementById(planets[i].resources[k].name+"EventRate").innerHTML="<i>"+prettify(planets[i].resources[k].EventEffect*100, 0)+"%"+"</i>";
				document.getElementById(planets[i].resources[k].name+"BonusRate").innerHTML="<i>"+"+ "+prettify(planets[i].bonusRate*100, 0)+"%"+"</i>";
				document.getElementById(planets[i].resources[k].name+"Conso").innerHTML=prettify(planets[i].populationCost[k], 0)+" /s";
				
				UpdateTimeTill(planets[i].resources[k].name+"TimeTillCap",planets[i].resources[k].timeTillCap,0);
			};
				
			for (var j=0;j<planets[i].pop.length;j++){
				for (var k=0;k<4;k++){
					UpdateValue(planets[i].pop[j].name+planets[i].resources[k].name+"Cost",planets[i].pop[j].cost[k],0);
					UpdateValue(planets[i].pop[j].name+planets[i].resources[k].name+"Gain",planets[i].pop[j].prod[k],1);
					
				};
				document.getElementById(planets[i].pop[j].name+"percentage").style.width=planets[i].pop[j].percentageBuyable+"%";
				UpdateValue(planets[i].pop[j].name+"s",planets[i].pop[j].value,0);
				UpdateTimeTill(planets[i].pop[j].name+"timeTillAffordable",planets[i].pop[j].timeTillAffordable,0);
			};
			
			for (var Tech in planets[i].techno){
				for (var k=0;k<4;k++){
					UpdateValue(planets[i].resources[k].name+"Cost"+Tech,planets[i].techno[Tech].cost[k],0);
				};
				UpdateTimeTill("timeTillAffordable"+Tech, planets[i].techno[Tech].timeTillAffordable);
				document.getElementById("percentage"+Tech).style.width=planets[i].techno[Tech].percentageBuyable+"%";
			};
			
			UpdateValue("recruitersFree",planets[i].pop[7].valueFree,0);
			UpdateValue("recruitScientistNumber",planets[i].pop[7].recruitScientistNumber,0);
			UpdateValue("recruitSoldierNumber",planets[i].pop[7].recruitSoldierNumber,0);
			UpdateValue("recruitPoliticianNumber",planets[i].pop[7].recruitPoliticianNumber,0);
			UpdateValue("recruitGuruNumber",planets[i].pop[7].recruitGuruNumber,0);
			
			UpdateValue("recruitScientistRate",planets[i].recruitScientistRate,0);
			UpdateValue("recruitSoldierRate",planets[i].recruitSoldierRate,0);
			UpdateValue("recruitPoliticianRate",planets[i].recruitPoliticianRate,0);
			UpdateValue("recruitGuruRate",planets[i].recruitGuruRate,0);
			
			UpdateValue("scientistPlanet",planets[i].popPlanet[1],0); 
			UpdateValue("soldierPlanet",planets[i].popPlanet[2],0); 
			UpdateValue("politicianPlanet",planets[i].popPlanet[3],0); 
			
			UpdateValue("totalPopulation",planets[i].totalPopulation,0);
			UpdateValue("populationCap",planets[i].populationCap,0);
			
			if (planets[i].War){planets[i].WarStatus="WAR"} else {planets[i].WarStatus="Peace"};
			UpdateValue("planetStatus",planets[i].WarStatus,0);
			UpdateColorValue(!planets[i].War,"planetStatus");
			
			document.getElementById("stealthPopulation").innerHTML=prettifyOnly(planets[i].totalPopulation*5);
			document.getElementById("stealthUpgrades").innerHTML="<i>"+(-prettifyOnly(planets[i].stupidity*100))+"%</i>";
			document.getElementById("stealthProphets").innerHTML=-prettifyOnly(planets[i].pop[6].value*15);
			
			document.getElementById("followersRateGurus").innerHTML=prettifyOnly(100*planets[i].pop[4].value);
			document.getElementById("followersRateProhpets").innerHTML=prettifyOnly(2/10000000*planets[i].Population*planets[i].pop[6].value);
			document.getElementById("followersRateUpgrades").innerHTML="<i>+ "+prettifyOnly(((1+planets[i].techno.writeHollyBook.effect)*(1+planets[i].techno.humanSacrifice.effect)*(1+planets[i].techno.wololo.effect)*(1+planets[i].techno.inquisition.effect)-1)*100)+"%</i>";
			
			document.getElementById("approvalPoliticians").innerHTML=prettifyOnly(planets[i].pop[3].value*3);
			document.getElementById("approvalStupidity").innerHTML="<i>+ "+prettifyOnly(Math.max(0.1,planets[i].stupidity)*100)+"%</i>";
			document.getElementById("approvalUpgrades").innerHTML="<i>+ "+prettifyOnly(((1+planets[i].techno.microphone.effect)*(1+planets[i].techno.massMedia.effect)*(1+planets[i].techno.makeAmerica.effect)-1)*100)+"%</i>";
			
			document.getElementById("firepowerSoldiers").innerHTML=prettifyOnly(planets[i].pop[2].value);
			document.getElementById("firepowerUpgrades").innerHTML="<i>+ "+prettifyOnly(((1+planets[i].techno.knife.effect)*(1+planets[i].techno.machineGun.effect)*(1+planets[i].techno.ballisticMissile.effect)*(1+planets[i].techno.nanovirus.effect)-1)*100)+"%</i>";
			
			document.getElementById("firepowerSoldiersPlanet").innerHTML=prettifyOnly(planets[i].popPlanet[2]);
			document.getElementById("techLevelPlanet").innerHTML="<i>+ "+prettifyOnly((Math.pow(2,planets[i].TechLevel)-1)*100)+"%</i>";
			
			document.getElementById("bonusRatepopDead").innerHTML=prettifyOnly(0.9*planets[i].populationDead)+"%";
			document.getElementById("bonusRateconqPlanet").innerHTML=prettifyOnly(10*nbPlanetControlled())+"%";
			document.getElementById("bonusRatetotpopDead").innerHTML=prettifyOnly(0.1*nbDeathsTotal())+"%";
			document.getElementById("bonusRategalaxyUpdates").innerHTML=galaxyTechno.intergalacticTrade.value*20+"%";
			document.getElementById("bonusRatewarEffect").innerHTML="<i>x "+prettifyOnly(Math.pow(planets[i].WarEffect,2))+"</i>";
		};
	};
};

function disactivateAllButtons(){
	//CAREFUL ! This function does not prevent from clicking, it just changes the button style
	for (var nb=0;nb<planets.length;nb++){
		if (planets[nb].Active){
			for (var j in planets[nb].techno){
				document.getElementById(j).className = 'TT ActionButtonDisabled';
			};
	
			document.getElementById("BuyShip").className = "TT ActionButtonDisabled";
			document.getElementById('DeclareWar').className = 'TT ActionButtonDisabled';
			document.getElementById('OrganiseElections').className = 'TT ActionButtonDisabled';
			document.getElementById('RuleOfGod').className = 'TT ActionButtonDisabled';
	
			document.getElementById('thiefButton').className = 'TT ActionButtonDisabled';
			document.getElementById('scientistButton').className = 'TT ActionButtonDisabled';
			document.getElementById('soldierButton').className = 'TT ActionButtonDisabled';
			document.getElementById('politicianButton').className = 'TT ActionButtonDisabled';
			document.getElementById('guruButton').className = 'TT ActionButtonDisabled';
			document.getElementById('lobbistButton').className = 'TT ActionButtonDisabled';
			document.getElementById('prophetButton').className = 'TT ActionButtonDisabled';
			document.getElementById('recruiterButton').className = 'TT ActionButtonDisabled';
		};
	};
};
	

function updateGameButtons(){
	for (var nb=0;nb<planets.length;nb++){
		if (planets[nb].Active){
			
			//Existence des boutons
			if (planets[nb].techno.pickpocketTraining.effect >0){		document.getElementById('thiefButton').style.display = 'block';};
			if (planets[nb].techno.mercenaries.effect >0){				document.getElementById('soldierButton').style.display = 'block';};
			if (planets[nb].techno.HRManagement.effect >0){				document.getElementById('recruiterButton').style.display = 'block';};
			if (planets[nb].techno.underpaidIntern.effect >0){			document.getElementById('scientistButton').style.display = 'block';};
			if (planets[nb].techno.oilIndustry.effect >0){				document.getElementById('lobbistButton').style.display = 'block';};
			if (planets[nb].techno.createCult.effect >0){				document.getElementById('guruButton').style.display = 'block';};
			if (planets[nb].techno.writeHollyBook.effect >0){			document.getElementById('prophetButton').style.display = 'block';};
			if (planets[nb].techno.politicalParty.effect >0){			document.getElementById('politicianButton').style.display = 'block';};
			
			//Apparence des boutons et des textes

			var buyIsPossible=[true, true, true, true, true, true, true, true];
			for (var i=0;i<planets[nb].resources.length;i++){
				for (j=0;j<buyIsPossible.length; j++){
					buyIsPossible[j] = buyIsPossible[j] && (planets[nb].resources[i].value >= planets[nb].pop[j].cost[i]) ;
				};
			};			
			var enoughCapacity= (planets[nb].totalPopulation<planets[nb].populationCap) // Nécessité de rajouter le fait qu'il y ait assez de soldats ennemis ?? ...			
			for (var j=0;j<planets[nb].pop.length;j++){
				for (var k=0;k<4;k++){
					UpdateColorValue(planets[nb].resources[k].value >= planets[nb].pop[j].cost[k],planets[nb].pop[j].name+planets[nb].resources[k].name+"Cost");
					UpdateColorValue(planets[nb].pop[j].prod[k]>=0,planets[nb].pop[j].name+planets[nb].resources[k].name+"Gain");
				};
				UpdateButton(buyIsPossible[j] && enoughCapacity,planets[nb].pop[j].name+"Button"); 
			};		
			for (var k=0;k<4;k++){
				UpdateColorValue(planets[nb].resources[k].rate>=0,planets[nb].resources[k].name+"Rate");
			};
			UpdateColorValue(planets[nb].totalPopulation<planets[nb].populationCap,"totalPopulation");		
			for (var Tech in planets[nb].techno){
				for (var k=0;k<4;k++){
					UpdateColorValue(planets[nb].resources[k].value >= planets[nb].techno[Tech].cost[k],planets[nb].resources[k].name+"Cost"+Tech);
				};
			};
			
			// Upgrade buttons
			
			var buyIsPossible=[];
			var technoNb=0;
			for (var j in planets[nb].techno){
				if (planets[nb].techno[j].effect === 0){
					buyIsPossible[technoNb]=true;
					for (var i=0;i<planets[nb].resources.length;i++){
						buyIsPossible[technoNb] = buyIsPossible[technoNb] && (planets[nb].resources[i].value >= planets[nb].techno[j].cost[i]) ;
					};
					if (buyIsPossible[technoNb]){
						document.getElementById(j).style.display = 'block';
					};
					UpdateButton(buyIsPossible[technoNb],j); 
					technoNb+=1;
				} else if (planets[nb].techno[j].appears === true){
					UpdateButton(false,j);
				} else if (planets[nb].techno[j].appears === false){
					document.getElementById(j).style.display = 'none';
				};
			};

			if (planets[nb].techno.mercenaries.effect>0 && planets[nb].techno.warChild.effect===0) 			{document.getElementById("warChild").style.display = 'block';};
			if (planets[nb].techno.warChild.effect>0 && planets[nb].techno.drones.effect===0) 				{document.getElementById("drones").style.display = 'block';};
			if (planets[nb].techno.drones.effect>0 && planets[nb].techno.cyberAttack.effect===0) 				{document.getElementById("cyberAttack").style.display = 'block';};
			
			if (planets[nb].techno.badNeighborhood.effect>0 && planets[nb].techno.submarine.effect===0) 		{document.getElementById("submarine").style.display = 'block';};
			
			if (planets[nb].techno.knife.effect>0 && planets[nb].techno.machineGun.effect===0) 				{document.getElementById("machineGun").style.display = 'block';};
			if (planets[nb].techno.machineGun.effect>0 && planets[nb].techno.ballisticMissile.effect===0) 	{document.getElementById("ballisticMissile").style.display = 'block';};
			if (planets[nb].techno.ballisticMissile.effect>0 && planets[nb].techno.nanovirus.effect===0) 		{document.getElementById("nanovirus").style.display = 'block';};
			
			if (planets[nb].techno.pickpocketTraining.effect>0 && planets[nb].techno.drugLab.effect===0 && planets[nb].pop[0]>0) 		{document.getElementById("drugLab").style.display = 'block';};
			if (planets[nb].techno.drugLab.effect>0 && planets[nb].techno.armedRobbery.effect===0) 			{document.getElementById("armedRobbery").style.display = 'block';};
			if (planets[nb].techno.armedRobbery.effect>0 && planets[nb].techno.mortgageFund.effect===0) 		{document.getElementById("mortgageFund").style.display = 'block';};
			
			if (planets[nb].techno.wallStreet.effect>0 && planets[nb].techno.taxHeavens.effect===0) 			{document.getElementById("taxHeavens").style.display = 'block';};
			
			if (planets[nb].techno.pickpocketTraining.effect>0 && planets[nb].techno.underpaidIntern.effect===0) {document.getElementById("underpaidIntern").style.display = 'block'; };
			if (planets[nb].techno.pickpocketTraining.effect>0 && planets[nb].techno.mercenaries.effect===0) {document.getElementById("mercenaries").style.display = 'block';};
			if (planets[nb].techno.pickpocketTraining.effect>0 && planets[nb].techno.createCult.effect===0) {document.getElementById("createCult").style.display = 'block';};
			
			if (planets[nb].resources[0].value>15000 && planets[nb].techno.politicalParty.effect===0)			{document.getElementById("politicalParty").style.display = 'block';};
			if (planets[nb].techno.politicalParty.effect>0 && planets[nb].techno.microphone.effect===0)		{document.getElementById("microphone").style.display = 'block';};
			if (planets[nb].techno.microphone.effect>0 && planets[nb].techno.massMedia.effect===0)			{document.getElementById("massMedia").style.display = 'block';};
			if (planets[nb].techno.massMedia.effect>0 && planets[nb].techno.makeAmerica.effect===0)			{document.getElementById("makeAmerica").style.display = 'block';};
			
			if (planets[nb].resources[0].value>12000 && planets[nb].techno.holligans.effect===0)				{document.getElementById("holligans").style.display = 'block';};
			if (planets[nb].techno.holligans.effect>0 && planets[nb].techno.facebook.effect===0)				{document.getElementById("facebook").style.display = 'block';};
			if (planets[nb].techno.facebook.effect>0 && planets[nb].techno.flatEarthTheory.effect===0)		{document.getElementById("flatEarthTheory").style.display = 'block';};
			if (planets[nb].techno.flatEarthTheory.effect>0 && planets[nb].techno.candyCrush.effect===0)		{document.getElementById("candyCrush").style.display = 'block';};
			
			if (planets[nb].techno.createCult.effect>0 && planets[nb].techno.weeklyMeetings.effect===0) 	{document.getElementById("weeklyMeetings").style.display = 'block';};
			if (planets[nb].techno.createCult.effect>0 && planets[nb].techno.buildPyramids.effect===0) 		{document.getElementById("buildPyramids").style.display = 'block';};
			
			if (planets[nb].resources[3].value>2500 && planets[nb].techno.writeHollyBook.effect===0)			{document.getElementById("writeHollyBook").style.display = 'block';};
			if (planets[nb].techno.writeHollyBook.effect>0 && planets[nb].techno.humanSacrifice.effect===0)	{document.getElementById("humanSacrifice").style.display = 'block';};
			if (planets[nb].techno.humanSacrifice.effect>0 && planets[nb].techno.wololo.effect===0)			{document.getElementById("wololo").style.display = 'block';};
			if (planets[nb].techno.wololo.effect>0 && planets[nb].techno.inquisition.effect===0)				{document.getElementById("inquisition").style.display = 'block';};
			
			if (planets[nb].techno.underpaidIntern.effect>0 && planets[nb].techno.hoursWeek.effect===0) 		{document.getElementById("hoursWeek").style.display = 'block';};
			if (planets[nb].techno.hoursWeek.effect>0 && planets[nb].techno.automation.effect===0) 			{document.getElementById("automation").style.display = 'block';};
			if ((planets[nb].techno.automation.effect>0 || planets[nb].techno.wikipedia.effect>0)  && planets[nb].techno.IA.effect===0) {document.getElementById("IA").style.display = 'block';};
			
			if (planets[nb].techno.hoursWeek.effect>0 && planets[nb].techno.internet.effect===0) 				{document.getElementById("internet").style.display = 'block';};
			if (planets[nb].techno.internet.effect>0 && planets[nb].techno.wikipedia.effect===0) 				{document.getElementById("wikipedia").style.display = 'block';};
			
			if (planets[nb].populationCap-planets[nb].totalPopulation<5 && planets[nb].techno.area51.effect===0)	{document.getElementById("area51").style.display = 'block';};
			if (planets[nb].techno.area51.effect>0 && planets[nb].techno.pacificIsland.effect===0)			{document.getElementById("pacificIsland").style.display = 'block';};
			if (planets[nb].techno.pacificIsland.effect>0 && planets[nb].techno.darkSideOfTheMoon.effect===0)	{document.getElementById("darkSideOfTheMoon").style.display = 'block';};
			
			if (planets[nb].techno.area51.effect>0 && planets[nb].techno.blackmail.effect===0)				{document.getElementById("blackmail").style.display = 'block';};		
			if (planets[nb].resources[0].value>150000 && planets[nb].techno.HRManagement.effect===0)			{document.getElementById("HRManagement").style.display = 'block';};		
			if (planets[nb].resources[0].value>75000 && planets[nb].techno.oilIndustry.effect===0)			{document.getElementById("oilIndustry").style.display = 'block';};		
			if (planets[nb].resources[0].value>500000 && planets[nb].techno.fuckImOuttaHere.effect===0)		{document.getElementById("fuckImOuttaHere").style.display = 'block'; document.getElementById("BuyShip").style.display = 'block';document.getElementById('BuyShip').className = 'TT ActionButton';};

			if (planets[nb].techno.pickpocketTraining.effect>0)
				{document.getElementById("Titre1").style.display = 'block'; 
				document.getElementById("Titre2").style.display = 'block';};
				
			document.getElementById("Titre9").style.display = 'block';
			
			if (planets[nb].pop[0].value>0)
				{document.getElementById("Titre4").style.display = 'block';
				document.getElementById("Titre6").innerHTML = 'Main resources';
				document.getElementById("Titre7").style.display = 'block';};
			
			if (planets[nb].pop[2].value>0 || planets[nb].pop[3].value>0 || planets[nb].pop[4].value>0){document.getElementById("Titre5").style.display = 'block';};
			
			if (planets[nb].stealth>0)	{document.getElementById("Titre3").style.display = 'block';};

			if (prettifyOnly(planets[nb].stealth)>0) { document.getElementById('STEALTH').style.display = 'table-row';};
			if (prettifyOnly(planets[nb].followers)>0) { document.getElementById('FOLLOWERS').style.display = 'table-row';};
			if (prettifyOnly(planets[nb].approval)>0) { document.getElementById('APPROVAL').style.display = 'table-row';};
			if (prettifyOnly(planets[nb].firepower)>0) { document.getElementById('FIREPOWER').style.display = 'table-row';};
			if (prettifyOnly(planets[nb].stupidity)>0) { document.getElementById('STUPIDITY').style.display = 'table-row';};
			if (prettifyOnly(planets[nb].bonusRate)>0) { document.getElementById('BONUSRATE').style.display = 'table-row';};
			if (prettifyOnly(planets[nb].eventRate)>0) { document.getElementById('EVENTRATE').style.display = 'table-row';};
			
			if (planets[nb].pop[1].value>0 || planets[nb].pop[2].value>0 || planets[nb].pop[3].value>0) { document.getElementById('PLANET').style.display = 'table-row';};
			if (planets[nb].pop[0].value>0) { document.getElementById('THIEFS').style.display = 'table-row';};
			if (planets[nb].pop[1].value>0) { document.getElementById('SCIENTISTS').style.display = 'table-row';};
			if (planets[nb].pop[2].value>0) { document.getElementById('SOLDIERS').style.display = 'table-row';};
			if (planets[nb].pop[3].value>0) { document.getElementById('POLITICIANS').style.display = 'table-row';};
			if (planets[nb].pop[4].value>0) { document.getElementById('GURUS').style.display = 'table-row';};
			if (planets[nb].pop[5].value>0) { document.getElementById('LOBBISTS').style.display = 'table-row';};
			if (planets[nb].pop[6].value>0) { document.getElementById('PROPHETS').style.display = 'table-row';};
			if (planets[nb].pop[7].value>0) { document.getElementById('RECRUITERS').style.display = 'table-row'; document.getElementById('RECRUITERBUTTONS').style.display = 'table-row';};
			
			if (planets[nb].pop[2].value>0) { document.getElementById('DeclareWar').style.display = 'block'; document.getElementById('DeclareWar').className = 'TT ActionButton';};
			if (planets[nb].pop[3].value>0) { document.getElementById('OrganiseElections').style.display = 'block';document.getElementById('OrganiseElections').className = 'TT ActionButton';};
			if (planets[nb].pop[4].value>0) { document.getElementById('RuleOfGod').style.display = 'block';document.getElementById('RuleOfGod').className = 'TT ActionButton';};
			
			if (planets[nb].War===true) { document.getElementById('DeclareWar').style.display = 'none'; document.getElementById('MakePeace').style.display = 'block';};
			if (planets[nb].War===false ) { document.getElementById('DeclareWar').style.display = 'block'; document.getElementById('MakePeace').style.display = 'none';};
			if (planets[nb].pop[2].value===0) { document.getElementById('DeclareWar').style.display = 'none';};
		};
	};
};

////////////
// CHARTS //
////////////

var displayedChart="Null";

function changeChart(val){
	numClick+=1;
	for (var i=0;i<8;i++){
		for(var Nb=0; Nb<planets.length;Nb++){
			if (typeof(canvas[Nb][i])!=="undefined"){	
				canvas[Nb][i].destroy();
			};
		};
	};
	displayedChart=val;
	
	for(var Nb=0; Nb<planets.length;Nb++){
		
		if (planets[Nb].Active){	
			if (val>=0 && val<4){
				canvas[Nb][val]=new Chart(ctx[Nb][val], configChart[Nb][val]);
			} else if (val ===4){
				canvas[Nb][4]= new Chart(ctx[Nb][4], resourcesChart[Nb]);
			} else if (val ===5){
				canvas[Nb][5]= new Chart(ctx[Nb][5], statusChart[Nb]);
			} else if (val ===6){
				canvas[Nb][6]= new Chart(ctx[Nb][6], popChart[Nb]);
			} else if (val ===7){
				canvas[Nb][7]= new Chart(ctx[Nb][7], winChart[Nb]);
			};		
		};
	};
};

var ctx = [];
for (var nb=0;nb<planets.length;nb++){
	ctx[nb]=[];
	for (var i=0;i<8;i++){
		ctx[nb][i]=document.getElementById("canvas").getContext("2d");
	};
};

////////////////////////////   Resources Charts   //////////////////////////

var canvas=[];
var configChart=[];

for (var nb=0;nb<planets.length;nb++){

	configChart[nb]= new Array(8);
	canvas[nb]= new Array(8);
	
	for (var i=0;i<4;i++){
		
		var printName = planets[nb].resources[i].name.substr(0,1).toUpperCase()+planets[nb].resources[i].name.substr(1,planets[nb].resources[i].name.length).toLowerCase()
		
		configChart[nb][i]={
			type: 'line',
			data: {
				datasets: [{
					lineTension: 0,
					label: 'Current value',
					fill: false,
					borderWidth: 2,
					yAxisID: "y-axis-0",
					pointRadius: 0,
					borderColor: '#00BFFF',
					data: [{x:0,y:0}]
				},{
					lineTension: 0,
					label: 'Cap',
					fill: false,
					borderWidth: 2,
					yAxisID: "y-axis-0",
					pointRadius: 0,
					borderColor: '#FF0000',
					data: [{x:0,y:0}]
				},{
					lineTension: 0,
					borderDash: [15,5],
					label: 'Rate',
					fill: false,
					borderWidth: 2,
					yAxisID: "y-axis-1",
					pointRadius: 0,
					borderColor: '#000000',
					data: [{x:0,y:0}]
				}]
			},
			options: {
                responsive: true,
                title:		{display:false, text:planets[nb].resources[i].name},
				legend:		{labels: { usePointStyle:true}},
                scales: {
                    xAxes: [{
                        type: 'linear',
						position: 'bottom',
						display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Year'
                        },
						ticks: {
							autoSkip: true,
							autoSkipPadding: 15,
							maxTicksLimit: 8,
							maxRotation: 0,
							beginAtZero: true
						}
                    }],
                    yAxes: [{
                        type: 'logarithmic',
						position:"left",
						id: "y-axis-0",
						display: true,
						
                        scaleLabel: {
                            display: true,
                            labelString: printName,
						},
						ticks:{
							
							callback: function(value, index, values) {
								var tier = Math.log10(value) / 3 | 0;
								var digit=value.toString()[0];
								if(digit==="1" || digit==="5" || digit==="2"){
									if(tier == 0) return value;
									var scale = Math.pow(10, tier * 3);
									var scaled = value/scale;
									return scaled.toFixed(0) + Prefixes[tier];	
								}
							}
                        }
					},{
						type: 'linear',
						position:"right",
						id: "y-axis-1",
						display: true,
						ticks:{
							suggestedMin: 0,
							maxTicksLimit: 5,
						},
						gridLines:{	display: false},
                        scaleLabel: {
                            display: true,
                            labelString: printName+" rate"
						}
                    }]
                }
			}
		};
	};
};	

//////////////////////////// Chart of All Resources //////////////////////////////

var resourcesChart=[];

for (var nb=0;nb<planets.length;nb++){

		resourcesChart[nb] = {
		type: 'bar',
		data: {
			
			labels: ["Money", "Science", "Weapons", "Faith"],
			datasets: [{
				label: 'Current value',
				type: 'bar',
				borderWidth: 2,
				yAxisID: "y-axis-0",
				fill: false,
				borderColor: [
					'rgba(75, 192, 192, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 99, 132, 1)',
					'rgba(153, 102, 255, 1)' 
				],
				backgroundColor: [
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 99, 132, 0.2)',
					'rgba(153, 102, 255, 0.2)' 
				],
				data: [0,0,0,0]
			},{
				label: 'To cap',
				type: 'bar',
				yAxisID: "y-axis-0",
				backgroundColor:'rgba(0, 0, 0, 0.1)',
				borderWidth: 0,
				data: [0,0,0,0]
			},{
				label: 'Rate',
				type: 'line',
				showLine: false,
				yAxisID: "y-axis-1",
				pointStyle: 'rectRot',
				pointRadius: 5,
				pointBackgroundColor:'#000000',
				pointBorderColor: '#000000',
				data: [0,0,0,0]
			}]
		},
		options: {
			responsive: true,
			legend:		{labels: { usePointStyle:true}},
			scales: {
				xAxes: [{
					display: true,
					stacked: true,
					labels: {
						show: true,
					},
					gridLines:{
						display: false
					}
				}],
				yAxes: [{
                    type: 'linear',
					position:"left",
					id: "y-axis-0",
					stacked: true,
					display: true,
					ticks:{
						suggestedMin: 0,
						maxTicksLimit: 5,
						callback: function(value, index, values) {
							var tier = Math.log10(value) / 3 | 0;
							if(tier == 0) return value;
							var scale = Math.pow(10, tier * 3);
							var scaled = value/scale;
							return scaled.toFixed(0) + Prefixes[tier];	
						}
					},
                    gridLines:{
						display: false
					},
					scaleLabel: {
                        display: true,
                        labelString: "Value"
                    }
				},{
					type: 'linear',
					position:"right",
					id: "y-axis-1",
					ticks:{
						suggestedMin: 0,
						maxTicksLimit: 5,
					},
					gridLines:{
						display: false
					},
					display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Rate"
					}
                }]
            }
		}
}};

//////////////////////////// Chart of All Planet Status //////////////////////////////

var statusChart=[];

for (var nb=0;nb<planets.length;nb++){

		statusChart[nb] = {
		type: 'polarArea',
		data: {
			
			labels: ["Approval", "Stupidity", "Stealth", "Firepower", "Followers"],
			datasets: [{
				backgroundColor: [
					"rgb(75, 192, 192)",
					"rgb(54, 162, 235)",
					"#FFCE56",
					"rgb(255, 99, 132)",
					"rgb(153, 102, 255)"
				],
				data: [0,0,0,0,0]
			}]
		},
		options: {
			legend: {position: 'bottom', labels: { usePointStyle:true}},
			responsive: true,
			//events: [],
			scale: {
				ticks:{
					maxTicksLimit: 3,
					beginAtZero: true,
					max: 100,
					callback: function(value, index, values) {
						return value+'%';
					}
				},
            }
		}
}};
	
//////////////////////////// Chart of Population //////////////////////////////

var popChart=[];

for (var nb=0;nb<planets.length;nb++){

		popChart[nb] = {
		type: 'polarArea',
		data: {
			
			labels: ["Thiefs", "Scientists", "Soldiers", "Politicians", "Gurus", "Lobbyists", "Prophets", "Recruiters"],
			datasets: [{
				backgroundColor: [
					"rgb(75, 192, 192)",
					"rgb(54, 162, 235)",
					"rgb(255, 99, 132)",
					"#FFCE56",
					"rgb(153, 102, 255)",
					"rgb(199, 101, 56)",
					"rgb(204, 51, 255)",
					'#000000'
				],
				data: [0,0,0,0,0,0,0,0]
			}]
		},
		options: {
			legend: {position: 'bottom', labels: { usePointStyle:true}},
			responsive: true,
			//events: [],
			scale: {
				ticks:{
					display: false,
					maxTicksLimit: 3,
					beginAtZero: true,
				},
            }
		}
}};
	
//////////////////////////// Chart of Win situation //////////////////////////////

var winChart=[];

for (var nb=0;nb<planets.length;nb++){
		
		winChart[nb] = {
		type: 'bar',
		data: {
			
			labels: [["Military","(Firepower)"], ["Political","(Approval)"], ["Religious","(Followers)"]],
			datasets: [{
				label: 'Current value',
				type: 'bar',
				borderWidth: 2,
				yAxisID: "y-axis-0",
				fill: false,
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(54, 162, 235, 1)'
					
				],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(54, 162, 235, 0.2)'
					
				],
				data: [0,0,0]
			}]
		},
		options: {
			responsive: true,
			//events: [],
			legend:		{display: false},
			scales: {
				xAxes: [{
					position: 'bottom',
					display: true,
					labels: {
						show: true,
					},
					gridLines:{
						display: false
					}
				}],
				yAxes: [{
                    type: 'linear',
					position:"left",
					id: "y-axis-0",
					stacked: true,
					display: true,
					ticks:{
						min: 0,
						max: 100,
					},
                    gridLines:{
						display: false
					},
					scaleLabel: {
                        display: true,
                        labelString: "Percentage"
                    }
				}]
            }
		}
}};	
	
/////////////////// RADAR CHART ////////////////////

function Colour() {
    var r, g, b;
    var h = Math.random();
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
	return ("rgba("+Math.floor(r*255)+","+Math.floor(g*255)+","+Math.floor(b*255)+",");
};

function compareRadar(Nb){
	numClick+=1;
	var colour=Colour();
	var limitsRadarPrev=[];
	
	document.getElementById('planetDisclaimer'+Nb).oncontextmenu = function() {
		suppressRadar(Nb);
	}
	
	var dataRadar= [
			planets[Nb].TechLevel,
			planets[Nb].resources[0].initialCap,
			planets[Nb].resources[1].initialCap,
			planets[Nb].resources[2].initialCap,
			planets[Nb].resources[3].initialCap,
			planets[Nb].Soldiers,
			planets[Nb].Politicians
		];
	
	for(var j=0;j<7;j++){
		limitsRadarPrev[j]=limitsRadar[j];
		limitsRadar[j]=Math.max(limitsRadar[j],dataRadar[j]);
		dataRadar[j]=dataRadar[j]/limitsRadar[j];
	};
	
	for(var j=0;j<7;j++){
		if (limitsRadar[j]>limitsRadarPrev[j] ){
			for (var i=0;i<datasets.length;i++){
				datasets[i].data[j]=datasets[i].data[j]*limitsRadarPrev[j]/limitsRadar[j];
			};
		};
	};
	
	datasets[datasets.length]={
        label: planets[Nb].Name,
        backgroundColor: colour+"0.2)",
        borderColor: colour+"1)",
        pointBackgroundColor: colour+"1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: colour+"1)",
        data: dataRadar
	};
	
	
	
	var ctxRadar=document.getElementById("canvasPlanets").getContext("2d");
	
	var ChartRadar = new Chart(ctxRadar, {
		type: 'radar',
		data: { 
			labels: ["Tech level", "Money cap", "Science cap", "Weapons cap", "Faith cap", "Soldiers", "Politicians"],
			datasets: datasets
		},
		options: {
			animation:{
				duration: 200
			},
			legend: {
				labels:{
					usePointStyle: true
				}
			},
			startAngle:-25.7,
			scale: {
                angleLines: {
					color: 'rgba(30,15,30,0.05)'
				},
				pointLabels:{
					color: 'rgba(30,15,30,0.3)',
					fontFamily:'Arial'
				},
                ticks: {
                    display: false,
					beginAtZero: true,
					max: 1,
					maxTicksLimit: 1
                }
            }
		}
	});	
	
};

function suppressRadar(Nb){
	numClick+=1;
	document.getElementById('planetDisclaimer'+Nb).oncontextmenu = function() {
		compareRadar(Nb);
	}
	
	var L=datasets.length;
	var lim=[0,0,0,0,0,0,0];
	
	for (var i=0;i<L;i++){
		if (datasets[i].label === planets[Nb].Name){
			var K=i;
		};
	};

	datasets.splice(K, 1);

	L=datasets.length;
	
	
	for(var j=0;j<7;j++){
		for (var i=0;i<L;i++){
			lim[j]=Math.max(lim[j],datasets[i].data[j]);
		};
	};
	
	for(var j=0;j<7;j++){
		for (var i=0;i<L;i++){
			datasets[i].data[j]=datasets[i].data[j]/lim[j];
		};
		limitsRadar[j]=limitsRadar[j]*lim[j];
	};
	
	var ctxRadar=document.getElementById("canvasPlanets").getContext("2d");
	
	var ChartRadar = new Chart(ctxRadar, {
		type: 'radar',
		data: { 
			labels: ["Tech level", "Money cap", "Science cap", "Weapons cap", "Faith cap", "Soldiers", "Politicians"],
			datasets: datasets
		},
		options: {
			animation:false,
			legend: {
				labels:{
					usePointStyle: true
				}
			},
			startAngle:-25.7,
			scale: {
                angleLines: {
					color: 'rgba(30,15,30,0.05)'
				},
				pointLabels:{
					color: 'rgba(30,15,30,0.3)',
					fontFamily:'Arial'
				},
                ticks: {
                    display: false,
					beginAtZero: true,
					max: 1,
					maxTicksLimit: 1
                }
            }
		}
	});	
	
};


// General functions for plotting charts

var dataCap=[];
var dataRate=[];
var dataValue=[];

function addDataGraph(planetNb,resource,dataset,value){	
	var lastlabel=configChart[planetNb][resource].data.datasets[dataset].data.length;
	configChart[planetNb][resource].data.datasets[dataset].data[lastlabel]= {
		x: prettify(Time,1),
		y: value
	};
};

function suppressDataGraph(planetNb,resource,dataset){
	configChart[planetNb][resource].data.datasets[dataset].data.splice(0,1);
};

function updateDataGraph(planetNb,resource,dataset,value){
	var lastlabel=configChart[planetNb][resource].data.datasets[dataset].data.length-1;
	configChart[planetNb][resource].data.datasets[dataset].data[lastlabel]= {
		x: prettify(Time,1),
		y: value
	};
};	

//////////
// LOOP //
//////////

var timerClick=100;
var biggerTimerClick=3600;
var numClickPrevious=0;
var autosaveCounter = 0;
var autosave="on";
document.getElementById("Titre9").style.display = 'none';

window.setInterval(function(){
	
	if (autosave == "on") {
		autosaveCounter += 1;
		if (autosaveCounter >= 60){
			save('auto');
			autosaveCounter = 0;
		}
	}

	if (play && (planets[0].resources[0].value !== 0 || Time!==0)){
		

		for(var nb=0; nb<planets.length;nb++){
				
				if(planets[nb].timeCount >0){
					planets[nb].timeCount-=1;
					updateShipStatus(nb);
				};
			
				if (planets[nb].Revealled){
					var oldResources = planets[nb].resources;
			
					planets[nb].Produce();

					if (planets[nb].War) {
						if (planets[nb].warTimer > 0){
							planets[nb].warTimer -= 1;
							if (planets[nb].warTimer===10){
								log(planets[nb].Name,"War will start in 1 year !", "red");
							};
						} else {
							if(planets[nb].warTimer===0){log(planets[nb].Name,"WAR : You are at war !","red");planets[nb].warTimer-=1;};
							planets[nb].MakeWar();
						};
					};
					
					if(planets[nb].eventDuration>0){
						planets[nb].eventDuration-=1;
					} else {
						for (var i=0;i<4;i++){
							planets[nb].resources[i].EventEffect=0;
						};
					};
	
					timeBetweenEvents1=Math.max(timeBetweenEvents1-1,0);
					timeBetweenEvents2=Math.max(timeBetweenEvents2-1,0);
					timeBetweenEvents3=Math.max(timeBetweenEvents3-1,0);
					createEvent();
					
					// Update of the Money chart
					
					for (var i=0;i<4;i++){
						if (oldResources[i].value!==planets[nb].resources[i].value || planets[nb].resources[i].value < planets[nb].resources[i].cap || oldResources[i].rate!==planets[nb].resources[i].rate) {
							addDataGraph(nb,i,0,prettifyOnly(planets[nb].resources[i].value));
							addDataGraph(nb,i,1,prettifyOnly(planets[nb].resources[i].cap));
							if(planets[nb].resources[i].rate!==0){
								addDataGraph(nb,i,2,prettifyOnly(planets[nb].resources[i].rate));
							};
							if (Time>=100) {
								suppressDataGraph(nb,i,0);
								suppressDataGraph(nb,i,1);
								suppressDataGraph(nb,i,2);
							};
						} else {
							updateDataGraph(nb,i,0,prettifyOnly(planets[nb].resources[i].value));
							updateDataGraph(nb,i,1,prettifyOnly(planets[nb].resources[i].cap));
							updateDataGraph(nb,i,2,prettifyOnly(planets[nb].resources[i].rate));
						};
					};
				};
		};
		
		for(var nb=0; nb<planets.length;nb++){
			if (planets[nb].Active || planets[nb].chartsBeingDisplayed){
				if (displayedChart === 4 || planets[nb].chartsBeingDisplayed){
					for (var i=0;i<4;i++){
						dataValue[i]=prettifyOnly(planets[nb].resources[i].value);
						dataCap[i]=prettifyOnly(planets[nb].resources[i].cap)-dataValue[i];
						dataRate[i]=prettifyOnly(planets[nb].resources[i].rate);
					};
					canvas[nb][4].data.datasets[1].data=dataCap;
					canvas[nb][4].data.datasets[2].data=dataRate;
					canvas[nb][4].data.datasets[0].data=dataValue;
					
				}; 
				if ( displayedChart === 5 || planets[nb].chartsBeingDisplayed){
					statusChart[nb].data.datasets[0].data=[
						prettifyOnly(planets[nb].approvalRate*100),
						prettifyOnly(planets[nb].stupidity*100),
						prettifyOnly(planets[nb].stealth), 
						prettifyOnly(planets[nb].firepowerRate*100),
						prettifyOnly(planets[nb].followersRatio*100)
					];
				} ;
				if (displayedChart === 6 || planets[nb].chartsBeingDisplayed){
					for (var i=0;i<planets[nb].pop.length;i++){
						popChart[nb].data.datasets[0].data[i]=planets[nb].pop[i].value;
					};
				} ;
				if (displayedChart === 7 || planets[nb].chartsBeingDisplayed){
					winChart[nb].data.datasets[0].data[0]=prettifyOnly(planets[nb].firepowerRate*100);
					winChart[nb].data.datasets[0].data[1]=prettifyOnly(planets[nb].approvalRate*100);
					winChart[nb].data.datasets[0].data[2]=prettifyOnly(planets[nb].followersRatio*100);
				};
				if (displayedChart !== "Null" ){	
					canvas[nb][displayedChart].update();
				};
				if (planets[nb].chartsBeingDisplayed){
					for (var i=0;i<8;i++){
						canvas[nb][i].update();
					};
				};
			};
		};		
		
		if (document.getElementById("stratPagebackground").style.display==="block"){
			updateGalaxyResources();
			updateGalaxyButtons();
		};
		if (document.getElementById("achievementPannel").style.display==="block"){
			updateStats();
		};
		
		Produce();
		
		document.getElementById("Time").innerHTML = prettify(Time,1);
		Time+=0.1;	
		
		if(numClick!==numClickPrevious && Time>0){
			YearsREALLYPLAYED+=0.1;
			timerClick=300;
			biggerTimerClick=1000;
			users[numUser].active=true;
		} else if (timerClick>0 && Time>0){
			YearsREALLYPLAYED+=0.1;
			users[numUser].active=true;
		}else if (biggerTimerClick>0 && timerClick<=0 && Time>0) {
			users[numUser].active=false;
		} else {
			Pause();
		};
		
		numClickPrevious=numClick;
		timerClick-=1;
		biggerTimerClick-=1;
		
		for(var nb=0; nb<planets.length;nb++){
			if (planets[nb].Revealled){
				planets[nb].TIMEPLANET+=0.1;
			};
		};
		
		verifyAchievements();
		
		sortUsers();
		updateRanking();
		
	}; }
	
, 1000);




