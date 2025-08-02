function LeafletSelectArea(map,a,b,c){
	if(map===undefined){return};
	let config,inputs,fix;
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
	if(![1,2,4].includes(inputs.length)){console.error("invalid length of array, expected 1,2 or 4 elements");return};
	let container = map.getContainer();
	let StartPoint=null,Dragging=false,Pressing=false;Rectangle=null;
	if(config===undefined){config=new Object()};
	if(config["color"]===undefined){config["color"]="#0000FF"};
	if(config["position"]===undefined){config["position"]="topright"};
	if(config["weight"]===undefined){config["weight"]=1};
	if(config["cursor"]===undefined){config["cursor"]=new Object()};
	if(config["cursor"]["select"]===undefined){config["cursor"]["select"]="crosshair"};
	if(config["cursor"]["pan"]===undefined){config["cursor"]["pan"]="default"};
	if(config["title"]===undefined){config["title"]=new Object()};
	if(config["title"]["select"]===undefined){config["title"]["select"]=""};
	if(config["title"]["pan"]===undefined){config["title"]["pan"]=""};
	if(config["icons"]===undefined){config["icons"]=new Object()};
	if(config["icons"]["select"]===undefined){
		config["icons"]["select"] =
			`<svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16 16" style="margin:auto;">
				<path d="M2.5 0q-.25 0-.487.048l.194.98A1.5 1.5 0 0 1 2.5 1h.458V0zm2.292 0h-.917v1h.917zm1.833 0h-.917v1h.917zm1.833 0h-.916v1h.916zm1.834 0h-.917v1h.917zm1.833 0h-.917v1h.917zM13.5 0h-.458v1h.458q.151 0 .293.029l.194-.981A2.5 2.5 0 0 0 13.5 0m2.079 1.11a2.5 2.5 0 0 0-.69-.689l-.556.831q.248.167.415.415l.83-.556zM1.11.421a2.5 2.5 0 0 0-.689.69l.831.556c.11-.164.251-.305.415-.415zM16 2.5q0-.25-.048-.487l-.98.194q.027.141.028.293v.458h1zM.048 2.013A2.5 2.5 0 0 0 0 2.5v.458h1V2.5q0-.151.029-.293zM0 3.875v.917h1v-.917zm16 .917v-.917h-1v.917zM0 5.708v.917h1v-.917zm16 .917v-.917h-1v.917zM0 7.542v.916h1v-.916zm15 .916h1v-.916h-1zM0 9.375v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .916v.917h1v-.917zm16 .917v-.917h-1v.917zm-16 .917v.458q0 .25.048.487l.98-.194A1.5 1.5 0 0 1 1 13.5v-.458zm16 .458v-.458h-1v.458q0 .151-.029.293l.981.194Q16 13.75 16 13.5M.421 14.89c.183.272.417.506.69.689l.556-.831a1.5 1.5 0 0 1-.415-.415zm14.469.689c.272-.183.506-.417.689-.69l-.831-.556c-.11.164-.251.305-.415.415l.556.83zm-12.877.373Q2.25 16 2.5 16h.458v-1H2.5q-.151 0-.293-.029zM13.5 16q.25 0 .487-.048l-.194-.98A1.5 1.5 0 0 1 13.5 15h-.458v1zm-9.625 0h.917v-1h-.917zm1.833 0h.917v-1h-.917zm1.834-1v1h.916v-1zm1.833 1h.917v-1h-.917zm1.833 0h.917v-1h-.917z"/>
			</svg>`;
	}
	if(config["icons"]["pan"]===undefined){
		config["icons"]["pan"] =
			`<svg xmlns="http://www.w3.org/2000/svg" width="80%" height="80%" viewBox="0 0 16 16" style="flex-grow:1;">
				<path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"/>
			</svg>`;
	}
	L.Control.DrawRectangle = L.Control.extend({
		onAdd:function(map){
			const container = L.DomUtil.create("div","leaflet-bar");
			container.style["z-index"] = 1000;
			const btnDraw = L.DomUtil.create("a","leaflet-control-button",container);
			btnDraw.href = "#";
			btnDraw.setAttribute("role","button");
			btnDraw.innerHTML = `<span style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">${config["icons"]["select"]}</span>`;
			btnDraw.title = config["title"]["select"];
			const btnMove = L.DomUtil.create("a","leaflet-control-button",container);
			btnMove.href = "#";
			btnMove.setAttribute("role","button");
			btnMove.innerHTML = `<span style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">${config["icons"]["pan"]}</span>`;
			btnMove.title = config["title"]["pan"];
			L.DomEvent.on(btnDraw,"click",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);activateDraw()});
			L.DomEvent.on(btnDraw,"touchstart",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);activateDraw()});
			L.DomEvent.on(btnMove,"click",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);deactivateDraw()});
			L.DomEvent.on(btnMove,"touchstart",function(e){L.DomEvent.stopPropagation(e);L.DomEvent.preventDefault(e);deactivateDraw()});
			return container;
		}
	});
	L.control.drawRectangle = function(opts){return new L.Control.DrawRectangle(opts)};
	L.control.drawRectangle({position:config["position"]}).addTo(map);
	function activateDraw(){
		container["style"]["cursor"] = config["cursor"]["select"];
		map.touchZoom.disable();
		map.doubleClickZoom.disable();
		map.dragging.disable();
		container.addEventListener("mousedown",StartDrawing);
		container.addEventListener("mousemove",Drawing);
		container.addEventListener("mouseup",EndDrawing);
		container.addEventListener("touchstart",StartDrawing,{passive:false});
		container.addEventListener("touchmove",Drawing,{passive:false});
		container.addEventListener("touchend",EndDrawing);
	}
	function deactivateDraw(){
		container["style"]["cursor"] = config["cursor"]["pan"];
		map.touchZoom.enable();
		map.doubleClickZoom.enable();
		map.dragging.enable();
		container.removeEventListener("mousedown",StartDrawing);
		container.removeEventListener("mousemove",Drawing);
		container.removeEventListener("mouseup",EndDrawing);
		container.removeEventListener("touchstart",StartDrawing,{passive:false});
		container.removeEventListener("touchmove",Drawing,{passive:false});
		container.removeEventListener("touchend",EndDrawing);
	}
	function getPoint(event){
		event.preventDefault();
		let x,y,coords;
		let z = container.getBoundingClientRect();
		if(event.touches&&event.touches[0]){
			x=event.touches[0].clientX;
			y=event.touches[0].clientY;
		} else {
			x = event.clientX;
			y = event.clientY;
		}
		x = x-z.left;
		y = y-z.top;
		coords = map.containerPointToLatLng(L.point(x,y));
		return coords;
	}
	function StartDrawing(e){Pressing=true;Dragging=false;StartPoint=getPoint(e)};
	function Drawing(e){
		if((Pressing===false)||(StartPoint===null)){return};
		const currentPoint = getPoint(e);
		if(!currentPoint){return};
		if(Dragging===false){
			Dragging = true;
			if(Rectangle){map.removeLayer(Rectangle);Rectangle=null};
			Rectangle = L.rectangle([StartPoint,currentPoint],{color:config["color"],weight:config["weight"]});
			Rectangle.addTo(map);
			Rectangle.getElement().style["cursor"] = config["cursor"]["select"];
		} else {
			const bounds = L.latLngBounds(StartPoint,currentPoint);
			Rectangle.setBounds(bounds);
		}
	}
	function EndDrawing(){StartPoint=null;Pressing=false;Dragging=false;updateInputs()};
	function updateInputs(){
		if((inputs===undefined)||(Rectangle===null)){return};
		for(let i=0;i<inputs.length;i++){
			let a="",b,c=1;
			if(inputs[i] instanceof HTMLElement){a="innerHTML"};
			if(inputs[i] instanceof HTMLInputElement){a="value"};
			if(inputs.length===2){c=2};
			if(fix===undefined){
				if(a!==""){
					b = "";
					for(let j=0;j<4/inputs.length;j++){
						b = b+`(${Rectangle["_latlngs"][0][c*i+j]["lat"]}, ${Rectangle["_latlngs"][0][c*i+j]["lng"]}) `;
					}
					inputs[i][a] = b;
				} else {
					b = [];
					for(let j=0;j<4/inputs.length;j++){
						b.push([Rectangle["_latlngs"][0][c*i+j]["lat"],Rectangle["_latlngs"][0][c*i+j]["lng"]]);
					}
					inputs[i] = b;
				}
			} else {
				if(a[i]!==""){
					b = "";
					for(let j=0;j<4/inputs.length;j++){
						b = b+`(${Rectangle["_latlngs"][0][c*i+j]["lat"].toFixed(fix)}, ${Rectangle["_latlngs"][0][c*i+j]["lng"].toFixed(fix)})`;
					}
					inputs[i][a] = b;
				} else {
					b = [];
					for(let j=0;j<4/inputs.length;j++){
						b.push([Rectangle["_latlngs"][0][c*i+j]["lat"].toFixed(fix),Rectangle["_latlngs"][0][c*i+j]["lng"].toFixed(fix)]);
					}
					inputs[i] = b;
				}
			}
		}
	}
}