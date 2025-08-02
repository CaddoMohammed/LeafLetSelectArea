const Mapa = L.map("map",{tap:false,center:[14.084657,-87.165792],zoom:7,minZoom:3,maxZoom:18,zoomControl:false,attributionControl:false});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}).addTo(Mapa);	
new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:15}),{toggleDisplay:true,minimized:false}).addTo(Mapa);
new L.Control.Zoom({position:'topleft'}).addTo(Mapa);
Mapa.setMaxBounds(L.latLngBounds(L.latLng(90,-180),L.latLng(-90,180)));
L.control.resetView({position:"topleft",title:"Reset view",latlng:L.latLng([14.084657,-87.165792]),zoom:7,}).addTo(Mapa);
L.control.scale().addTo(Mapa);
let inputs = [
	document.getElementById("corner-1"),
	document.getElementById("corner-2"),
	document.getElementById("corner-3"),
	document.getElementById("corner-4")
];
window.addEventListener("load",() => {for(let i=0;i<inputs.length;i++){inputs[i].value=""}});
LeafletSelectArea(Mapa,inputs);