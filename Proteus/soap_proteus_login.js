importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);

//Get any task inputs, Set other variables/constants
var strURL = "http://proteus-lab.lab.spectrum-health.org/Services/API";
var strSoapAction = "";
var apiMethod = "login";
var userName = "bluecatapi"; //input.userName;
var password = "1234qwer"; //input.password;

//Set SOAP XML for API call
var apiXML = "<username>"+userName+"</username>"
        	+"<password>"+password+"</password>";
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

//Set the HTTP Client
var post = new PostMethod(strURL);
var entity = new StringRequestEntity(msgXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
var httpclient = new HttpClient();

//POST API Call to Proteus and GET Response
logger.addInfo("Executing Proteus SOAP API Method: " + apiMethod);
var result = httpclient.executeMethod(post);

//Parse info out of result if reponse is successful, else error out of task
if (result == 200) { 
	logger.addInfo("Response status code: " + result);
	logger.addInfo("Status message : "+post.getStatusText());
	logger.addInfo("Response body: "+post.getResponseBodyAsString());

	cookie_header = post.getResponseHeader("Set-Cookie").toString();
    start_index = cookie_header.search("JSESSIONID"); //12
    end_index = cookie_header.search(";"); //55
    cookie_length = end_index - start_index //43
    cookie = cookie_header.substr(start_index, cookie_length);
	logger.addInfo(cookie);

	output.proteus_session_cookie = cookie;
}
else {
	logger.addError("Proteus SOAP API call '"+apiMethod+"()' failed with code: " + result);
	ctxt.setFailed("Unable to login to Proteus SOAP API");
}