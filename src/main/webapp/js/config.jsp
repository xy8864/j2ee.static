<%@ page errorPage="/error.jsp" contentType="text/html; charset=utf-8"
%><%@ include file="/common/taglibs.jsp"
%><%@page import="com.fltrp.SFConstants,com.fltrp.util.*,java.util.*"
%><script type="text/javascript">
//全局变量
var CRM_CONFIG={
	"date":{
		"today":"<%=DateUtil.date2String(new Date(), "MM/dd/yyyy")%>"
	},"orderline":{
		"type":{
			"normal":<%=SFConstants.ORDERLINE_TYPE_NORMAL%>,
			"gift":<%=SFConstants.ORDERLINE_TYPE_GIFT%>,
			"bundle":<%=SFConstants.ORDERLINE_TYPE_BUNDLE%>
		}
	},"product":{
		"price":{
			"month3":80.0,
			"month6":75.0,
			"month12":70.0,
			"month18":70.0,
			"month24":70.0,
			"default":85.0
		}
	}
}
</script>