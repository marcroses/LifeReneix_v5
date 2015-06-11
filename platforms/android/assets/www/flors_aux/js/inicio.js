
/******************************************/
// funciones para inicio3.jsp
/******************************************/
var territorioValue="";
var perfilValue="";


function initAplicaciones() {
	try {
		if (usuarioId==null) {
			alert("Falta usuario");
			return;
		}
		console.log("Cargando territorios para el usuario: ",usuarioId);
		ConfigManager.listAplicaciones(usuarioId,loadAplicaciones);
	} catch (e) {
		alert("Error en initTerritorios()\n"+e.message);
	}
}
dojo.addOnLoad(initAplicaciones);


/**
 * Genera un ItemFileReadStore de dojo a partir de un array y los campos a utilizar como id y como nombre.
 * @param array
 * @param idField
 * @param nameField
 * @return
 */
function createReadStore(array,idField,nameField) {
		var customData = {
		        identifier: "id",
		        label: "name",
		        items: []
		};
		for(var i=0;i<array.length;i++){
			var item=new Object();
			item.id=array[i][idField];
			item.name=array[i][nameField];
			customData.items.push(item);
		}
		console.log(customData);
		var dojoStore = new dojo.data.ItemFileReadStore({
            data: customData
        });
		return dojoStore;	
}

/**
 * Recorre el array de territorios para definir el Dropdown de Dojo.
 * @param t
 * @return
 */
function loadTerritorios(t) {
	try {
		territoriosData=t;//var global.
		console.log("loadTerritorios");
		if (t==null) {
			alert(getNls("ERR_CARGA_TER"));
			return;
		}
		if (t.length==0) alert("Usuario sin territorios.");
		
		var territorioSelect=dijit.byId("territoriSelect");
		var dojoStore=createReadStore(t,"terCodigo","terNombre");
		territorioSelect.store = dojoStore;
		
		var existe=false;
		if (territorioId!==null) {
			// seleccionamos el elemento pasado por param.
			for(var i=0;i<t.length;i++){
				var item=new Object();
				if (t[i]["terCodigo"]===territorioId) existe=true;
				
			}
			if (existe) territorioSelect.attr("value",territorioId);
		}
		if (t.length==1) {
			territorioSelect.attr("value",t[0].terCodigo);
		}
	} catch (e) {
		alert("Error en loadTerritorios()\n"+e.message);
	}
}

/**
 * Ejecución en la respuesta DWR: carga el listado de aplicaciones con las disponibles para el usuario.
 * @return
 */
function loadAplicaciones(t){
	var existe=false;
	var hayInternas=false;
	try {
		if (t==null) {
			alert("Error cargando aplicaciones.");
			return;
		}
		var customData = {
		        identifier: "id",
		        label: "name",
		        items: []
		};
		console.log("aplicaciones",t);
		
		for(var i=0;i<t.length;i++){
			var item=new Object();
			// no mostramos las aplicaciones que sean solo de movil
			if (t[i] && t[i].appTemplate && t[i].appTemplate!="" && t[i].appTemplate!="-") {
				item.id=t[i].appCodigo;
				item.name=t[i].appNombre;
				item.template=t[i].appTemplate;
				item.tipo=t[i].appTipo;
				customData.items.push(item);
				hayInternas=true;
			}
			if (item.id===aplicacionId) existe=true;
		}
		var dojoStore = new dojo.data.ItemFileReadStore({
            data: customData
        });
		var aplicacionSelect=dijit.byId("aplicacionSelect");
		aplicacionSelect.store = dojoStore;
		
		// seleccionamos el elemento pasado por param.	
		if (t.length==1 && hayInternas) {
			aplicacionSelect.attr("value",t[0].appCodigo);
		}else if (existe && aplicacionId!==null) {
			aplicacionSelect.attr("value",aplicacionId);
		} 
		
		var fadeIn = dojo.fadeIn({node: "aplicacionContentPane",duration: 500});
		fadeIn.play();
	} catch (e) {
		alert("Error en loadAplicaciones()\n"+e.message);
	}
}

/**
 * Recibe el evento de change en el territorio.
 * @return
 */
function territorioSelected() {
	territorioValue="";
	if (arguments[0]==="") return;
	territorioValue=arguments[0];
	
	selectionComplete();
	//ConfigManager.listAplicaciones(usuarioId,territorioValue,loadAplicaciones);
}


/**
 * aplicación selecionada
 * @return
 */
function aplicacionSelected() {
	var aplicacionSelect=dijit.byId("aplicacionSelect");
	
	dojo.style("territorioContentPane", "opacity", "1");
	
	if (aplicacionSelect.value==="") return false;
	console.log("peticion ConfigManager.listTerritorios()");
	ConfigManager.listTerritorios(usuarioId,aplicacionSelect.value,loadTerritorios);

}

/**
 * A ejecutar cuando ya se ha escogido territorio y aplicación.
 * @return
 */
function selectionComplete() {
	// buscamos el template de la aplicacion a cargar.
	var aplicacionSelect=dijit.byId("aplicacionSelect");
	
	aplicacionSelect.store.fetch({
	    query: {'id': aplicacionSelect.value },
	    onComplete: aplicacionTemplateComplete,
	    onError: aplicacionTemplateError,
	    queryOptions: {deep: true}
    });
}

/**
 * La aplicación seleccionada se ha encontrado en el store.
 * Redirigimos al visor definido, segun sea una aplicación interna o externa.
 * 
 * @param items
 * @param request
 * @return
 */
function aplicacionTemplateComplete(items, request) {
	dojo.byId("cargandoContentPane").style.display="block";
	//console.log("fet",items, request);
	if (items[0].tipo[0]=="E") {
		// llamada a aplicación externa. Aquí no tenemos el config, buscamos las variables una a una.
		var targetUrl=items[0].template[0];
		console.log("targetUrl original:",targetUrl);
		var terCodigo=dijit.byId("territoriSelect").getValue();
		var ter=getTerritorioByCodigo(terCodigo);
		var terMunIne=ter.terCodmun;
		targetUrl=targetUrl.replace("${MUN_INE}",terMunIne);
		targetUrl=targetUrl.replace("${APP_CODIGO}",dijit.byId("aplicacionSelect").getValue());
		targetUrl=targetUrl.replace("${TER_CODIGO}",terCodigo);
		targetUrl=targetUrl.replace("${USU_CODIGO}",usuarioId);
		console.log("targetUrl final:",targetUrl);
		//Aparte introducimos en la BD del log
		ConfigManager.addLogManager(usuarioId, dijit.byId("aplicacionSelect").getValue(),terCodigo,function(text) {
			window.location=targetUrl;
		});
		
	} else {
		var form=dojo.byId("inicio3Form");
		var targetUrl=items[0].template[0];
		console.log("targetUrl:",targetUrl);
		form.action=targetUrl;
		form.submit();
	}	
}

/**
 * Obtiene el objeto territorio a partir de su código.
 * @param codigo
 * @returns
 */
function getTerritorioByCodigo(codigo) {
	for ( var i = 0; i < territoriosData.length; i++) {
		if (territoriosData[i].terCodigo==codigo) return territoriosData[i];
	}
	return null;
}

/**
 * 
 */
function aplicacionTemplateError() {
	dojo.byId("cargandoContentPane").style.display="none";
	alert("Error obteniendo template de la aplicación en inicio3.jsp");
}