function LeafletSelectArea(map,a,b,c){
	if(map===undefined){return};
	let config,inputs,fix,timer=null;
	let arrays=0,objects=0,int=0;
	if(a!==undefined){
		if(Array.isArray(a)){arrays=arrays+1;inputs=a};
		if(Number.isInteger(a)){int=int+1;fix=a};
		if((typeof(a)==="object")&&!Array.isArray(a)){objects=objects+1;config=a};
	}
	if(b!==undefined){
		if(Array.isArray(b)){arrays=arrays+1;inputs=b};
		if(Number.isInteger(b)){int=int+1;fix=b};
		if((typeof(b)==="object")&&!Array.isArray(b)){objects=objects+1;config=b};
	}
	if(c!==undefined){
		if(Array.isArray(c)){arrays=arrays+1;inputs=c};
		if(Number.isInteger(c)){int=int+1;fix=c};
		if((typeof(c)==="object")&&!Array.isArray(c)){objects=objects+1;config=c};
	}
	if((arrays>1)||(int>1)||(objects>1)){console.error("Wrong type of parameters");return};
	if((inputs!==undefined)&&(inputs.length!==2)){console.error("invalid length of array, expected 2 objects");return};
	let container = map.getContainer();
	LeafletSetConfig(map,config);
	let x = map["LeafletSelectArea"]["Status"];
	x["StartPoint"]=null,x["Dragging"]=false,x["Pressing"]=false;
	let btn = map["LeafletSelectArea"]["Btn"];
	L.Control.DrawRectangle = L.Control.extend({
		onAdd:function(map){
			const container = L.DomUtil.create("div","leaflet-bar");
			container.style["z-index"] = 1000;
			const btnDraw = L.DomUtil.create("a","leaflet-control-button",container);
			btnDraw.href = "#";
			btnDraw.setAttribute("role","button");
			btnDraw.innerHTML = `<span style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">${btn["select"]["icon"]}</span>`;
			btnDraw.title = btn["select"]["title"];
			btnDraw.id = "LeafletSelectAreaBtnDraw";
			const btnMove = L.DomUtil.create("a","leaflet-control-button",container);
			btnMove.href = "#";
			btnMove.style.backgroundColor = "#e0e2e4ff";
			btnMove.setAttribute("role","button");
			btnMove.innerHTML = `<span style="width:100%; height:100%; display:flex; justify-content:center; align-items:center;">${btn["pan"]["icon"]}</span>`;
			btnMove.title = btn["pan"]["title"];
			btnMove.id = "LeafletSelectAreaBtnMove";
			L.DomEvent.on(btnDraw,"click",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);activateDraw()});
			L.DomEvent.on(btnDraw,"touchstart",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);activateDraw()});
			L.DomEvent.on(btnMove,"click",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);deactivateDraw()});
			L.DomEvent.on(btnMove,"touchstart",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);deactivateDraw()});
			return container;
		}
	});
	L.control.drawRectangle = function(opts){return new L.Control.DrawRectangle(opts)};
	L.control.drawRectangle({position:btn["position"]}).addTo(map);
	function activateDraw(){
		let btnMove = document.getElementById("LeafletSelectAreaBtnMove");
		let btnDraw = document.getElementById("LeafletSelectAreaBtnDraw");
		if(btnMove.style.backgroundColor==="#e0e2e4ff"||btnMove.style.backgroundColor==="rgb(224, 226, 228)"){
			btnMove.style.backgroundColor = "";
			btnDraw.style.backgroundColor = "#e0e2e4ff";
		}
		container["style"]["cursor"] = btn["select"]["cursor"];
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.dragging.disable();
		container.addEventListener("mousedown",StartDrawing);
		container.addEventListener("mousemove",Drawing);
		container.addEventListener("mouseup",EndDrawing);
		container.addEventListener("touchstart",StartDrawing,{passive:false});
		container.addEventListener("touchmove",Drawing,{passive:false});
		container.addEventListener("touchend",EndDrawing);
		if(map["LeafletSelectArea"]["Rectangle"]){
			map["LeafletSelectArea"]["Rectangle"].getElement().style["cursor"] = btn["select"]["cursor"];
		}
	}
	function deactivateDraw(){
		let btnMove = document.getElementById("LeafletSelectAreaBtnMove");
		let btnDraw = document.getElementById("LeafletSelectAreaBtnDraw");
		if(btnDraw.style.backgroundColor==="#e0e2e4ff"||btnDraw.style.backgroundColor==="rgb(224, 226, 228)"){
			btnMove.style.backgroundColor = "#e0e2e4ff";
			btnDraw.style.backgroundColor = "";
		}
		container["style"]["cursor"] = btn["pan"]["cursor"];
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.dragging.enable();
		container.removeEventListener("mousedown",StartDrawing);
		container.removeEventListener("mousemove",Drawing);
		container.removeEventListener("mouseup",EndDrawing);
		container.removeEventListener("touchstart",StartDrawing,{passive:false});
		container.removeEventListener("touchmove",Drawing,{passive:false});
		container.removeEventListener("touchend",EndDrawing);
		if(map["LeafletSelectArea"]["Rectangle"]!==null){
			map["LeafletSelectArea"]["Rectangle"].getElement().style["cursor"] = btn["pan"]["cursor"];
		}
	}
	function getPoint(event){
		event.preventDefault();
		let x,y,coords;
		let z = container.getBoundingClientRect();
		if(event.touches&&event.touches[0]){
			x = event.touches[0].clientX;
			y = event.touches[0].clientY;
		} else {
			x = event.clientX;
			y = event.clientY;
		}
		x = x-z.left;
		y = y-z.top;
		coords = map.containerPointToLatLng(L.point(x,y));
		return coords;
	}
	function StartDrawing(e){
		x["Pressing"] = true;
		x["Dragging"] = false;
		if(x["Active"]===true){x["StartPoint"]=getPoint(e)};
	}
	function Drawing(e){
		if((x["Pressing"]===false)||(x["StartPoint"]===null)){return};
		x["EndPoint"] = getPoint(e);
		if(!x["EndPoint"]){return};
		if(x["Dragging"]===false){
			x["Dragging"] = true;
			if(map["LeafletSelectArea"]["Rectangle"]){map.removeLayer(map["LeafletSelectArea"]["Rectangle"])};
			map["LeafletSelectArea"]["Rectangle"] = L.rectangle([x["StartPoint"],x["EndPoint"]],{color:map["LeafletSelectArea"]["color"],weight:map["LeafletSelectArea"]["weight"]});
			map["LeafletSelectArea"]["Rectangle"].addTo(map);
			map["LeafletSelectArea"]["Rectangle"].getElement().style["cursor"] = btn["select"]["cursor"];
		} else {
			const bounds = L.latLngBounds(x["StartPoint"],x["EndPoint"]);
			map["LeafletSelectArea"]["Rectangle"].setBounds(bounds);
			LeafletSetMarkers(map,[x["StartPoint"],x["EndPoint"]]);
			clearTimeout(timer);
			timer = setTimeout(() => updateInputs(),100);
		}
	}
	function EndDrawing(){
		x["Pressing"] = false;
		x["Dragging"] = false;
	}
	function updateInputs(){
		if((inputs===undefined)||(map["LeafletSelectArea"]["Rectangle"]===null)){return};
		let a = ["StartPoint","EndPoint"];
		for(let i=0;i<inputs.length;i++){
			for(let j of ["lat","lng"]){
				let b = "";
				if(inputs[i][j] instanceof HTMLElement){b="innerHTML"};
				if(inputs[i][j] instanceof HTMLInputElement){b="value"};
				if(fix===undefined){
					if(b!==""){
						inputs[i][j][b] = map["LeafletSelectArea"]["Status"][a[i]][j];
					} else {
						inputs[i][j] = map["LeafletSelectArea"]["Status"][a[i]][j];
					}
				} else {
					if(b!==""){
						inputs[i][j][b] = map["LeafletSelectArea"]["Status"][a[i]][j].toFixed(fix);
					} else {
						inputs[i][j] = map["LeafletSelectArea"]["Status"][a[i]][j].toFixed(fix);;
					}
				}
			}
		}
	}
}
function LeafletDrawArea(map,values){
	if(map===undefined){return};
	let coordenadas;
	if(values===undefined){console.error("expected a non-empty array");return};
	if(values.length!==2){console.error("invalid length of array, expected 2 objects");return};
	coordenadas = [];
	for(let i=0;i<values.length;i++){
		let a="",b=new Object();
		for(let j of ["lat","lng"]){
			if(values[i][j]===undefined){return};
			if(values[i][j] instanceof HTMLElement){a="innerHTML"};
			if(values[i][j] instanceof HTMLInputElement){a="value"};
			if(a===""){
				if(isNaN(values[i][j])){console.error(`NaN in the point received`);return};
				if(values[i][j].trim()===""){console.error(`provided an empty value`);return};
				b[j] = values[i][j];
			} else {
				if(isNaN(values[i][j][a])){console.error(`NaN in the point received`);return};
				if(values[i][j][a].trim()===""){console.error(`provided empty an empty value`);return};
				b[j] = Number(values[i][j][a]);
			}
		}
		coordenadas.push(b);
	}
	let x = map["LeafletSelectArea"];
	if(x["Rectangle"]){ 
		map.removeLayer(x["Rectangle"]);
	}
	x["Rectangle"] = L.rectangle(coordenadas,{"color":x["color"],"weight":x["weight"]}).addTo(map);
	x["Status"]["StartPoint"] = coordenadas[0];
	x["Status"]["EndPoint"] = coordenadas[1];
	LeafletSetMarkers(map,coordenadas);
}
function LeafletSetMarkers(map,coordenadas){
	if(map===undefined){return};
	if(!Array.isArray(coordenadas)||(coordenadas.length!==2)){return};
	for(let i=0;i<coordenadas.length;i++){
		if(Array.isArray(coordenadas[i])){
			coordenadas[i] = {"lat":coordenadas[i][0],"lng":coordenadas[i][0]};
		}
		for(let j of Object.values(coordenadas[i])){
			if(isNaN(j)){
				return;
			}
		}
	}
	for(let j of ["lat","lng"]){
		if(coordenadas[0][j]==coordenadas[1][j]){
			return;
		}
	}
	const {Marker,Label} = map["LeafletSelectArea"];
	let StartPoint,EndPoint;
	if(Marker["sort"]===false){
		let a = [0,0];
		if(coordenadas[0]["lat"]>coordenadas[1]["lat"]){a[0]=1};
		if(coordenadas[0]["lng"]>coordenadas[1]["lng"]){a[1]=1};
		if((a[0]===1)&&(a[1]===1)){StartPoint="NorthEast";EndPoint="SouthWest"};
		if((a[0]===0)&&(a[1]===1)){StartPoint="SouthEast";EndPoint="NorthWest"};
		if((a[0]===1)&&(a[1]===0)){StartPoint="NorthWest";EndPoint="SouthEast"};
		if((a[0]===0)&&(a[1]===0)){StartPoint="SouthWest";EndPoint="NorthEast"};
	} else {
		StartPoint = "NorthEast";
		EndPoint = "SouthWest";
		let a={},b={};
		for(let i of ["lat","lng"]){
			a[i] = Math.max(coordenadas[0][i],coordenadas[1][i]);
			b[i] = Math.min(coordenadas[0][i],coordenadas[1][i]);
		}
		coordenadas[0] = a;
		coordenadas[1] = b;
	}
	function SetMarker(key,point){
		let a;
		switch(key){
			case "NorthEast":
				a = "NorthWest";
				break;
			case "NorthWest":
				a = "NorthEast";
				break;
			case "SouthEast":
				a = "SouthWest";
				break;
			case "SouthWest":
				a = "SouthEast";
				break;
		}
		if(Marker[a]){map.removeLayer(Marker[a])};
		if(Marker["enable"][key]===false){return};
		if(Marker[key]){map.removeLayer(Marker[key])};
		let color = Marker["color"];
		if(Label[key]["title"]===""){
			Marker[key] = L.marker(point,{icon:L.divIcon({className:"",iconSize:[Marker["width"],Marker["height"]],iconAnchor:Marker["margin"][key],html:Marker["icon"][key](color)})}).addTo(map);
		} else {
			Marker[key] = L.marker(point,{icon:L.divIcon({className:"",iconSize:[Marker["width"],Marker["height"]],iconAnchor:Marker["margin"][key],html:Marker["icon"][key](color)})}).addTo(map).bindTooltip(Label[key]["title"],{permanent:Label[key]["always visible"],"direction":Label[key]["position"]});
		}
		Marker[key].addEventListener("mouseenter",ActiveResizing);
		Marker[key].addEventListener("mouseleave",StopResizing);
		Marker[key].addEventListener("mousedown",ActiveResizing);
		Marker[key].addEventListener("mouseup",StopResizing);
		Marker[key].addEventListener("touchstart",ActiveResizing,{passive:false});
		Marker[key].addEventListener("touchend",StopResizing);
		let x=map["LeafletSelectArea"]["Rectangle"],y=map["LeafletSelectArea"]["Status"];
		function ActiveResizing(){
			y["Active"] = false;
			Marker[key].addEventListener("mousemove",Resizing);
			Marker[key].addEventListener("touchmove",Resizing,{passive:false});
		}
		function StopResizing(){
			y["Active"] = true;
			Marker[key].removeEventListener("mousemove",Resizing);
			Marker[key].removeEventListener("touchmove",Resizing,{passive:false});
		}
		function Resizing(){
			if(!x){return};
			y["Dragging"] = true;
			if(!x["_latlngs"][0].some(c => (c["lat"]===y["StartPoint"]["lat"])&&(c["lng"]===y["StartPoint"]["lng"]))){
				y["StartPoint"] = x["_latlngs"][0].find(z => (z["lat"]!==y["EndPoint"]["lat"])&&(z["lng"]!==y["EndPoint"]["lng"]));
			}
			if(!x["_latlngs"][0].some(c => (c["lat"]===y["EndPoint"]["lat"])&&(c["lng"]===y["EndPoint"]["lng"]))){
				y["EndPoint"] = x["_latlngs"][0].find(z => (z["lat"]!==y["StartPoint"]["lat"])&&(z["lng"]!==y["StartPoint"]["lng"]));
			}
			if((y["StartPoint"]["lat"]==point["lat"])&&(y["StartPoint"]["lng"]==point["lng"])){
				let a = y["EndPoint"];
				y["EndPoint"] = y["StartPoint"];
				y["StartPoint"] = a;
			}
		}
	}
	SetMarker(StartPoint,coordenadas[0]);
	SetMarker(EndPoint,coordenadas[1]);
}
function LeafletSetConfig(map,config){
	if(map["LeafletSelectArea"]!==undefined){return};
	map["LeafletSelectArea"] = {
		"Marker":{
			"sort":false,
			"enable":{
				"NorthEast":true,
				"NorthWest":true,
				"SouthWest":true,
				"SouthWest":true
			},
			"width":24,
			"height":24,
			"color":"#000000",
			"margin":{
				"NorthEast":[23,1],
				"NorthWest":[1,1],
				"SouthEast":[23,23],
				"SouthWest":[1,23]
			},
			"icon":{
				"NorthEast":function(color){
					let icon =
						`<div style="display:flex; flex-direction:row; flex-wrap:nowrap; width:100%; height:100%;">
							<div style="width:90%; height:10%; background-color:${color}; margin-bottom:auto;"></div>
							<div style="width:10%; height:100%; background-color:${color};"></div>
						</div>`;
					return icon;
				},
				"NorthWest":function(color){
					let icon = 
						`<div style="display:flex; flex-direction:row; flex-wrap:nowrap; width:100%; height:100%;">
							<div style="width:10%; height:100%; background-color:${color};"></div>
							<div style="width:90%; height:10%; background-color:${color}; margin-bottom:auto;"></div>
						</div>`;
					return icon;
				},
				"SouthEast":function(color){
					let icon =
						`<div style="display:flex; flex-direction:row; flex-wrap:nowrap; width:100%; height:100%;">
							<div style="width:90%; height:10%; background-color:${color}; margin-top:auto;"></div>
							<div style="width:10%; height:100%; background-color:${color};"></div>
						</div>`;
					return icon;
				},
				"SouthWest":function(color){
					let icon =
						`<div style="display:flex; flex-direction:row; flex-wrap:nowrap; width:100%; height:100%;">
							<div style="width:10%; height:100%; background-color:${color};"></div>
							<div style="width:90%; height:10%; background-color:${color}; margin-top:auto;"></div>
						</div>`;
					return icon;
				}
			}
		},
		"Status":{
			"Active":true,
			"Pressing":false,
			"Dragging":false,
			"StartPoint":null,
			"EndPoint":null
		},
		"weight":1,
		"Active":true,
		"color":"#0000FF",
		"Rectangle":null,
		"Btn":{
			"position":"topright",
			"select":{
				"cursor":"crosshair",
				"title":"",
				"icon":
					`<svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16 16" style="margin:auto;">
						<path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917z"/>
					</svg>`
			},
			"pan":{
				"cursor":"default",
				"title":"",
				"icon":
					`<svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16 16" style="flex-grow:1;">
						<path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"/>
					</svg>`
			}
		},
		"Label":{
			"NorthEast":{
				"always visible":false,
				"title":"",
				"position":"top"
			},
			"NorthWest":{
				"always visible":false,
				"title":"",
				"position":"top"
			},
			"SouthEast":{
				"always visible":false,
				"title":"",
				"position":"bottom"
			},
			"SouthWest":{
				"always visible":false,
				"title":"",
				"position":"bottom"
			}
		}
	}
	SetConfig(map["LeafletSelectArea"],config);
	function SetConfig(x,y){
		for(let i in y){
			if(i==="Status"){continue};
			if(x[i]===undefined){continue};
			if(typeof(y[i])!=="object"){
				x[i] = y[i];
				continue;
			}
			if(Array.isArray(y[i])){
				x[i] = y[i];
				continue;
			}
			if(typeof(y[i])==="object"){
				SetConfig(x[i],y[i]);
				continue;
			}
		}
	}
}