/**
	Console Help
*/

module.exports.logM	=	function( t ){
	console.log( t );
};

module.exports.err	=	function( t ){
	console.error( t );
};

module.exports.space 	=	function(){
	console.log(' ');
};

module.exports.spaces	=	function( n ){

	for( let i = 0; i<n; i++ ){ this.space(); }
};
