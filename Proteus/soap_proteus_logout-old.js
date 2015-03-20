importPackage(org.apache.commons.httpclient);
importPackage(org.apache.commons.httpclient.methods);

var strURL = "http://proteus-lab.lab.spectrum-health.org/Services/API";
var strSoapAction = "";
 
var cookie = input.bluecat_session_cookie

var xmlHeader = "<SOAP-ENV:Envelope xmlns:SOAP-ENC=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:ns0=\"http://schemas.xmlsoap.org/soap/encoding/\" xmlns:ns1=\"http://api.proteus.bluecatnetworks.com\" xmlns:ns2=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:SOAP-ENV=\"http://schemas.xmlsoap.org/soap/envelope/\" SOAP-ENV:encodingStyle=\"http://schemas.xmlsoap.org/soap/encoding/\"><SOAP-ENV:Header/>";

var logoutXML = xmlHeader
    +"<ns2:Body>"
      +"<ns1:logout/>"
    +"</ns2:Body>"
  +"</SOAP-ENV:Envelope>";

logger.addInfo(logoutXML);

var post = new PostMethod(strURL);

var entity = new StringRequestEntity(logoutXML, "text/xml", "ISO-8859-1");
post.setRequestEntity(entity);
post.setRequestHeader("SOAPAction", strSoapAction);
post.setRequestHeader("Cookie", cookie);
var httpclient = new HttpClient();

var result = httpclient.executeMethod(post);
logger.addInfo("Response status code: " + result);
logger.addInfo("Status message : "+post.getStatusText());
logger.addInfo("Response body: "+post.getResponseBodyAsString());
