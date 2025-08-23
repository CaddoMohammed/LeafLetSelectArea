const Mapa = L.map("map",{tap:false,center:[14.084657,-87.165792],zoom:7,minZoom:3,maxZoom:18,zoomControl:false,attributionControl:false});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}).addTo(Mapa);	
new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:15}),{toggleDisplay:true,minimized:false}).addTo(Mapa);
new L.Control.Zoom({position:'topleft'}).addTo(Mapa);
Mapa.setMaxBounds(L.latLngBounds(L.latLng(90,-180),L.latLng(-90,180)));
L.control.resetView({position:"topleft",title:"Reset view",latlng:L.latLng([14.084657,-87.165792]),zoom:7,}).addTo(Mapa);
L.control.scale().addTo(Mapa);
const Descriptors = [Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set,Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").get];
let Inputs = [
	{"lat":document.getElementById("lat-max"),"lng":document.getElementById("lng-max")},
	{"lat":document.getElementById("lat-min"),"lng":document.getElementById("lng-min")}
];
let ErrorInputs = [
	{"lat":document.getElementById("error-lat-max"),"lng":document.getElementById("error-lng-max")},
	{"lat":document.getElementById("error-lat-min"),"lng":document.getElementById("error-lng-min")}
];
let error = [
	{"lat":false,"lng":false},
	{"lat":false,"lng":false}
];
let timer = null;
Object.defineProperty(HTMLInputElement.prototype,"value",{
	set:function(newValue){
		Descriptors[0].call(this,newValue);
		validation(this.id);
	},
	get:function(){
		return Descriptors[1].call(this);
	},
	configurable:true,
	enumerable:true
});
for(let i=0;i<Inputs.length;i++){
	for(let j of ["lat","lng"]){
		Inputs[i][j]["value"] = "";
		Inputs[i][j].addEventListener("input",() => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				validation(Inputs[i][j]["id"]);
				if((error[0]["lat"]===false)&&(error[0]["lng"]===false)&&(error[1]["lat"]===false)&&(error[1]["lng"]===false)){LeafletDrawArea(Mapa,Inputs)};
			},500);
		});
	}
}
LeafletSelectArea(Mapa,Inputs);
function validation(x){
	const a = Inputs.findIndex(obj => Object.values(obj).some(input => input["id"]===x));
  	if(a===-1){return};
  	const b = Object.entries(Inputs[a]).find(([k,input]) => input["id"]===x)[0];
	const Max=[90,180],Name=["latitud","longitud"];
	if(isNaN(Inputs[a][b]["value"])){
		Inputs[a][b]["className"] = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer";
		ErrorInputs[a][b]["innerHTML"] = "Solamente números";
		error[a][b] = true;
		return;
	} else {
		error[a][b] = false;
	}
	if(Math.abs(Inputs[a][b]["value"])>Max[a][b]){
		Inputs[a][b]["className"] = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 appearance-none dark:text-white dark:border-red-500 border-red-600 dark:focus:border-red-500 focus:outline-none focus:ring-0 focus:border-red-600 peer";
		ErrorInputs[a][b]["innerHTML"] = `La ${Name[a][b]} debe ser solo desde -${Max[a][b]}° hasta ${Max[a][b]}°`;
		error[a][b] = true;
		return;
	} else {
		error[a][b] = false;
	}
	Inputs[a][b]["className"] = "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer";
	ErrorInputs[a][b].innerHTML = "";
	if(Inputs[a][b]["value"].trim()===""){error[a][b]=true;return};
	if((error[0]["lat"]===false)&&(error[0]["lng"]===false)&&(error[1]["lat"]===false)&&(error[1]["lng"]===false)){InputsName()};
}
function InputsName(){
	let a = [0,0];
	let x=document.getElementById("corner-1"),y=document.getElementById("corner-2");
	if(Inputs[0]["lat"]["value"]>Inputs[1]["lat"]["value"]){a[0]=1};
	if(Inputs[0]["lng"]["value"]>Inputs[1]["lng"]["value"]){a[1]=1};
	if((a[0]===1)&&(a[1]===1)){
		x["innerHTML"] = "Coordenadas de la esquina noroeste";
		y["innerHTML"] = "Coordenadas de la esquina sureste";
	}
	if((a[0]===0)&&(a[1]===1)){
		x["innerHTML"] = "Coordenadas de la esquina suroeste";
		y["innerHTML"] = "Coordenadas de la esquina noreste";
	}
	if((a[0]===1)&&(a[1]===0)){
		x["innerHTML"] = "Coordenadas de la esquina noreste";
		y["innerHTML"] = "Coordenadas de la esquina suroeste";
	}
	if((a[0]===0)&&(a[1]===0)){
		x["innerHTML"] = "Coordenadas de la esquina sureste";
		y["innerHTML"] = "Coordenadas de la esquina noroeste";
	}
}