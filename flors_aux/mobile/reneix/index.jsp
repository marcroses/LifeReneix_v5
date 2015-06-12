<%@ page import = "java.util.Enumeration"
%><%@ page import = "com.nexusgeografics.viewer.ConfigManager" 
%><% 
/**
Plana de entrada que realiza el login de un usuario y territorio determinados y redirige al visor.jsp.
*/
	try {
		// si no es una nueva sesi�n, hacemos un clear de los par�metros. 
		// El include del inicio.defs debe ser posterior, para evitar perder el lang.
		if (!session.isNew()) {
			session.invalidate();
			session=request.getSession(true);
		}
	} catch(Exception e) {
		logger.error("Error creando nueva sesi�n en index.jsp",e);
	}
%><%@ include file="/inicio-defs.jsp" 
%><%
	// Par�metros para abrir el visor movil:
	String aplicacion="13";
	String territorio="1";
	String usuarioParam="marcus";	//usuario
	String passwordParam="password";	//constrase�a
	
	String lang=request.getLocale().getLanguage(); //Idioma que ha pedido el navegador
	String pagCarga="visor.jsp";//jsp redirecci�n
	
	try {
		// guardamos en sesi�n los par�metros disponibles.
		setParametros(aplicacion, territorio, session);
	} catch(Exception e) {
		logger.error("Error cargando par�metros de sesion en index.jsp",e);
	}

	int res=setUsuario(usuarioParam, passwordParam, session);//validaci�n usuario
	if(res==1)response.sendRedirect(pagCarga+"?app="+aplicacion+"&ter="+territorio+"&lang="+lang);
	else response.sendError(401,"El usuario y password de la petici�n no son correctos."+res);

%>