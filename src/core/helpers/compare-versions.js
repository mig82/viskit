"use strict";

function compVersion(a, b) {
	var i, cmp, len;
	a = (a + '').split('.');
	b = (b + '').split('.');
	len = Math.max(a.length, b.length);
	for( i = 0; i < len; i++ ) {
		if( a[i] === undefined ) {
			a[i] = '0';
		}
		if( b[i] === undefined ) {
			b[i] = '0';
		}
		cmp = parseInt(a[i], 10) - parseInt(b[i], 10);
		if( cmp !== 0 ) {
			return (cmp < 0 ? -1 : 1);
		}
	}
	return 0;
}

function gteVersion(a, b) {
	return compVersion(a, b) >= 0;
}
function ltVersion(a, b) {
	return compVersion(a, b) < 0;
}

module.exports = {
	compVersion: compVersion,
	gteVersion: gteVersion,
	ltVersion: ltVersion
};
