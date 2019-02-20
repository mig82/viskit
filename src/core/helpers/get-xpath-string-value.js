const ExprContext = require('xslt-processor').ExprContext; //TODO: Update package.json to use latest release.
const xpathParse = require('xslt-processor').xpathParse;
const xmlParse = require('xslt-processor').xmlParse;

var verbose = false;

/**
 * getXpathStringValue - description
 *
 * @param  {String} xml   The XML content
 * @param  {String} xpath The XPath expression
 * @return {String}       The value resulting from applying the specified XPath expression on the XML content.
 */
function getXpathStringValue(xml, xpath){
	if(verbose)console.log(xpath)
	var ctx = new ExprContext(xmlParse(xml));
	if(verbose)console.log(ctx.constructor.name)
	var node /*NodeSetValue*/ = xpathParse(xpath).evaluate(ctx);
	if(verbose)console.log(node.constructor.name)
	return node.stringValue();//nodeSetValue().nodeValue();
}

function setVerbose(makeVerbose) {
	verbose = !!makeVerbose;
}

module.exports = getXpathStringValue;
