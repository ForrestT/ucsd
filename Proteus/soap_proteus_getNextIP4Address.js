importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);

function get_tag_value(body, tag) {
	start_index = body.search("<"+tag+">")
	if (start_index == -1) {
		return null;
	}
	start_index = start_index + tag.length + 2;
	end_index = body.search("</"+tag+">");
	if (end_index == -1) {
		return null;
	}
	value_len = end_index - start_index;
	return body.substr(start_index, value_len);
}

//Get any task inputs, Set other variables/constants
var strURL = input.proteus_API_URL;
var strSoapAction = "";
var apiMethod = "getNextIP4Address";
var network_id = input.proteus_network_id;
var cookie = input.proteus_session_cookie;
var network_gateway = String(input.proteus_network_gateway);
var octects = network_gateway.split(".");
var offset = octects[0] + "." + octects[1] + "." + octects[2] + "." + "31";

//Set SOAP XML for API call
var apiXML ="<parentId>"+network_id+"</parentId>"
			+"<properties>offset="+offset+"|excludeDHCPRange=True</properties>";
var msgXML = "<SOAP-ENV:Envelope "
				+"xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" "
				+"xmlns:ns0=\"http://schemas.xmlsoap.org/soap/encoding/\" "
				+"xmlns:ns1=\"http://api.proteus.bluecatnetworks.com\" "
				+"xmlns:ns2=\"http://schemas.xmlsoap.org/soap/envelope/\" "
				+"xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" "
				+"xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" "
				+"SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\">"
				+"<SOAP-ENV:Header/>"
				+"<ns2:Body>"
					+"<ns1:"+apiMethod+">"
						+apiXML
					+"</ns1:"+apiMethod+">"
				+"</ns2:Body>"
			+"</SOAP-ENV:Envelope>";
logger.addInfo(msgXML);
//Set the HTTP Client
var post = new PostMethod(strURL);
var entity = new StringRequestEntity(msgXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
post.setRequestHeader("Cookie", cookie);
var httpclient = new HttpClient();

//POST API Call to Proteus and GET Response
logger.addInfo("Executing Proteus SOAP API Method: " + apiMethod);
var result = httpclient.executeMethod(post);
var response = post.getResponseBodyAsString();

//Parse info out of result if reponse is successful, else error out of task
if (result == 200) { 
	logger.addInfo("Response status code: " + result);
	logger.addInfo("Status message : " + post.getStatusText());
	var assigned_ip = get_tag_value(response, "return");
	if (assigned_ip == null) {
		logger.addError("No IP Address available in network: " + network_gateway);
		ctxt.setFailed("Task failed at " + apiMethod + ". Specify network with available IP addresses.");
	}
	output.proteus_assigned_ip = assigned_ip;
}
else {
	logger.addError("Proteus SOAP API call '"+apiMethod+"()' failed with code: " + result);
	ctxt.setFailed("Error Executing Proteus SOAP API: " + apiMethod);
}