/*
 * Crea las pantallas de los localizadores dinamicamente y las muestra bajo demanda.
 * 
 * Requires:
 *  
 * 	LIBRERIAS JAVASCRIPT:
 * 		- jQuery
 * 		- jQuery Mobile
 * 		- Bootstrap
 * 
 * 	JAVASCRIPT:
 * 		- config {Object}: Objeto de configuracion de SITMUN
 * 
 * 	DOM:
 * 		PAGINA PRINCIPAL:
 * 		- localizadoresMenu: Id del boton del header.
 * 		- localizadores: ID de la pagina de localizadores.
 * 		- localizadoresContent: Id de l div de contenido.
 * 
 */


/**
 * Inicializa los localizadores.
 * 
 */
function tarea_localizadores()
{
	this.init();
}

/**
 * Método llamado en inicializar la tarea.
 * 
 */
tarea_localizadores.prototype.init = function()
{
	try
	{
		this.NOMBRE_TAREA = "tarea_localizadores";
		console.log("tarea_localizadores.prototype.init: " + this.NOMBRE_TAREA + " iniciando....");
		$("#localizadoresMenu").show();
		
		/*Variables*/
		this.pageDom = null;			// Objeto DOM del page, donde se va a cargar los inputs de los localizadores (jQuery).
		this.contentDOM = null;			// Objeto DOM del contenido de la pagina (jQuery).
		
		this.localizadorLayer = null;	// OpenLayers layer
		this.localizadores = null;		// Listado de los localizadores.
		this.consultaActual = null;		// Consulta activa actualmente.
		this.numElements = 0;			// Numero de elemento en el menu.

		/*Ejecución*/
		this.run();
		
	} 
	catch(e) 
	{
		alert("Error en tarea_localizadores.init()" + e.message);
	}
};

/**
 * Crea la interfície de localizadores.
 * 
 */
tarea_localizadores.prototype.run = function()
{
	try
	{
		console.log("tarea_localizadores.prototype.run: " + this.NOMBRE_TAREA);
		
		this.localizadores = {};
		
		for(var i = 0; i < config.tareas.length; i++) {
			if(config.tareas[i].stmTipotarea.ttaCodigo == 4) {
				var elem = config.tareas[i].stmConsulta;
				elem.nombre = config.tareas[i].tarNombre;
				elem.paramtta = config.tareas[i].stmParamttas;
				
				this.localizadores[config.tareas[i].tarCodigo] = elem;
				this.numElements++;
			}
		}
		console.log("\t> numero de localizadores encontrados: " + this.numElements);
		
		this._createMenu();
	} 
	catch(e)
	{
		console.error("Error en tarea_localizadores.run()", e);
	}
};

/**
 * Crea un menú con los localizadores en el elemento DOM indicado.
 * 
 * @param id del elemento DOM donde se colocara el menu.
 * 
 */
tarea_localizadores.prototype._createMenu = function()
{
	var elemento = $("#localizadoresMenu");
	var self = this;
	if(this.numElements > 0) {
		
		var ul = $("<ul></ul>").addClass("dropdown-menu");
		for(var index in config.tareas) {
			var localizador = config.tareas[index];
			if(localizador.stmTipotarea.ttaCodigo == 4) {
				
				var button = $("<a></a>")
				.attr("href", "#")
				.click({"localizador": localizador}, function(event) {
					self.consultaClick(event.data.localizador.tarCodigo);
				})
				.addClass("closeOnMobile")
				.html(localizador.tarNombre)
				.buttonMarkup({ theme: "a" });
				
				ul.append($("<li></li>").append(button));
			}
		}
		
		elemento.append(ul);
	} else {
		// No hay localizadores: ocultamos el elemento del menu
		console.log("\t> no hay elementos en el menu: ocultamos el boton!");
		elemento.hide();
	}
};

/**
 * Convierte los parámetros de la tarea en un objeto mas manejable, fusionando los parametros en uno solo agrupados por el código ${XXXX}.
 * 
 * Importante: devuelve un array donde el indice es el orden, y el orden=0 no existe, por lo que debe controlarse que al recorrer
 * el array no se trate el indice zero del array, o bien los que sean null.
 * 
 * @param params: array de los parametros de los inputs a juntar.
 * @return array de los parametros ya juntados.
 * 
 */
tarea_localizadores.prototype.paramsToObj = function (params)
{
	var ret = new Array();

	// ordenamos segun param orden para crear el objeto con los param ya ordenados.
	params.sort(function (a, b){
		if (a.pttOrden == null && b.pttOrden != null) return 1;
		if (a.pttOrden != null && b.pttOrden == null) return -1;
		if (a.pttOrden == null && b.pttOrden == null) return 0;
		return a.pttOrden > b.pttOrden;
	});
	
	for (var i = 0; i < params.length; i++) {
		var param = params[i];
		if (ret[param.pttOrden] == null) ret[param.pttOrden] = new Object();
		
		if (param.pttTipo == "LABEL") {
			
			ret[param.pttOrden]["orden"] = param.pttOrden;
			ret[param.pttOrden]["label"] = param.pttValor;
			ret[param.pttOrden]["nombre"] = param.pttNombre;
			
		} else if (param.pttTipo == "TIPO") {
			
			ret[param.pttOrden]["tipo"] = param.pttValor;
			
		} else if (param.pttTipo == "VALOR") {
			
			ret[param.pttOrden]["valor"] = param.pttValor;
			
		} else if (param.pttTipo == "SQL") {
			
			ret[param.pttOrden]["sql"] = param.pttCodigo;
			ret[param.pttOrden]["sqlString"] = param.pttValor;
			
		} else if (param.pttTipo == "OBLIGATORIO") {
			
			ret[param.pttOrden]["obligatorio"] = (param.pttValor == "1");
			
		} else if (param.pttTipo == "CENTRAR") {
			ret[param.pttOrden]["centrar"] = (param.pttValor == "1");
		}
	}

	return ret;
};

/**
 * Recibe el evento de click a una consulta concreta.
 * 
 * @param key el nombre de la consulta, que es la clave de hash
 * 
 */
tarea_localizadores.prototype.consultaClick = function(key)
{
	console.log("tarea_localizadores.consultaClick: key = ", key);
	
	var consulta = this.localizadores[key];
	this.consultaActual = consulta;
	console.log("\t> consultaActual ", this.consultaActual);
	
	if(!this.consultaActual.inputsConfig) {
		this.consultaActual.inputsConfig = this.paramsToObj(this.consultaActual.paramtta);
		this._addInputDependences();
	}
	console.log("\t> inputsConfig: ", this.consultaActual.inputsConfig);
	
	this.openFormConsulta();
	
};

/**
 * Añade a los inputs de la consulta actual las dependencias entre ellos para poder actualizar-los.
 */
tarea_localizadores.prototype._addInputDependences = function() {
	
	console.log("\t> buscamos dependencias....");
	for(var index in this.consultaActual.inputsConfig) {
		var input_parent = this.consultaActual.inputsConfig[index];
		input_parent.dependencias = new Array();
		
		for(var jndex in this.consultaActual.inputsConfig) {
			if(index != jndex) {
				var input_child = this.consultaActual.inputsConfig[jndex];
				if(input_child.sqlString && input_child.sqlString.indexOf(input_parent.nombre) != -1) {	// Hemos encontrado una dependencia
					input_parent.dependencias.push(jndex);
					console.log("\t\t- dependencia: " + index + " -> " + jndex);
				}
			}
		}
	}
	
};

/**
 * Crea el formulario con los inputs definidos en esta consulta.
 */
tarea_localizadores.prototype.openFormConsulta = function() 
{
	try 
	{
		console.log("tarea_localizadores.openFormConsulta init");
		
		// Guardamos la el div de la pagina y el div del content 
		if(!this.pageDom) this.pageDom = $("#localizadores");
		if(!this.contentDOM) this.contentDOM = $("#localizadoresContent");
		
		// Mostramos el loading
		$.mobile.loading( 'show', { theme: "a" } );
		
		// Preparamos la interficie
		var hasInputs = false;
		var content = $("<div></div>");
		var self = this;
		var autocompleteList = new Array();
		var comboList = new Array(); 
		var idConsulta = this.consultaActual.cnsCodigo;
		for(var i = 0; i < this.consultaActual.inputsConfig.length; i++) {
			
			if (this.consultaActual.inputsConfig[i]) {
				hasInputs = true;
				var orden = this.consultaActual.inputsConfig[i].orden;
				var valor = this.consultaActual.inputsConfig[i].valor || "";			// si esta definido cargamos el valor inicial.
				
				console.log("\t> input: " + orden + " tipo: " + this.consultaActual.inputsConfig[i].tipo);
				
				var parametro = $("<div></div>").attr("id", "localizadoresFormParam_" + idConsulta + "_" + orden).addClass("localizadoresFormParam").appendTo(content);

				if (this.consultaActual.inputsConfig[i].tipo == "I") {					// input
					
					$("<label></label>")
						.attr("for", "paramLoca_" + idConsulta + "_" + orden)
						.html(this.consultaActual.inputsConfig[i].label + ':&nbsp;')
						.appendTo(parametro);
					
					$("<input />")
						.attr("id", "paramLoca_" + idConsulta + "_" + orden)
						.attr("type", "text")
						.attr("value", valor)
						.addClass("ui-input-text ui-body-a")
						.appendTo(parametro);
				
				} else if (this.consultaActual.inputsConfig[i].tipo == "C") {			// combo: Solo 1 query inicial
					
					$("<label></label>")
						.attr("for", "paramLoca_" + idConsulta + "_" + orden)
						.html(this.consultaActual.inputsConfig[i].label + ':&nbsp;')
						.appendTo(parametro);
					
					$("<select></select>")
						.attr("id", "paramLoca_" + idConsulta + "_" + orden)
						//.attr("data-native-menu", "false")
						.appendTo(parametro);
					
					comboList.push({"id": "paramLoca_" + idConsulta + "_" + orden, "orden": orden});

				} else if (this.consultaActual.inputsConfig[i].tipo == "A") {			// autocompletar: Lanza query al ir escribiendo 
					
					$("<label></label>")
						.attr("for", "paramLoca_" + idConsulta + "_" + orden)
						.html(this.consultaActual.inputsConfig[i].label + ':&nbsp;')
						.appendTo(parametro);
					
					$("<ul></ul>")
						.attr("id", "paramLoca_" + idConsulta + "_" + orden)
						.appendTo(parametro);
					
					autocompleteList.push({"id": "paramLoca_" + idConsulta + "_" + orden, "orden": orden});
				}
				
				this.consultaActual.inputsConfig[i].domID = "paramLoca_" + idConsulta + "_" + orden;
				this.consultaActual.inputsConfig[i].formID = "localizadoresFormParam_" + idConsulta + "_" + orden;
				
				content.append(parametro);
			}
		}
		
		if (!hasInputs) {
			$("<b></b>").html(nls["MOV_SIN_INPUTS"]).appendTo(content);
		}
		
		$("<a></a>")
			.attr("id", "consultaSQLButton_" + idConsulta)
			.html(nls["MOV_BUSCAR"])
			.buttonMarkup({ theme: "a" })
			.appendTo(
				$("<div></div>").addClass("localizadoresBuscarButton").appendTo(content)
			);
		
		$(document).off('click', '#consultaSQLButton_' + idConsulta);
		$(document).on('click', '#consultaSQLButton_' + idConsulta, function () {
			console.log("localizador " + idConsulta + " ejecutanso sql final.");
			self.ejecutarConsulta();
		});
		
		// Añadimos los inputs al div contenedor
		this.contentDOM.html(content.html());
		
		// Mostramos la page
		if(! this.pageDom.is("visible")) $.mobile.changePage(this.pageDom);
		
		//Inicializamos autocompletes i combos
		console.log("\t> inicializamos combos y autocompletes");
		this._initCombos(comboList);
		this._initAutocompletes(autocompleteList);
		
		// Quitamos el loading
		$.mobile.loading('hide');
		
	}
	catch(e)
	{
		console.error("Error generando formulario()", e);
	}
};

/**
 * Inicializa los combos de una consulta actual. Añade los eventos que afectan a estos.
 * 
 * @param comboList: lista combos a inicializar.
 */
tarea_localizadores.prototype._initCombos = function(comboList) 
{
	var self = this;
	
	for(var index in comboList) {
		var combo = comboList[index];
		
		// Cargamos el widget selectmenu y añadimos al evento focus la cargar de los <option>
		console.log("\t> Nuevo selectmenu -> " + "#" + combo.id);
		$("#" + combo.id).selectmenu({theme: "a"}).change({combo: combo }, function (event) {
			self._onChangeCombos(event.data.combo);
		});
		
		this._cargarDatosCombo(combo);
	}
	
};

/**
 * Función que se ejecuta al hacer un canvio en un combo / autocomplete para poder actualizar los combos que dependen de este.
 * 
 * @param modifiedComboIndex: combo modificado
 */
tarea_localizadores.prototype._onChangeCombos = function(modifiedComboIndex) {
	
	console.log("tarea_localizadores._onChangeCombos init");
	var modifiedCombo = this.consultaActual.inputsConfig[modifiedComboIndex.orden];
	console.log("\t> combo modificado " + modifiedComboIndex.id);
	
	// Actualizamos los selects que dependen de este.
	for(var index in modifiedCombo.dependencias) {
		var combo = this.consultaActual.inputsConfig[modifiedCombo.dependencias[index]];
		console.log("\t> dependencia con " + combo.domID + " recargando datos...");
		this._cargarDatosCombo({id: combo.domID, orden: combo.orden});
	}
	
};

/**
 * Actualiza / llena un combo.
 * 
 * @param combo: combo a llenar.
 */
tarea_localizadores.prototype._cargarDatosCombo = function(combo) 
{
	//Mostramos el loading mientras llenamos el <select>
	$.mobile.loading( 'show', { theme: "a" } );
	
	// Eliminamos los resultados si habia
	$(".resultCandidatos").hide().remove();
	
	// Vaciamos los <option> para añadir los nuevos
	var $select = $("#" + combo.id);
	var element = this.consultaActual.inputsConfig[combo.orden];
	var consulta = this.consultaActual;
	
	$select.empty();
	console.log("\t> cargando opciones del input " + element.sql + " del localizador " + consulta.cnsCodigo);
	
	// Preparamos la llamada al servicio REST
	var data = getSessionObject();
	data.id = consulta.cnsCodigo;
	data.paramid = element.sql;
	
	for(var index in this.consultaActual.inputsConfig) {
		var param = this.consultaActual.inputsConfig[index];
		var value = null;
		if(param.tipo == "A") value = $("#" + param.formID).find("input").attr("valueid");
		else value = $("#" + param.domID).val();
		data[param.nombre.replace(/\$|\{|\}/g, "")] = value ? value : "";
	}
	
	console.log("\t> ejecucion localizador tipo C - " + consulta.cnsCodigo + " | data -> ", data);
	
	$.ajax({
		type: "POST",
		url: "../../rest/localizador",
		dataType: "json",
		data: data
	})
	.then( function ( response ) {
		var html = "";
		
		if(response.data.length <= 0) {
			html += "<option value='' >" + nls["MOV_NO_CANDIDATOS"] + "</option>";
		} else {
			
			$.each( response.data, function ( i, val ) {
				html += "<option value='" + val.ID + "'>" + val.TEXT + "</option>";
			});
			
		}
		
		$select.html(html);
		
		// Refrescamos el widget
		$select.selectmenu( "refresh", true);
		$select.trigger( "updatelayout");
		
		// Ocultamos el loading
		$.mobile.loading('hide');
	}, function (response) {
		console.error("iniCombos: ", response);
		$.mobile.loading('hide');
	});
};

/**
 * Inicializa los autocompletes de la consulta actual.
 * 
 * @param autocompleteList: lista de autocompletes a inicializar.
 */
tarea_localizadores.prototype._initAutocompletes = function(autocompleteList) 
{
	var self = this;
	var consulta = this.consultaActual;
	
	for(var index in autocompleteList) {
		var autocomplete = autocompleteList[index];
		//var param = this.consultaActual.inputsConfig[autocomplete.orden];
		console.log("\t> Nuevo autocomplete -> " + "#" + autocomplete.id + " | placeholder = " + "MOV_" + autocomplete.id.toUpperCase() );
		
		var element = consulta.inputsConfig[autocomplete.orden];
		
		$("#" + autocomplete.id).listview({filter: true, inset: true, filterPlaceholder: nls["MOV_" + autocomplete.id.toUpperCase()], icon: "", dividerTheme: "a", countTheme: "a" })
			.on( "listviewbeforefilter", {consulta: consulta, element: element}, function ( e, info ) {
				
				var $ul = $( this ), $input = $( info.input ), value = $input.val(), html = "";
				console.log("listviewbeforefilter -> consulta: " + e.data.consulta.cnsCodigo + " parametro: " + e.data.element.sql + " tamaño del filtro: " + value.length);

				// Eliminamos los resultados si habia
				$(".resultCandidatos").hide().remove();
				
				if ( value.length == 0 ) {							// Si no hay ningun caracter restauramos valores por omision
					
					$ul.html( "" );
					$ul.hide();
					$input.attr("valueId", "");
					self._onChangeCombos({orden: e.data.element.orden, id: e.data.element.domID});
					
				} else if ( value && value.length > 2 ) {					// Si hay mas de dos caracteres lanzamos la busqueda. 
					$.mobile.loading( 'show', { theme: "a" } );
					$ul.html( "" );
					$ul.show();
					$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
					$ul.listview( "refresh" );
					
					var data = getSessionObject(); 
					data.id = e.data.consulta.cnsCodigo;
					data.paramid = e.data.element.sql;
					
					console.log("\t> filtro activo = " + $input.val());
					
					for(var index in e.data.consulta.inputsConfig) {
						var param = e.data.consulta.inputsConfig[index];
						var value = null;
						if(param.tipo == "A") value = $("#" + param.formID).find("input").attr("valueid");
						else value = $("#" + param.domID).val();
						data[param.nombre.replace(/\$|\{|\}/g, "")] = value ? value : "";
					}
					
					data[e.data.element.nombre.replace(/\$|\{|\}/g, "")] = $input.val();
					
					console.log("\t> ejecucion localizador tipo A - " + consulta.cnsCodigo + " | data -> ", data);
					
					$.ajax({
						type: "POST",
						url: "../../rest/localizador",
						dataType: "json",
						data: data
					})
					.then( function ( response ) {
						$.each( response.data, function ( i, val ) {
							html += "<li valueId='" + val.ID + "'><a>" + val.TEXT + "</a></li>";
						});
						$ul.html( html );
						$ul.listview( "refresh" );
						$ul.trigger( "updatelayout");
						
						$ul.children().click(function() {
							var li = $(this);
							$ul.hide();
							console.log("li click: consulta: " + data.id + " parametro: " + data.paramid + " -> valor = " + li.attr("value") + "valor = " + li.attr("valueId"));
							$input.val(li.text()).attr("valueId", li.attr("valueId"));
							self._onChangeCombos({orden: e.data.element.orden, id: e.data.element.domID});
						});
						
						$.mobile.loading('hide');
					}, function (response) {
						console.error("listviewbeforefilter: ", response);
						$.mobile.loading('hide');
					});
				}
			});
	}
};

/**
 * Ejecuta la consulta para obtener la geometria o geometrias. En caso de obtener una sola geometria
 * se muestra directamente en el mapa. En caso de obtener varias, se muestran en un listview para
 * poder seleccionar la que se quiera.
 * 
 */
tarea_localizadores.prototype.ejecutarConsulta = function (){
	
	var idConsulta = this.consultaActual.cnsCodigo;
	
	// Eliminamos los resultados si habia
	$(".resultCandidatos").hide().remove();
	
	// Preparamos la llamada al servicio REST
	var data = getSessionObject(); 
	data.id = idConsulta;
	
	for(var index in this.consultaActual.inputsConfig) {
		var param = this.consultaActual.inputsConfig[index];
		var value = null;
		if(param.tipo == "A") value = $("#" + param.formID).find("input").attr("valueid");
		else value = $("#" + param.domID).val();
		data[param.nombre.replace(/\$|\{|\}/g, "")] = value ? value : "";
	}
	
	console.log("\t> ejecucion localizador tipo C - " + idConsulta + " | data -> ", data);
	
	var divResultado = $("<div></div>").addClass("resultCandidatos").appendTo($("#localizadoresContent"));
	
	$.ajax({
		type: "POST",
		url: "../../rest/localizador",
		dataType: "json",
		data: data
	})
	.then( function ( response ) {
		
		console.log("\t> respuesta recibida: ", response);
		if(response.data.length > 1) {
			
			console.log("\t> mostramos candidatos en un listview");
			
			var candidatosOL = $("<ol></ol>").appendTo(divResultado);
			var html = "";
			for(var index in response.data) {
				var candidato = response.data[index];
				html +=  "<li valueID='" + index + "'><a>" + candidato.TEXT + "</a></li>";
			}
			
			candidatosOL.html(html);
			candidatosOL.find("li").click(function () {
				console.log("\t> click elemento del listview " +  $(this).attr("valueID"));
				var id = $(this).attr("valueID");
				addMarker(response.data[id].THE_GEOM);
			});
			
			console.log("\t> inicializando listview....");
			candidatosOL.listview({dividerTheme: "a", countTheme: "a", icon: ""});
			console.log("\t> listview creado!");
			
		} else if (response.data.length == 1){
			
			console.log("\t> recibido un solo candidato -> mostramos en el mapa");
			var candidato = response.data[0];
			addMarker(candidato.THE_GEOM);
			
		} else {
			
			console.log("\t> ningun dato recibido");
			var candidatos = $("<ul></ul>").html("<li><a>" + nls["MOV_NO_CANDIDATOS"] + "</a></li>").appendTo(divResultado);
			candidatos.listview({dividerTheme: "a", countTheme: "a", icon: ""});
			
		}
		
	}, function (response) {
		console.error("ejecutarConsulta: ", response);
	});
};
