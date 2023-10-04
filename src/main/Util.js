
function isString(testString) {
	return typeof testString === 'string' || testString instanceof String;
}

module.exports = isString;
