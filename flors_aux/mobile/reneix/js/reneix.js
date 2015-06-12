var buscadorToponimsId=sitmunProperties["reneix.buscadorToponimsId"];
var buscadorToponimsId=sitmunProperties["reneix.buscadorToponimsId"];
var buscadorOfertaId=sitmunProperties["reneix.buscadorOfertaId"];
var buscadorAdrMunicipi=sitmunProperties["reneix.buscadorAdrMunicipi"];
var buscadorAdrNucli=sitmunProperties["reneix.buscadorAdrNucli"];
var buscadorAdrCarrer=sitmunProperties["reneix.buscadorAdrCarrer"];
var buscadorAdrPortal=sitmunProperties["reneix.buscadorAdrPortal"];
var buscadorAdrGeomCarrer=sitmunProperties["reneix.buscadorAdrGeomCarrer"];
var infoListConsulta=sitmunProperties["reneix.infoListConsulta"];
var infoRutaHabitat=sitmunProperties["reneix.infoRutaHabitat"];
var infoRutaEspecie=sitmunProperties["reneix.infoRutaEspecie"];


var peticionsTotals=0;
var peticionsFetes=0;
var peticionsEncerts=0;

var idLastConsultaEncert;
var idLastPoiid;
var idLastTipologia;


// Assignem events d'inicialitzacio de pagines
$(document).on ('pageinit', '#buscador', function (event) {
	initBuscador();
});
$(document).on ('pageshow', '#buscador', function (event) {
	$("#autocomplete_topo").listview("option", "placeholder", nls.MA_TOPONIM_TEXT);
});



$(document).on ('pageinit', '#searchpageCarrers1', function (event) {
	initBuscadorCarrers();
});
$(document).on ('pageinit', '#infoList', function (event) {
	initInformacio();
});
$(document).on ('pageinit', '#searchpageOferta', function (event) {
	initBuscadorOferta();
});


$(document).on("openLayerMap_loaded", function () {
	//activamos capa de getFeatureInfo
	try{
		getFeatureInfoLayer.activate();	
	}
	catch(Err)
	{
		alert(Err.toString());
	}
	
});

/**
 * 
 * @param olMap
 */
/*function fixContentHeight2(olMap) {
    var footer = $("div[data-role='footer']:visible"),
        content = $("div[data-role='content']:visible:visible"),
        viewHeight = $(window).height(),
        contentHeight = viewHeight - footer.outerHeight();

    if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
        contentHeight -= (content.outerHeight() - content.height() + 1);
        content.height(contentHeight);
    }
    content.width($(window).width());
    olMap.updateSize();
}*/

/*
$( document ).on( "pageinit", "#mainContainer", function( event ) {
  alert( "mainContainer init" );
  //$.mobile.changePage($("#page2"));
});*/

//fix the content height AFTER jQuery Mobile has rendered the map page
/*$('#mainContainer').on('pageshow',function (){
    fixContentHeight();
});*/

/**
 *  ????
 */
/*
(function(window, $, PhotoSwipe){
	$(document).ready(function(){
		alert("llest");
		$('div.gallery-page')
			.on('pageshow', function(e){
				var 
				currentPage = $(e.target),
				options = {},
				photoSwipeInstance = $("ul.gallery a", e.target).photoSwipe(options,  currentPage.attr('id'));
				return true;
				
			})
			.on('pagehide', function(e){
				var 
					currentPage = $(e.target),
					photoSwipeInstance = PhotoSwipe.getInstance(currentPage.attr('id'));

				if (typeof photoSwipeInstance != "undefined" && photoSwipeInstance != null) {
					PhotoSwipe.detatch(photoSwipeInstance);
				}
				return true;						
			});				
	});
}(window, window.jQuery, window.Code.PhotoSwipe));	
*/

/**
 * 
 */
function initBuscador() {

	$( "#autocomplete_topo" ).on( "listviewbeforefilter", function ( e, data ) {
		var $ul = $( this ),
			$input = $( data.input ),
			value = $input.val(),
			html = "";
		$ul.html( "" );
		if ( value && value.length > 2 ) {
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				url: "http://ide.cime.es/sitmun/rest/localizador",
				dataType: "jsonp",
				crossDomain: false,
				data: {
					id: buscadorToponimsId
					,valor: $input.val()
				}
			})
			.then( function ( response ) {
				console.log("response: ",response);
								
				if(response.data.length==0){
					html='<li>'+nls.MA_CAND_SENSE_CAND +'</li>';
				}
				else{
					$.each( response.data, function ( i, item ) {
						html += "<li THE_GEOM='"+item.THE_GEOM+"'>" + item.TEXT + "</li>";
					});
				}
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
				
			});
		}
	}).on("click", "li", function() {
		var text=$(this).text();
		var the_geom=$(this).attr("the_geom");
		
		console.log("li " ,text,the_geom); // id of clicked li by directly accessing DOMElement property
		if(the_geom) addMarker(the_geom);        
    });
}

/**
 * 
 */
function initBuscadorOferta() {

	$( "#autocomplete_oferta" ).on( "listviewbeforefilter", function ( e, data ) {
		var $ul = $( this ),
			$input = $( data.input ),
			value = $input.val(),
			html = "";
		$ul.html( "" );
		if ( value && value.length > 2 ) {
			$ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
			$ul.listview( "refresh" );
			$.ajax({
				url: "http://ide.cime.es/sitmun/rest/localizador",
				dataType: "jsonp",
				crossDomain: false,
				data: {
					id: buscadorOfertaId
					,valor: $input.val()
					,lang:lang
				}
			})
			.then( function ( response ) {
				console.log("response: ",response);
								
				if(response.data.length==0){
					html='<li>'+nls.MA_CAND_SENSE_CAND +'</li>';
				}
				else{
					$.each( response.data, function ( i, item ) {
						if(item.THE_GEOM !=null)
							html += "<li ID='"+item.ID+"' THE_GEOM='"+item.THE_GEOM+"' DSTIPUS='"+item.DSTIPUS+"'>" + item.TEXT + "</li>";
						else html += "<li ID='"+item.ID+"' DSTIPUS='"+item.DSTIPUS+"'" +
								" ETRSXMIN='"+item.ETRSXMIN+"' ETRSYMIN='"+item.ETRSYMIN+"' ETRSXMAX='"+item.ETRSXMAX+"' ETRSYMAX='"+item.ETRSYMAX+"'> " + item.TEXT + "</li>"; 
					});
				}
				$ul.html( html );
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");
				
			});
		}
	}).on("click", "li", function() {
		var text=$(this).text();
		var the_geom=$(this).attr("the_geom");
		var idRuta=$(this).attr("id");
		var dsTipus=$(this).attr("dstipus");
		var etrsxmin=$(this).attr("etrsxmin");
		var etrsymin=$(this).attr("etrsymin");
		var etrsxmax=$(this).attr("etrsxmax");
		var etrsymax=$(this).attr("etrsymax");
		
        if(the_geom) 
		{
			var xMin;
			var yMin;
			var xMax;
			var yMax;
			var coords = the_geom.substr(6) 
			coords = coords.substr(0, coords.length-1);
			matCoords = coords.split(" ");
			xMin = parseFloat(matCoords[0]) - 500;
			yMin = parseFloat(matCoords[1]) - 500;
			xMax = parseFloat(matCoords[0]) + 500;
			yMax = parseFloat(matCoords[1]) + 500;
			marcarPOI(idRuta, dsTipus, xMin, yMin, xMax, yMax, the_geom);
			//addMarker(the_geom); 
			//marcarPOI(poiid,item.IDTIPUS,xMin, yMin, xMax, yMax, item.THE_GEOM);
		}
        else marcarRuta(idRuta, dsTipus, etrsxmin,etrsymin,etrsxmax,etrsymax);
    });
}


/**
 * Inicialitza els controls per la cerca de carrers.
 */
function initBuscadorCarrers() {
	try {
		console.log("initBuscadorCarrers");
		
		// lllista de municipis
		$("#llistaMunicipis").on('click', 'li', function() {
			console.log("llistaMunicipis click");
			var id=$(this).attr("key");
			var ds=$(this).text();
			
			
			searchAdrecaGeneric(buscadorAdrNucli,id,"#llistaNuclis","#searchpageCarrers2");
			$("#btMunicipi1 .ui-btn-text").text(ds);
		});
		
		// llista de nuclis
		$("#llistaNuclis").on('click', 'li', function() {
			console.log("llistaNuclis click");
			var id=$(this).attr("key");
			var ds=$(this).text();
			
			searchAdrecaGeneric(buscadorAdrCarrer,id,"#llistaCarrers",'#searchpageCarrers3');
			$("#btMunicipi2 .ui-btn-text").text($("#btMunicipi1 .ui-btn-text").text());
			$("#btNucli1 .ui-btn-text").text(ds);
			
		});
		
		// llista de carrers
		$("#llistaCarrers").on('click', 'li', function() {
			console.log("llistaCarrers click");
			var id=$(this).attr("key");
			var ds=$(this).text();
			
			//searchLoadPortals(id);
			searchAdrecaGeneric(buscadorAdrPortal,id,"#llistaPortals",'#searchpageCarrers4');
			$("#btMunicipi3 .ui-btn-text").text($("#btMunicipi1 .ui-btn-text").text());
			$("#btNucli2 .ui-btn-text").text($("#btNucli1 .ui-btn-text").text());			
			$("#btCarrer1 .ui-btn-text").text(ds);
		});
		
		// llista de portals
		$("#llistaPortals").on('click', 'li', function() {
			var text=$(this).text();
			var the_geom=$(this).attr("the_geom");
			var carrer=$(this).attr("carrer");
						
			//Si indiquem geometria hi ha portal
			//Si indiquem carrer, no hi ha portal, hi ha carrer
			console.log("li " ,text,the_geom); 
	        if(the_geom) addMarker(the_geom);
	        else if (carrer)marcarCarrer(carrer);
		});
	} catch (e) {
		console.error("Error a initBuscadorCarrers()",e);
	}
}

/**
 * Executa la cerca del localitzador i emplena el listbox amb el resultats.
 * 
 * @param locId id del localitzador.
 * @param value valor a cercar.
 * @param listviewId identificador del listview. Ex: "#llistaNom".
 */
function searchAdrecaGeneric(locId,value,listviewId,targetPageId) {
	//$.mobile.showPageLoadingMsg( 'Searching' );
	$.ajax({
		type: "POST",
		url: "http://ide.cime.es/sitmun/rest/localizador",
		data: {
			id: locId
			,valor: value
		},
		cache: false,
		dataType: 'json',
		success: function(data) { //Si se ejecuta correctamente
			if(!data.error){
				//Inicializa la lista desplegable
				$(listviewId).empty();
				if(data.data!=null){
					//Inserta los valores recuperados en la lista desplegable
					if(data.data.length==0){
						//Si no hay portales, marcamos la calle directamente
						if(targetPageId=='#searchpageCarrers4'){
							$(listviewId).append('<li carrer="'+value+'">'+nls.MA_CAND_SENSE_PORTAL+'</li>');
							
						}
						else $(listviewId).append('<li>'+nls.MA_CAND_SENSE_CAND +'</li>');
					}
					else{
						$.each(data.data, function(i, item) {
							var geom="";
							if (item.THE_GEOM) geom=' the_geom="'+item.THE_GEOM+'"';
							
							$(listviewId).append('<li key="'+item.ID+'"'+geom+'>'+item.TEXT+'</li>');
						});
					}
					//Actualiza la lista
					$(listviewId).listview("refresh");
				}
			}else{
				alert("Error carregant dades.");
			}
			$.mobile.hidePageLoadingMsg( 'Searching' );
		},
		error: function(data) {
			//En caso de error mostramos una ventan a de error.
			alert("Error carregant dades: "+data.responseText);
			$.mobile.hidePageLoadingMsg( 'Searching' );
		}
	});
	// saltem a la plana amb els candidats sempre i quan sigui.
	console.log("searchAdrecaGeneric targetPageId: "+targetPageId);
	$.mobile.changePage(targetPageId/*,{ transition: "slideup"}*/);
}


/**
 * Inicialitza els controls per la cerca de candidats
 */
function initInformacio() {
	try {
		console.log("initInformacio");
		
		$.ajax({
			type: "POST",
			url: "http://ide.cime.es/sitmun/rest/consulta",
			data: {
				id: infoListConsulta
				,valor: ""
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente
				if(!data.error){
					if(data.data!=null){
						//Inserta los valores recuperados en la lista desplegable
						$.each(data.data, function(i, item) {
							
							var dataIconClass=nls[item.TEXT+"_IMG"];
							$("#infoListButtons").append('<a id="infoItem_'+item.CANDID+'" data-role="button" data-iconpos="left" data-icon="'+dataIconClass+'">'+nls[item.TEXT]+'</a>');
							$("#infoItem_"+item.CANDID).button().on("click",function() {
								$.mobile.showPageLoadingMsg( 'Searching' );
								//HACEMOS LA INFO Pasando el tipo de ruta, para saber si es de tipologia ruta o no
								infoSearch(item.CANDID,item.FITXAID, item.FITXATIP);								
							});
						});
					}
				}else{
					alert("Error carregant dades.");
				}
				//$.mobile.hidePageLoadingMsg( 'Searching' );

			},
			error: function(data) {
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	} catch (e) {
		console.error("Error a initInformacio()",e);
	}
}

/**
 * Executa la consulta que ha de carregar els candidats de informació.
 * @param idConsulta
 */
function infoSearch(idConsultaCand,idConsultaDetall, tipologia) {
	try {
		console.log("infoSearch init");
		
		var coordX = map.getCenter().lon;
		var coordY = map.getCenter().lat;
		
		if ( $("#propRadio :radio:checked").val() == "ubicacio")
		{
			coordX = currentLon;
			coordY = currentLat;
		}
		
		//alert(coordX + " " +  coordY);
		
		$.ajax({
			type: "POST",
			url: "http://ide.cime.es/sitmun/rest/consulta",
			data: {
				id: idConsultaCand
				,valor: $("#infoListDistance").val()
				,x: coordX
				,y: coordY
				,lang:lang
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente
				if(!data.error){
					console.log("infoSearch success",data);
					if(data.data!=null){
						//Inserta los valores recuperados en la lista desplegable
						var listview=$("#infoCandListview");
						listview.empty();
						listview.append('<li data-role="list-divider" role="heading">'+nls.MA_CAND_RESULTATS+'</li>');
						if (data.data.length==0) {
							listview.append('<li>'+nls.MA_CAND_SENSE_CAND+'</li>');
						} else {
							$.each(data.data, function(i, item) {
								//console.log("candidat:",item);
								listview.append('<li detallid="'+idConsultaDetall+'" poiid="'+item.ID+'" tipologia="'+tipologia+'"><a class="footerMenuItem">'+item.TEXT + '</a></li>');
							});
							// asignamos evento de click a la lista, primero desactivar pues al hacer el empty los eventos aun se quedan en el <li>
							listview.off('click','li').on("click","li",infoCandClick);
						}
						// vamos a la pagina de candidatos
						$.mobile.changePage('#infoCand');
						listview.listview("refresh");
					}
				}else{
					alert("Error carregant dades.");
				}
				$.mobile.hidePageLoadingMsg( 'Searching' );
			},
			error: function(data) {
				console.log("infoSearch error",data);
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	} catch (e) {
		console.error("Error a infoSearch()",e);
		$.mobile.hidePageLoadingMsg( 'Searching' );
	}	
}

/**
 *	Carga la ficha de información del cadidato.
 */
function infoCandClick() {
		var detallid=$(this).attr("detallid");
		var poiid=$(this).attr("poiid");
		var tipologia=$(this).attr("tipologia");
		infoCandidato(detallid, poiid, tipologia);
}
	
/**
 * Carrega la fitxa del candidat. Utilitzat en GFI i a l'aprop d'aquí.
 * 
 * @param detallid id de la consulta a executar.
 * @param poiid codi de poi a carregar.
 * @param tipologia tipus de fitxa a mostrar. Ara mateix hi ha POI i RUTA.
 */	
function infoCandidato(detallid, poiid, tipologia){
	console.log("init del infoCandidato");
	if (typeof(detallid)=="undefined") {
		// capa que no te configurada una fitxa.
		alert(nls.MA_SENSE_DADES);
		return;
	}
	
	$.mobile.showPageLoadingMsg( 'Searching' );
	try{	
		$.ajax({
			type: "POST",
			url: "http://ide.cime.es/sitmun/rest/consulta",
			data: {
				id: detallid
				,valor: poiid
				,lang:lang
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente
				if(!data.error){
					if(data.data!=null){
						//Inserta los valores recuperados en la lista desplegable
						console.log("data:",data.data);
						var item=data.data[0];
						//TIPOLOGIA RUTAS, mostramos una info totalmente separada
						if (typeof(item)=="undefined") {
							// capa que no te configurada una fitxa.
							alert(nls.MA_SENSE_DADES);
						} else if(tipologia=='RUTA'){
							$("#infoFitxaRUTAImg").css("display", "inline");
							$("#infoFitxaRUTAImg").one('error', function() {  this.style.display = 'none'; });
							
							if (item.DSTIPUS!="RENEIX") item.FOTO = item.FOTO.substr(0,item.FOTO.lastIndexOf("/")) + "/normal" + item.FOTO.substr(item.FOTO.lastIndexOf("/"));

							
							$("#infoFitxaRUTAImg").attr("src",item.FOTO+"");
							
							if(item.ETRSXMIN !=null){
								$("#infoFitxaRUTAMarker").closest('.ui-btn').show();
								$("#infoFitxaRUTAMarker").off('click').on("click",function(){
									marcarRuta(poiid,item.DSTIPUS,item.ETRSXMIN, item.ETRSYMIN, item.ETRSXMAX, item.ETRSYMAX);
								});
							}
							else{
								$("#infoFitxaRUTAMarker").closest('.ui-btn').hide();
							}
							
							$("#infoFitxaRUTAImg").off('click').on("click",function(){
								mostrarFotosCand(poiid,tipologia);
							});
							
							//cambiamos textos especificos de cada RUTA
							$("#infoFitxaRUTAHeader").html(item.NOM + " (" + item.DSTIPUS + ")");
							$("#infoFitxaRUTANombre").html(item.NOM);
							$("#infoFitxaRUTADesc").html(item.DSRUTA);
							$("#infoFitxaRUTADistancia").html(item.DISTANCIA + " m.");
							$("#infoFitxaRUTATiempo").html(item.TEMPSMIG + " min.");
							$("#infoFitxaRUTADesnivel").html(item.DESNIVELL + " m.");
							$("#infoFitxaRUTADificultad").html(item.DIFICULTAT);
							$("#infoFitxaRUTAInteres").html(item.TRETS_INTERES);
							
							var btnHabitats=$("#infoFitxaRUTAToHabitats");
							var btnEspecies=$("#infoFitxaRUTAToEspecies");
							
							btnHabitats.off("click");
							btnEspecies.off("click");							
							/*Nomes es mostra els botons de reneix si la ruta es de tipus reneix*/
							if(item.DSTIPUS=="RENEIX"){
								btnHabitats.closest('.ui-btn').show();
								btnEspecies.closest('.ui-btn').show();
								btnHabitats.on("click",function(){
									buscarHabitats(poiid);
								});
								btnEspecies.on("click",function(){
									buscarEspecies(poiid);
								});
							}
							else {
								btnHabitats.closest('.ui-btn').hide();
								btnEspecies.closest('.ui-btn').hide();
							}
							// vamos a la pagina de ficha
							$.mobile.changePage('#infoFitxaRUTA');
						}else if(tipologia=='POI'){
							$("#infoFitxaPOIImg").css("display", "inline");
							$("#infoFitxaPOIImg").one('error', function() {  this.style.display = 'none'; });
							$("#infoFitxaPOIImg").attr("src",item.FOTO+"");		
							
							if(item.THE_GEOM !=null){
								$("#infoFitxaPOIMarker").closest('.ui-btn').show();
								$("#infoFitxaPOIMarker").off('click').on("click",function(){
									//addMarker(item.THE_GEOM);
									var xMin;
									var yMin;
									var xMax;
									var yMax;
									var coords = item.THE_GEOM.substr(6) 
									coords = coords.substr(0, coords.length-1);
									matCoords = coords.split(", ");
									xMin = parseFloat(matCoords[0]) - 500;
									yMin = parseFloat(matCoords[1]) - 500;
									xMax = parseFloat(matCoords[0]) + 500;
									yMax = parseFloat(matCoords[1]) + 500;
									marcarPOI(poiid,item.IDTIPUS,xMin, yMin, xMax, yMax, item.THE_GEOM);
								});
								
								
								$("#infoFitxaPOIyours").closest('.ui-btn').show();
								$("#infoFitxaPOIyours").off('click').on("click",function(){
									var xPoi;
									var yPoi;
									var coords = item.THE_GEOM.substr(6) 
									coords = coords.substr(0, coords.length-1);
									matCoords = coords.split(", ");
									xPoi = parseFloat(matCoords[0]);
									yPoi = parseFloat(matCoords[1]);
									$("#yoursHeader").html(item.NOM);
									destiLon = xPoi;
									destiLat = yPoi;
									//findRoute(xPoi, yPoi,'trekking');
									findRouteIDE(xPoi, yPoi,'car');
								});								
							}
							else{
								$("#infoFitxaPOIMarker").closest('.ui-btn').hide();
								$("#infoFitxaPOIyours").closest('.ui-btn').hide();
							}
							$("#infoFitxaPOIImg").off('click').on("click",function(){
								mostrarFotosCand(poiid,tipologia);
							});
							//cambiamos textos especificos de cada POI
							$("#infoFitxaPOIHeader").html(item.NOM);
							$("#infoFitxaPOINombre").html(item.NOM);
							$("#infoFitxaPOIDesc").html(item.DESC);
							document.getElementById("infoFitxaPOIDesc").innerHTML = item.DESC;
							
							
							// vamos a la pagina de ficha de POI
							$.mobile.changePage('#infoFitxaPOI');
						} 
						else if(tipologia=='ACB'){
							$("#infoFitxaACBImg").css("display", "inline");
							$("#infoFitxaACBImg").one('error', function() {  this.style.display = 'none'; });
							$("#infoFitxaACBImg").attr("src",item.FOTO+"");

							if(item.ETRSXMIN !=null){
								$("#infoFitxaACBMarker").closest('.ui-btn').show();
								$("#infoFitxaACBMarker").off('click').on("click",function(){
									marcarACB(item.ETRSXMIN, item.ETRSYMIN, item.ETRSXMAX, item.ETRSYMAX);
								});
							}
							else{
								$("#infoFitxaACBMarker").closest('.ui-btn').hide();
							}
							
							$("#infoFitxaACBImg").off('click').on("click",function(){
								mostrarFotosCand(poiid,tipologia);
							});
							
							//cambiamos textos especificos de cada RUTA
							$("#infoFitxaACBHeader").html(item.NOM + " (" + item.DSTIPUS + ")");
							$("#infoFitxaACBNombre").html(item.NOM);
							$("#infoFitxaACBDesc").html(item.DESC);
							
							$("#infoFitxaACBToInteresHeader").html(item.NOM + " (" + item.DSTIPUS + ")");
							$("#infoFitxaACBToInteresDesc").html(item.EL_INTERES);

							$("#infoFitxaACBToConservacioHeader").html(item.NOM + " (" + item.DSTIPUS + ")");
							$("#infoFitxaACBToConservacioDesc").html(item.CONSERVACIO);

							$("#infoFitxaACBToEndemiquesHeader").html(item.NOM + " (" + item.DSTIPUS + ")");
							$("#infoFitxaACBToNoEndemiquesHeader").html(item.NOM + " (" + item.DSTIPUS + ")");
							
							var btnACBInteres=$("#infoFitxaACBToInteres");
							var btnACBConservacio=$("#infoFitxaACBToConservacio");
							var btnACBEnde=$("#infoFitxaACBToEndemiques");
							var btnACBNoEnde=$("#infoFitxaACBToNoEndemiques");
							
							btnACBInteres.off("click");
							btnACBConservacio.off("click");							
							btnACBEnde.off("click");
							btnACBNoEnde.off("click");
							
							//Muntem la llista d'espècies endèmiques:
							$("#llistaEndemiques").empty();
							var listEnde = item.ESP_ENDEMIQUES;
							listEnde = listEnde.substr(8);
							listEnde = listEnde.substr(0,listEnde.length-5);
							var matListEnde = listEnde.split("</li><li>")
							for (var i=0;i<matListEnde.length;i++)
							{
								var esp = matListEnde[i];
								if ((esp.substr(0,5)!="</li>") || (esp.substr(0,4)!="<li>"))
								{
									if (esp.substr(0, 7).toLowerCase()=="<a href")
									{
										$("#llistaEndemiques").append('<li>' + esp + '</li>');
									}
									else{
										$("#llistaEndemiques").append('<li data-icon="false"><a href="#">' + esp + '</a></li>');
									}
								}
							}
							
							//Muntem la llista d'espècies NO endèmiques:
							$("#llistaNoEndemiques").empty();
							var listEnde = item.ESP_NO_ENDEMIQUES;
							listEnde = listEnde.substr(8);
							listEnde = listEnde.substr(0,listEnde.length-5);
							var matListEnde = listEnde.split("</li><li>")
							for (var i=0;i<matListEnde.length;i++)
							{
								var esp = matListEnde[i];
								if ((esp.substr(0,5)!="</li>") || (esp.substr(0,4)!="<li>"))
								{
									if (esp.substr(0, 7).toLowerCase()=="<a href")
									{
										$("#llistaNoEndemiques").append('<li>' + esp + '</li>');
									}
									else{
										$("#llistaNoEndemiques").append('<li data-icon="false"><a href="#">' + esp + '</a></li>');
									}
								}
							}							

							
							//Nomes es mostra els botons de reneix si la ruta es de tipus reneix
							btnACBInteres.on("click",function(){
								$.mobile.changePage('#FitxaACBToInteres');
							});
							btnACBConservacio.on("click",function(){
								$.mobile.changePage('#FitxaACBToConservacio');
							});
							btnACBEnde.on("click",function(){
								$.mobile.changePage('#FitxaACBToEndemiques');
								$("#llistaEndemiques").listview("refresh");
							});		
							btnACBNoEnde.on("click",function(){
								$.mobile.changePage('#FitxaACBToNoEndemiques');
								$("#llistaNoEndemiques").listview("refresh");
							});		
							// vamos a la pagina de ficha
							$.mobile.changePage('#infoFitxaACB');
						}
						else if(tipologia=='NATURA2000'){
							$("#infoFitxaN2000Img").css("display", "inline");
							$("#infoFitxaN2000Img").one('error', function() {  this.style.display = 'none'; });
							$("#infoFitxaN2000Img").attr("src",item.FOTO+"");

							$("#infoFitxaN2000Img").off('click').on("click",function(){
								mostrarFotosCand(poiid,tipologia);
							});
							
							//cambiamos textos especificos de cada RUTA
							$("#infoFitxaN2000Header").html(item.NOM + " (XARXA NATURA 2000)");
							$("#infoFitxaN2000Nombre").html(item.NOM);
							$("#infoFitxaN2000Sup").html(item.SUPERFICIE);
							$("#infoFitxaN2000AltresFigures").html(item.ALTRES_FIGURES_PROTECCIO);
							
							$("#infoFitxaN2000ToMediFisicHeader").html(item.NOM + " (XARXA NATURA 2000)");
							$("#infoFitxaN2000ToMediFisicDesc").html(item.MEDI_FISIC);

							$("#infoFitxaN2000ToMediNaturalHeader").html(item.NOM + " (XARXA NATURA 2000)");
							$("#infoFitxaN2000ToMediNaturalDesc").html(item.MEDI_NATURAL);

							//$("#infoFitxaN2000ToLinksHeader").html(item.NOM + " (XARXA NATURA 2000)");
							//$("#infoFitxaN2000ToMediNaturalDesc").html(item.MEDI_NATURAL);							
							
							var btnN2000MediFisic=$("#infoFitxaN2000ToMediFisic");
							var btnN2000MediNatural=$("#infoFitxaN2000ToMediNatural");
							//var btnN2000MediLinks=$("#infoFitxaN2000ToLinks");
							
							btnN2000MediFisic.off("click");
							btnN2000MediNatural.off("click");							
							//btnN2000MediLinks.off("click");
							
							
							//Nomes es mostra els botons de reneix si la ruta es de tipus reneix
							btnN2000MediFisic.on("click",function(){
								$.mobile.changePage('#FitxaN2000ToMediFisic');
							});
							btnN2000MediNatural.on("click",function(){
								$.mobile.changePage('#FitxaN2000ToMediNatural');
							});
							/*
							btnN2000MediLinks.on("click",function(){
								$.mobile.changePage('#FitxaN2000ToLinks');
								//$("#llistaEndemiques").listview("refresh");
							});		
							*/
							
							// vamos a la pagina de ficha
							$.mobile.changePage('#infoFitxaN2000');
						}
						else if(tipologia=='PLATJA'){
							$("#infoFitxaPlatgesImg").css("display", "inline");
							$("#infoFitxaPlatgesImg").one('error', function() {  this.style.display = 'none'; });
							$("#infoFitxaPlatgesImg").attr("src",item.FOTO+"");

							$("#infoFitxaPlatgesImg").off('click').on("click",function(){
								mostrarFotosCand(poiid,tipologia);
							});
							
							//cambiamos textos especificos de cada RUTA
							$("#infoFitxaPlatgesHeader").html(item.NOM);
							
							var btnPlatgesPDF=$("#infoFitxaPlatgesPDF");
							
							btnPlatgesPDF.off("click");
							
							
							//Nomes es mostra els botons de reneix si la ruta es de tipus reneix
							btnPlatgesPDF.on("click",function(){
								window.open(item.DESC, '_blank', 'fullscreen=yes'); 
								return false;
							});
							// vamos a la pagina de ficha
							$.mobile.changePage('#infoPlatges');
						}	
						else if(tipologia=='RUTAGEO'){
							$("#infoFitxaRUTAGeoImg").css("display", "inline");
							$("#infoFitxaRUTAGeoImg").one('error', function() {  this.style.display = 'none'; });
							
						
							$("#infoFitxaRUTAGeoImg").attr("src","http://cartografia.cime.es/documents/imatgesRutesGeologiques/r" + item.IDRUTA + "_001_1.jpg");
							
							$("#infoFitxaRUTAGeoMarker").closest('.ui-btn').show();
							$("#infoFitxaRUTAGeoMarker").off('click').on("click",function(){
								marcarRuta(poiid,"RUTAG",item.X-500, item.Y-500, item.X+500, item.Y+500);
							});
							
						
							//cambiamos textos especificos de cada RUTA
							$("#infoFitxaRUTAGeoHeader").html(item.NOMPUNT);
							$("#infoFitxaRUTAGeoNombre").html(item.PARATGE);
							$("#infoFitxaRUTAGeoDistancia").html(item.LONGUITUD + " m.");
							$("#infoFitxaRUTAGeoTiempo").html(item.TMIG + "");
							$("#infoFitxaRUTAGeoDesnivel").html(item.DESNIVELL + " m.");
							
							$("#infoFitxaRUTAGeoDesc").html(item.CONTINGUTS);
							//$("#infoFitxaRUTAGeoDificultad").html(item.DIFICULTAT);
							//$("#infoFitxaRUTAGeoInteres").html(item.CONTINGUTS);
							
							var btnMesInfo=$("#infoFitxaRUTAGeoToHMesInfo");
							var btnMesPO=$("#infoFitxaRUTAGeoToMesPO");
							
							btnMesInfo.off("click");
							btnMesPO.off("click");							

							btnMesInfo.closest('.ui-btn').show();
							btnMesPO.closest('.ui-btn').show();
							btnMesInfo.on("click",function(){
								
								$("#GFICandidatsHabitatsGeoTitol").html('<h3>' + item.NOMPUNT + '</h3>');
								var listview=$("#GFICandidatsHabitatsGeo");
								listview.empty();

								var fitxaHabitat='';
								
								if (currentIdioma=="ca")
								{
									listview.append('<li data-role="list-divider">DADES GENERALS</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Punt Inici: </b><span> '+item.PIINICI+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Punt Final: </b><span> '+item.PFINAL+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');
									
									fitxaHabitat='';
									listview.append('<li data-role="list-divider">ACCESSOS</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Com arribar-hi: </b><span> '+item.ACCES+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Senderisme: </b><span> '+item.SENDERISME+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Cicloturisme: </b><span> '+item.CICLOTURISME+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Vehicle: </b><span> '+item.VEHICLE+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tot terreny: </b><span> '+item.TOTTERRENY+'</span>'
									fitxaHabitat+='</p>';

									listview.append('<li>'+ fitxaHabitat+'</li>');

									
									fitxaHabitat='';
									listview.append('<li data-role="list-divider">GEOLOGIA</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.CONTEXT+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Unitat morfoestrcutural: </b><span> '+item.UNITAT+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipus de roques (1): </b><span> '+item.ROQUES1+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipus de roques (2): </b><span> '+item.ROQUES2+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipus d\'estructures (1): </b><span> '+item.ESTRUCTURES1+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipus d\'estructures (2): </b><span> '+item.ESTRUCTURES2+'</span>'
									fitxaHabitat+='</p>';
									
									listview.append('<li>'+ fitxaHabitat+'</li>');								


									fitxaHabitat='';
									listview.append('<li data-role="list-divider">RECOMANACIONS</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.NOTES+'</span>'
									fitxaHabitat+='</p>';
									
									listview.append('<li>'+ fitxaHabitat+'</li>');	
									
									
								}
								else{
									listview.append('<li data-role="list-divider">DATOS GENERALES</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Punto Inicio: </b><span> '+item.PIINICI+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Punto Final: </b><span> '+item.PFINAL+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');
									
									fitxaHabitat='';
									listview.append('<li data-role="list-divider">ACCESOS</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>C&oacute;mo llegar: </b><span> '+item.ACCES+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Senderismo: </b><span> '+item.SENDERISME+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Cicloturismo: </b><span> '+item.CICLOTURISME+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Veh&iacute;culo: </b><span> '+item.VEHICLE+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Todo terreno: </b><span> '+item.TOTTERRENY+'</span>'
									fitxaHabitat+='</p>';

									listview.append('<li>'+ fitxaHabitat+'</li>');

									
									fitxaHabitat='';
									listview.append('<li data-role="list-divider">GEOLOG&Iacute;A</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.CONTEXT+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Unidad morfoestrcutural: </b><span> '+item.UNITAT+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipo de rocas (1): </b><span> '+item.ROQUES1+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipo de rocas (2): </b><span> '+item.ROQUES2+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipo de estructuras (1): </b><span> '+item.ESTRUCTURES1+'</span>'
									fitxaHabitat+='</p>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<b>Tipo de estructuras (2): </b><span> '+item.ESTRUCTURES2+'</span>'
									fitxaHabitat+='</p>';
									
									listview.append('<li>'+ fitxaHabitat+'</li>');								


									fitxaHabitat='';
									listview.append('<li data-role="list-divider">RECOMENDACIONES</li>');
									fitxaHabitat='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.NOTES+'</span>'
									fitxaHabitat+='</p>';
									
									listview.append('<li>'+ fitxaHabitat+'</li>');	

								}
								
								
								$.mobile.changePage('#infoFitxaRUTAGeoHabitats');
								//Enviamos al top de la pagina para que si anteriormente habia muchos elementos y habian bajado 
								//la pagina vuelva a aparecer al principio de todo
								$("#infoFitxaRUTAGeoHabitats").scrollTop(0);
								listview.listview("refresh");								
								

							});
							
							
							
							btnMesPO.on("click",function(){

								var content='';	
								var titolPO = "Punt d\'observaci&oacute; ";
								var titolPOs = ".<br>Punts d\'observaci&oacute;";
								if (currentIdioma=="es") 
								{
									titolPO = "Punto de observaci&oacute;n ";
									titolPOs = ".<br>Puntos de observaci&oacute;n ";
									
								}
								$("#GFICandidatsEspeciesGeoTitol").html('<h3>' + item.NOMPUNT + '</h3>');
								var listview=$("#GFICandidatsEspeciesGeo");
								listview.empty();
								var fitxaHabitat=''

								if (item.DSPUNT01!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 1</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_001_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT01+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}
								
								if (item.DSPUNT02!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 2</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_002_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT02+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}
								
								if (item.DSPUNT03!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 3</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_003_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT03+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}
								
								if (item.DSPUNT04!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 4</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_004_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT04+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}

								if (item.DSPUNT05!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 5</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_005_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT05+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}

								if (item.DSPUNT06!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 6</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_006_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT06+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}

								if (item.DSPUNT07!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 7</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_007_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT07+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}

								if (item.DSPUNT08!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 8</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_008_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT08+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}

								if (item.DSPUNT09!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 9</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_009_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT09+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}
																
								if (item.DSPUNT10!=null) 
								{
									listview.append('<li data-role="list-divider">' + titolPO + ' 10</li>');
									fitxaHabitat ='<div class="fitxa_img"><center><img src="http://cartografia.cime.es/documents/imatgesRutesGeologiques/rgeo' + item.IDRUTA.substring(3) + '_010_1.jpg" style="max-width:100%;"/></center></div>';
									fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;">'
									fitxaHabitat+='		<span> '+item.DSPUNT10+'</span>'
									fitxaHabitat+='</p>';
									listview.append('<li>'+ fitxaHabitat+'</li>');	
								}
								
								$.mobile.changePage('#infoFitxaRUTAGeoEspecies');
								//Enviamos al top de la pagina para que si anteriormente habia muchos elementos y habian bajado 
								//la pagina vuelva a aparecer al principio de todo
								$("#infoFitxaRUTAGeoEspecies").scrollTop(0);
								listview.listview("refresh");								





							});
							// vamos a la pagina de ficha
							$.mobile.changePage('#infoFitxaRUTAGeo');
						}
						else if(tipologia=='RUTAGEOP'){
							$("#infoFitxaRUTAGeoPImg").css("display", "inline");
							$("#infoFitxaRUTAGeoPImg").one('error', function() {  this.style.display = 'none'; });
							
						
							$("#infoFitxaRUTAGeoPImg").attr("src","http://cartografia.cime.es/documents/imatgesRutesGeologiques/r" + item.IDRUTA + "_" + item.IDPOI + "_1.jpg");
							
						
							//cambiamos textos especificos de cada RUTA
							$("#infoFitxaRUTAGeoPHeader").html(item.NOMPUNT);
							$("#infoFitxaRUTAGeoPDesc").html(item.INFO);
							
							// vamos a la pagina de ficha
							$.mobile.changePage('#infoFitxaRUTAGeoP');
						}						
					}
				}else{
					alert("Error carregant dades.");
				}
				$.mobile.hidePageLoadingMsg( 'Searching' );
			},
			error: function(data) {
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	} catch (e) {
		console.error("Error a infoCandClick()",e);
		$.mobile.hidePageLoadingMsg( 'Searching' );
	}
}

function fn_Especie(valor)
{
	$.mobile.showPageLoadingMsg( 'Searching' );
	try{	
		$.ajax({
			type: "POST",
			url: "http://ide.cime.es/sitmun/rest/consulta",
			data: {
				id: 344
				,valor: valor
				,lang:lang
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente

				//Anadimos todas las especies encontradas
				var listview=$("#GFICandidatsEspecies2");
				var fitxaEspecie='';
				listview.empty();
				if(!data.error){
					//Inicializa la lista desplegable
					if(data.data.length>0){
						for(var i=0;i< data.data.length; i++){
							var item=data.data[i];
							
							fitxaEspecie='<div class="fitxa_img"><center><img src="'+item.FOTO+'" style="max-width:100%;"/></div></center><p>&nbsp;';
							fitxaEspecie+='<p class="fitxa_nom"><b>'+nls.MA_FITXA_NOM_CIENTIFIC +'</b><span> '+item.NOM+'</span></p>';
							fitxaEspecie+='<p class="fitxa_desc"  style="text-align:justify;"><b>'+nls.MA_FITXA_DESC +'</b><span> '+item.DESCRIPCIO+'</span></p>';
							
							if (item.NOM_POPULAR!=null){							
								if (item.NOM_POPULAR.trim()==""){							
									listview.append('<li data-role="list-divider">'+item.NOM+'</li>');
								}
								else{
									listview.append('<li data-role="list-divider">'+item.NOM_POPULAR+'</li>');
								}
							}
							else{
								listview.append('<li data-role="list-divider">'+item.NOM+'</li>');
							}
							
							listview.append('<li>'+ fitxaEspecie+'</li>');
							
						}
					}
					else{
						listview.append('<li data-role="list-divider" >'+nls.MA_FITXA_ESPECIES+'</li>');
						listview.append('<li>'+nls.MA_SENSE_DADES+'</li>');
					}
					$.mobile.changePage('#infoFitxaRUTAEspecies2');
					//Enviamos al top de la pagina para que si anteriormente habia muchos elementos y habian bajado 
					//la pagina vuelva a aparecer al principio de todo
					$("#infoFitxaRUTAEspecies2").scrollTop(0);
					listview.listview("refresh");
				}else{
					alert("Error carregant dades.");
				}
				$.mobile.hidePageLoadingMsg( 'Searching' );			
			
			
			},
			error: function(data) {
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	} catch (e) {
		console.error("Error a infoCandClick()",e);
		$.mobile.hidePageLoadingMsg( 'Searching' );
	}	
}

/**
 * Mostramos todas las fotos del candidato
 */
function mostrarFotosCand(Id, tipologia){
	try{
	//Mostramos la pagina de infoFitxaImatges
    console.log("mostrarFotosCand");
    $.mobile.showPageLoadingMsg( 'Searching' );
	
    var infoFotosConsulta=sitmunProperties["reneix.infoFotosConsulta" + tipologia.toUpperCase()];
	$.ajax({
		type: "POST",
		url: "http://ide.cime.es/sitmun/rest/consulta",
		data: {
			id: infoFotosConsulta
			,valor: Id
		},
		cache: false,
		dataType: 'json',
		success: function(data) { //Si se ejecuta correctamente
			if(!data.error){
				if(data.data!=null){
					//Inserta los valores recuperados en la lista desplegable
					console.log("data:",data.data);
					if(data.data.length>0){
						var fotosPetites=new Array();
						var fotosGrans=new Array();
						
						for(var i=0;i< data.data.length; i++){
							fotosPetites.push(data.data[i].RUTA_FOTO_PETITES);
							fotosGrans.push(data.data[i].RUTA_FOTO_GRAN);
							
						}
						var html='';
						var nomFoto='';
						var $ul=$("#gallery");
						for(var i=0;i< fotosPetites.length; i++){
							//nomFoto=fotosGrans[i].substring(fotosGrans[i].lastIndexOf("/")+1);
							html += '<li><a href="'+fotosGrans[i]+'" rel="external"><img src="'+fotosPetites[i]+'" alt="'+nomFoto+'" /></a></li>';
						}
						$ul.html( html );
						$.mobile.changePage('#infoFitxaImatges');
					}
				}
			}else{
				alert("Error carregant dades.");
			}
			$.mobile.hidePageLoadingMsg( 'Searching' );
		},
		error: function(data) {
			//En caso de error mostramos una ventan a de error.
			alert("Error carregant dades: "+data.responseText);
			$.mobile.hidePageLoadingMsg( 'Searching' );
		}
	});
	
	} catch (e) {
	console.error("Error a infoCandClick()",e);
	$.mobile.hidePageLoadingMsg( 'Searching' );
	}
}

/**
 * Funcio que a partir de la ruta la remarca i la centra en el mapa
 */
function marcarRuta(valor, tipus, xmin, ymin, xmax, ymax){
	console.log("Inicio del marcar ruta");
	console.log("Valor",valor);
	console.log("Tipus",tipus);
	
	var cartoId=sitmunProperties["reneix.rutas." + tipus.toUpperCase()];
	
	//NO existeix la cartografia relacionada amb aquesta ruta
	if(!cartoId) {
		console.error("No existeix cap carto relacionada amb aquesta ruta");
		return;
	}
	
	var rutaRemarcada= map.getLayersByName("RUTA_REMARCADA");
	
	//Si ja hi ha un layer remarcat l'eliminem
	if (rutaRemarcada.length>0){
		console.log("destruimos la rutaRemacada");
		rutaRemarcada[0].destroy();
	}	
	
	var layerOrig=map.getLayersByName(cartoId)[0];
	console.log("layerOrig", layerOrig);
	var layer;
	var capaConsultada;
	if (!layerOrig){
		var cartografia=getCartografiaByCodigo(cartoId);
		layer=createLayerOL(cartografia, false, false);
		layer.setVisibility(true);

			//Carreguem la capa consultada
			capaConsultada=createLayerOL(cartografia, false, true);
			$('input[type=checkbox]').each(function () {
				if (cartoId==$(this).val())
				{
					//alert($(this).val());
					$(this).prop('checked',true);
					try{
						$(this).checkboxradio('refresh');
					}
					catch(Err)
					{
						//alert (Err.toString());
					}
				}
			});
			mapChangeVisibility(null,cartoId,true);
	}
	else
		layer=layerOrig.clone();
	
	layer.setName("RUTA_REMARCADA");
	var pathSld=sitmunProperties["rutas.sld"];
	console.log("pathSld", pathSld);
	var field=sitmunProperties["reneix.rutas.campoId"];
	var value=valor;
	
	layer.params.SLD=pathSld+"?params="+layer.params.LAYERS+"~"+field+"~"+value;
	//layer.params.SLD=pathSld+"?params=Capa~"+field+"~"+value;
	layer.params.STYLES="linebyfield";
	layer.redraw();
	map.addLayer(layer);
	//Afegim mes ordre perque el layer no quedi per sota
	layer.order = layer.order + 500;
	raiseLayerOrder(layer);

	//centrem el mapa
	console.log("A continuacio centrem la  ruta");
	console.log("minx", xmin);
	console.log("miny", ymin);
	console.log("xmax", xmax);
	console.log("ymax", ymax);
	if (xmin != "" && ymin != "" && xmax != "" && ymax != "")
		map.zoomToExtent(new OpenLayers.Bounds(xmin,ymin,xmax, ymax));
	
	//Carreguem el mapa
	$.mobile.changePage('#mainContainer');
	console.log("Fin del marcar ruta");
}

/**
 * Funcio que a partir de la ruta la remarca i la centra en el mapa
 */
function marcarPOI(valor, tipus, xmin, ymin, xmax, ymax, the_geom){
	
	console.log("Inicio del marcar ruta");
	console.log("Valor",valor);
	console.log("Tipus",tipus);
	
	var cartoId=sitmunProperties["reneix.rutas." + tipus.toUpperCase()];
	
	//NO existeix la cartografia relacionada amb aquesta ruta
	if(!cartoId) {
		console.error("No existeix cap carto relacionada amb aquesta ruta");
		return;
	}
	
	var rutaRemarcada= map.getLayersByName("RUTA_REMARCADA");
	
	//Si ja hi ha un layer remarcat l'eliminem
	if (rutaRemarcada.length>0){
		console.log("destruimos la rutaRemacada");
		rutaRemarcada[0].destroy();
	}	
	
	var layerOrig=map.getLayersByName(cartoId)[0];
	console.log("layerOrig", layerOrig);
	var layer;
	var capaConsultada;
	if (!layerOrig){
		var cartografia=getCartografiaByCodigo(cartoId);
		layer=createLayerOL(cartografia, false, false);
		layer.setVisibility(true);

			//Carreguem la capa consultada
			capaConsultada=createLayerOL(cartografia, false, true);
			$('input[type=checkbox]').each(function () {
				if (cartoId==$(this).val())
				{
					//alert($(this).val());
					$(this).prop('checked',true);
					try{
						$(this).checkboxradio('refresh');
					}
					catch(Err)
					{
						//alert (Err.toString());
					}
				}
			});
			mapChangeVisibility(null,cartoId,true);
	}

	// convertimos wkt a feature
	var wkt = new OpenLayers.Format.WKT();
	var features = wkt.read(the_geom);
	
	//volvemos a mapa
	$.mobile.changePage('#mainContainer');
	//mostramos resultado en OL
	var localizadorLayer=getLayerBuscador();
	localizadorLayer.addFeatures(features);	
	

	//centrem el mapa
	console.log("A continuacio centrem la  ruta");
	console.log("minx", xmin);
	console.log("miny", ymin);
	console.log("xmax", xmax);
	console.log("ymax", ymax);
	if (xmin != "" && ymin != "" && xmax != "" && ymax != "")
		map.zoomToExtent(new OpenLayers.Bounds(xmin,ymin,xmax, ymax));
	
	//Carreguem el mapa
	$.mobile.changePage('#mainContainer');
	console.log("Fin del marcar ruta");
}


/**
 * Funcio que a partir de la ACB la centra en el mapa
 */
function marcarACB(xmin, ymin, xmax, ymax){
	if (xmin != "" && ymin != "" && xmax != "" && ymax != "")
		map.zoomToExtent(new OpenLayers.Bounds(xmin,ymin,xmax, ymax));
	
	//Carreguem el mapa
	$.mobile.changePage('#mainContainer');
	console.log("Fin del marcar ruta");
}

/**
 * 
 * @param value
 */
function marcarCarrer(value){
	console.log("init del marcarCarrer");
	try{
		$.ajax({
			type: "POST",
			url: "http://ide.cime.es/sitmun/rest/localizador",
			data: {
				id: buscadorAdrGeomCarrer
				,valor: value
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente
				if(!data.error){
					//Inicializa la lista desplegable
					var item=data.data[0];
					addMarkerCarrer(item.THE_GEOM);						
				}else{
					alert("Error carregant dades.");
				}
				$.mobile.hidePageLoadingMsg( 'Searching' );
			},
			error: function(data) {
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	}catch(e) {
		console.error("Error a marcarCarrer()",e);
		$.mobile.hidePageLoadingMsg( 'Searching' );
	}
}
/**
 * 
 * @param value
 */
function buscarHabitats(idRuta){
	console.log("init del buscarHabitats");
	$.mobile.showPageLoadingMsg( 'Searching' );
	try{
		$.ajax({
			type: "GET",
			url: "http://ide.cime.es/sitmun/rest/localizador",
			data: {
				id: infoRutaHabitat
				,valor: idRuta
				,lang:lang
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente
				//Anadimos todos los habitats encontrados
				var listview=$("#GFICandidatsHabitats");
				listview.empty();
				var fitxaHabitat='';
				if(!data.error){
					//Inicializa la lista desplegable
					if(data.data.length>0){
						for(var i=0;i< data.data.length; i++){
							var item=data.data[i];
							
							//fitxaHabitat='<p class="fitxa_nom"><b>'+nls.MA_FITXA_NOM +'</b><span> '+item.NOM+'</span></p>';
							fitxaHabitat ='<div class="fitxa_img"><center><img src="'+item.FOTO+'" style="max-width:100%;"/></center></div>';
							fitxaHabitat+='<p class="fitxa_desc" style="text-align:justify;"><b>'+nls.MA_FITXA_DESC +'</b><span> '+item.DESCRIPCIO+'</span></p>';
							listview.append('<li data-role="list-divider">'+item.NOM+'</li>');
							listview.append('<li>'+ fitxaHabitat+'</li>');
						}
					}
					else{
						listview.append('<li data-role="list-divider" >'+nls.MA_FITXA_HABITATS+'</li>');
						listview.append('<li>'+nls.MA_SENSE_DADES+'</li>');
					}
					$.mobile.changePage('#infoFitxaRUTAHabitats');
					//Enviamos al top de la pagina para que si anteriormente habia muchos elementos y habian bajado 
					//la pagina vuelva a aparecer al principio de todo
					$("#infoFitxaRUTAHabitats").scrollTop(0);
					listview.listview("refresh");
				}else{
					alert("Error carregant dades.");
				}
				$.mobile.hidePageLoadingMsg( 'Searching' );
			},
			error: function(data) {
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	}catch(e) {
		console.error("Error a buscarHabitats()",e);
		$.mobile.hidePageLoadingMsg( 'Searching' );
	}
}

/**
 * 
 * @param value
 */
function buscarEspecies(idRuta){
	console.log("init del buscarEspecies");
	$.mobile.showPageLoadingMsg( 'Searching' );
	try{
		$.ajax({
			type: "GET",
			url: "http://ide.cime.es/sitmun/rest/localizador",
			data: {
				id: infoRutaEspecie
				,valor: idRuta
				,lang:lang
			},
			cache: false,
			dataType: 'json',
			success: function(data) { //Si se ejecuta correctamente
				//Anadimos todas las especies encontradas
				var listview=$("#GFICandidatsEspecies");
				var fitxaEspecie='';
				listview.empty();
				if(!data.error){
					//Inicializa la lista desplegable
					if(data.data.length>0){
						for(var i=0;i< data.data.length; i++){
							var item=data.data[i];
							
							fitxaEspecie='<div class="fitxa_img"><center><img src="'+item.FOTO+'" style="max-width:100%;"/></div></center><p>&nbsp;';
							fitxaEspecie+='<p class="fitxa_nom"><b>'+nls.MA_FITXA_NOM_CIENTIFIC +'</b><span> '+item.NOM+'</span></p>';
							fitxaEspecie+='<p class="fitxa_desc"  style="text-align:justify;"><b>'+nls.MA_FITXA_DESC +'</b><span> '+item.DESCRIPCIO+'</span></p>';
							
								
							listview.append('<li data-role="list-divider">'+item.NOM_POPULAR+'</li>');
							listview.append('<li>'+ fitxaEspecie+'</li>');
							
						}
					}
					else{
						listview.append('<li data-role="list-divider" >'+nls.MA_FITXA_ESPECIES+'</li>');
						listview.append('<li>'+nls.MA_SENSE_DADES+'</li>');
					}
					$.mobile.changePage('#infoFitxaRUTAEspecies');
					//Enviamos al top de la pagina para que si anteriormente habia muchos elementos y habian bajado 
					//la pagina vuelva a aparecer al principio de todo
					$("#infoFitxaRUTAEspecies").scrollTop(0);
					listview.listview("refresh");
				}else{
					alert("Error carregant dades.");
				}
				$.mobile.hidePageLoadingMsg( 'Searching' );
			},
			error: function(data) {
				//En caso de error mostramos una ventan a de error.
				alert("Error carregant dades: "+data.responseText);
				$.mobile.hidePageLoadingMsg( 'Searching' );
			}
		});
	}catch(e) {
		console.error("Error a buscarEspecies()",e);
		$.mobile.hidePageLoadingMsg( 'Searching' );
	}
}



/*Asignamos el callback del feature info aqui*/
function asignarListener(){
	var getfeatureinfo=function(event) {
		$.mobile.hidePageLoadingMsg( 'Searching' );
		console.log("GFI: ",event.features);
		var features=event.features;
		//Una vez tenemos las features las tratamos para agrupar los features encontrados
		var listview=$("#GFICandidats");
		listview.empty();
		
		var numEncerts=0;
		var idConsultaEncert="";
		var idPoiid="";
		var idTipologia="";
		
		if (features.length==0) {
			//alert("1");
			listview.append('<li data-role="list-divider" role="heading">'+nls.MA_CAND_RESULTATS+'</li>');
			listview.append('<li>'+nls.MA_CAND_NO_CAND+'</li>');
			listview.off('click','li');
		}
		else{
			var cartos=new Object();                		
			/*Clasificacion de los features encontrados*/
			for (var i=0; i < features.length; i++){
				var carto=features[i].carCodigo;
				if (!(carto in cartos)) {
					cartos[carto]=new Array();
				}
				cartos[carto].push(features[i]);
			}
			/*Impresion de los elementos encontrados*/
			for(var cartoId in cartos){
				idText=sitmunProperties["reneix."+ cartoId +".grupo"];
				// comprovem que te configuració.
				if (typeof(idText)!="undefined") {
					listview.append('<li data-role="list-divider">'+nls[idText]+'</li>');
					
					for(var i=0; i < cartos[cartoId].length; i++){
						var feature=cartos[cartoId][i];
						var idConsulta=sitmunProperties["reneix."+ feature.carCodigo +".consultaId"];
						var poiid=feature.attributes[sitmunProperties["reneix."+ feature.carCodigo +".id"]];
						var texto=feature.attributes[sitmunProperties["reneix."+ feature.carCodigo +".texto"]];
						var tipologia=sitmunProperties["reneix."+ feature.carCodigo +".tipologia"];
					
						listview.append('<li detallid="'+idConsulta+'" poiid="'+poiid+'" tipologia="'+tipologia+'"><a class="footerMenuItem">'+texto+'</a></li>');
						// asignamos evento de click a la lista, primero desactivar pues al hacer el empty los eventos aun se quedan en el <li>
						listview.off('click','li').on("click","li",infoCandClick);
						numEncerts++;
						idConsultaEncert = idConsulta;
						idPoiid = poiid;
						idTipologia = tipologia;						
					
					}
				} else {
					console.error("Capa amb info activada però sense configurar.");
					listview.append('<li data-role="list-divider" role="heading">CartoId:'+cartoId+'</li>');
					listview.append('<li>Capa amb info activada però sense configurar</li>');
					//listview.off('click','li');
				}
			}
			
		}
		if (numEncerts==1)
		{
			infoCandidato(idConsultaEncert, idPoiid, idTipologia);
		}
		else{
			$.mobile.changePage('#dialog-info');
			listview.listview("refresh");
		}
	};
	var beforegetfeatureinfo=function(){
		$.mobile.showPageLoadingMsg( 'Searching' );
	};
	
	var nogetfeatureinfo=function(){
		$.mobile.showPageLoadingMsg( 'Searching' );
		var event=new Object();
		event.features=new Array();
		getfeatureinfo(event);
	};
	
	
	var obj=new Object();
	obj['getfeatureinfo']=getfeatureinfo;
	obj['beforegetfeatureinfo']=beforegetfeatureinfo;
	obj['nogetfeatureinfo']=nogetfeatureinfo;
	return obj;
}


/**
 * Afegeix un marcador a la geometria WKT passada i torna a la plana del mapa.
 * 
 * @param the_geom
 */
function addMarkerCarrer(the_geom) {
	try{
		if(!the_geom) return;
		// convertimos wkt a feature
	    var wkt = new OpenLayers.Format.WKT();
	    var features = wkt.read(the_geom);
	    
	    //volvemos a mapa
	    $.mobile.changePage('#mainContainer');
	    //mostramos resultado en OL
	    var localizadorLayer=getLayerBuscador();
	    localizadorLayer.addFeatures(features);

		map.zoomToExtent(features.geometry.getBounds());					
		map.setCenter(features.geometry.getBounds().getCenterLonLat());		
	}catch(e){console.error("Error en addMarkerCarrer",e);}
}

/**
 * Función que devuelve una URL donde esta el servidor de formateo de los GetFeatureInfo WMS.
 * Si devoldevos 'null' o '' se lanzará la URL directamenta al servidor WMS para recibir el XML.
 * 
 * @returns {String}: URL del servidor de formateo o NULL
 */
function getServiceInfoURL() {
	//alert("getServiceInfoURL");
	return null;
}


