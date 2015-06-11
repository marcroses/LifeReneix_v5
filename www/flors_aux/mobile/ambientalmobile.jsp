<%@ page import = "java.util.Enumeration"
%><%@ page import = "com.nexusgeografics.viewer.ConfigManager" 
%><% 
	try {
		// si no es una nueva sesi�n, hacemos un clear de los par�metros. 
		// El include del inicio.defs debe ser posterior, para evitar perder el lang.
		if (!session.isNew()) {
			session.invalidate();
			session=request.getSession(true);
		}
	} catch(Exception e) {
		logger.error("Error creando nueva sesi�n en idemenorca.jsp",e);
	}
%><%@ include file="../inicio-defs.jsp" 
%><%
	String aplicacion="13";
	String territorio="1";
	String pagCarga="reneix/visor.jsp";//jsp redirecci�n

	String usuarioParam="marcus";	//usuario
	String passwordParam="password";	//constrase�a	
	
	try {
		// guardamos en sesi�n los par�metros disponibles.
		setParametros(aplicacion, territorio, session);
	} catch(Exception e) {
		logger.error("Error cargando par�metros de sesion en idemenorca.jsp",e);
	}

	int res=setUsuario(usuarioParam, passwordParam, session);//validaci�n usuario
	// if(res==1)response.sendRedirect(pagCarga+"?app="+aplicacion+"&ter="+territorio);
	if(res==1)request.getRequestDispatcher("" + pagCarga+"?app="+aplicacion+"&ter="+territorio).forward(request, response);
	else response.sendError(401,"El usuario y password de la petici�n no son correctos."+res);

%>