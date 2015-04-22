<%@ page errorPage="/error.jsp"  contentType="text/html; charset=utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%> 
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>
<%@ taglib uri="http://java.sun.com/jstl/sql" prefix="sql" %>
<!doctype html public "-//w3c//dtd html 4.0 transitional//en">
<html>
<head>
<meta http-equiv="cache-control" content="no-cache, must-revalidate">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="pragram" content="no-cache"> 
<meta http-equiv="expires" content="0"> 
<title></title>
<script type="text/javascript" src="<c:url value='/js/jquery-1.4.2.min.js'/>"></script>
<link type="text/css" rel="stylesheet" href="<c:url value='/js/plugin/uploadify/uploadify.css'/>"/>
<script type="text/javascript" src="<c:url value='/js/plugin/uploadify/swfobject.js'/>"></script>
<script type="text/javascript" src="<c:url value='/js/plugin/uploadify/jquery.uploadify.v2.1.4.min.js'/>"></script>
<script type="text/javascript">
$(document).ready(function() {
	$('#uploadify').uploadify({
		'uploader'  :"<c:url value='/js/plugin/uploadify/uploadify.swf'/>",
		'script'    :"<c:url value='/ajaxUpload.do'/>",
		//'checkScript'    :"<c:url value='/ajaxUploadCheck.do'/>",
		'cancelImg' :"<c:url value='/js/plugin/uploadify/cancel.png'/>",
		'folder'    :"<c:url value='/images/upload'/>",
		'onComplete': function(event, id, fileObj, response, data) {
			console.info(id)
			console.info(fileObj)
			console.info(response)
			console.info(data)
			//alert('There are ' + data.fileCount + ' files remaining in the queue.');
		},
		'fileExt'   : '*.jpg;*.gif;*.png',
		'fileDesc'  : '*.jpg;*.gif;*.png',
		//'sizeLimit' : 1024*1024,
		'buttonText': 'BROWSE',
		'scriptData': {},
		'removeCompleted': false,
		'multi'     : true,
		'auto'      : false
	});
});
</script>
</head>
<body>
<input id="uploadify" name="uploadify" type="file" />
<a href="javascript:$('#uploadify').uploadifyUpload()">上传</a>| 
<a href="javascript:$('#uploadify').uploadifyClearQueue()">取消上传</a>
</body>
</html>