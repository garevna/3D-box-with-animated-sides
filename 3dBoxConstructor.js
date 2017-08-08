PerspectiveSideConstructor = function ( params ) {
		
		this.__parent__ = params.parent || document.body;		
		this.__sides__ = {};
		
		var paramsHlp = "Arguments needed: ";
		paramsHlp += "'{ parent: { html element - container }, sides: [ array of sides params ] }";
		
		if ( !params ) {
			console.warn ( "PerspectiveSideConstructor: There are no arguments. " + paramsHlp + '\nparent will be body element, sides you may build by method "createSide ( { side params } )"');
		}
		if ( !params.sides ) {
			console.warn ( "PerspectiveSideConstructor: there are no elements" + paramsHlp );
		}
		
		this.cssInit ();
		this.__parent__.className = this.classes.container;
		
		if ( params.sides ) {
			for ( var s = 0; s < params.sides.length; s++ ) {
				if ( params.sides [s] && params.sides [s].contentType && ( params.sides [s].content || params.sides [s].contentURL ) && params.sides [s].position ) {
					this.createSide ( params.sides [s] );
				} else {
					console.warn ( "Constructor needs arguments (object) to build 3D element in parent container.\nThis arguments should be: \n{ position: 'left' | 'right' | 'top' | 'bottom' , \ncontentType: 'img' | 'text', \ncontent: '...some text here...' or contentURL: 'URL' }. \nAll values should be string. \nIf contentType == 'img', contentURL should be defined (img src). \nIf contentType == 'text' and text is placed in some file on the same domain, contentURL should be defined. \nIn other cases content should be defined as string" ); 
				}
			}
		}
	window.addEventListener( 'resize', this.cssResize.bind ( this ) );
	return this;
}

PerspectiveSideConstructor.prototype.testImageSize = function ( imageURL, obj ) {
		var picture = new Image ();
		picture.src = imageURL;
		picture.targetObject = obj;
		picture.onload = function ( event ) {
			event.target.targetObject.size = { width: picture.offsetWidth, height: picture.offsetHeight };
			document.body.removeChild ( event.target );
		}
		document.body.appendChild ( picture );
}
// ===========================================================================================
//                                C R E A T E    S I D E
// ===========================================================================================
PerspectiveSideConstructor.prototype.createSide = function ( params ) {
	
		if ( !params.position ) { return null; }
		this.__sides__ [ params.position ] = document.createElement ( 'div' );
		this.__parent__.appendChild ( this.__sides__ [ params.position ] );
		
		var __side__ = this.__sides__ [ params.position ];
		
		__side__.className = this.classes [ params.position ];
		__side__.__content__ = document.createElement ( 'div' );
		__side__.appendChild ( __side__.__content__ );
		__side__.__content__.className = "perspectiveBoxSideContent";
		
		var __content__ = this.__sides__ [ params.position ].__content__;
		
		if ( params.contentType == 'img' ) {
			this.testImageSize ( params.contentURL, __side__.__content__ );
			__side__.__content__.style.backgroundImage = 'url(' + params.contentURL + ')';
			__side__.__content__.style.backgroundSize = 'contain';
			__side__.__content__.style.backgroundRepeat = 'no-repeat';
			__side__.__content__.style.backgroundPosition = 'center center';			
		} else {
			if ( params.contentURL ) {
				__side__.__content__.request = new XMLHttpRequest ();
				// __side__.__content__.request.answerContainer = __side__.__content__;
				__side__.__content__.request.fileURL = params.contentURL;
				__side__.__content__.request.onreadystatechange = function () {
					if ( this.readyState == 4 ) {
						if ( this.status == 200 ) {
							this.innerHTML = this.responseText;
						}
						else { console.error ( 'File processing error: ' + this.fileURL ); }
						this.terminate ();
					}
				}
				__side__.__content__.request.open('GET', __side__.__content__.request.fileURL );
				__side__.__content__.request.send();
			} else {
				__side__.__content__.innerHTML = params.content;
			}
		}
	__side__.parentObject = this;
	__side__.onmouseenter = __side__.onmouseleave = function ( event ) {
			var chr = ( event.type == 'mouseenter' ) ? "n" : "f";
			var prefix = event.target.parentObject.positions [  event.target.className ];
			var name = prefix + "SideTurnO" + chr;
			event.target.style.animation = name + " 2s forwards";
		}
}
 
PerspectiveSideConstructor.prototype.cssInit = function () {
		this.classes = {
			container: "garevna_perspectiveContainer",
			left: "garevna_perspectiveLeftSide",
			right: "garevna_perspectiveRightSide",
			top: "garevna_perspectiveTopSide",
			bottom: "garevna_perspectiveBottomSide"
		};
		this.positions = {
			garevna_perspectiveLeftSide: 'left',
			garevna_perspectiveRightSide: 'right',
			garevna_perspectiveTopSide: 'top',
			garevna_perspectiveBottomSide: 'bottom'
		};
		var cssRules = [
			
				"." + this.classes.container + "{ position:fixed; top:0; left:0; right:0; bottom:0; box-sizing:border-box; -webkit-perspective:400px; -webkit-perspective-origin: 50% 50%; -webkit-transform-style: preserve-3d; perspective:400px; perspective-origin: 50% 50%; transform-style: preserve-3d; }",
				
				"." + this.classes.bottom + ",." + this.classes.top + ",." + this.classes.right + ",." + this.classes.left + "{ position:absolute; box-sizing:border-box; background-size:90%; background-position:center center; background-repeat:no-repeat; border: inset 1px; box-shadow: inset 5px 5px 10px rgba(0,0,0,0.5); padding:10px 20px; text-align:justify; background-color:#E7E7E7; }",
				
				"." + this.classes.bottom + ",." + this.classes.top + "{ height:100px; width:100%; }",
				
				"." + this.classes.right + ",." + this.classes.left + "{ width:100px; height:100%; }",
				
				"." + this.classes.bottom + "{ bottom:0; -webkit-transform-origin: 50% 100%; transform-origin: 50% 100%; -webkit-transform: rotateX(90deg); transform: rotateX(90deg); }",
				
				"." + this.classes.top + "{ top:0; -webkit-transform-origin: 50% 0%; transform-origin: 50% 0%; -webkit-transform: rotateX(-90deg); transform: rotateX(-90deg); }",
				
				"." + this.classes.right + "{ right:0%; -webkit-transform-origin: 100% 100%; transform-origin: 100% 100%; -webkit-transform: rotateY(-90deg); transform: rotateY(-90deg); }",
				
				"." + this.classes.left + "{ left:0%; -webkit-transform-origin: 0% 0%; transform-origin: 0% 0%; -webkit-transform: rotateY(120deg); transform: rotateY(90deg); }",
				".perspectiveBoxSideContent { position:absolute; box-sizing:border-box; top:0; left:0; right:0; bottom:0; padding: 10px 20px; box-shadow: inset 8px 8px 16px rgba(0,0,0,0.5); overflow:auto; }"
		];
		var cssKeyframesRules = {
				leftSideTurnOn: [
					"from { transform: rotateY(90deg); width:100px; z-index:0; }",
					"to { transform: rotateY(0deg); width: 50%; z-index:300; }" ],
				leftSideTurnOf: [
					"from { transform: rotateY(0deg); width: 50%; z-index:300; }",
					"to { transform: rotateY(90deg); width:100px; z-index:0; }" ],
				rightSideTurnOn: [
					"from { transform: rotateY(-90deg); width:100px; z-index:0; }",
					"to { transform: rotateY(0deg); width: 50%; z-index:300; }" ],
				rightSideTurnOf: [
					"from { transform: rotateY(0deg); width: 50%; z-index:300; }",
					"to { transform: rotateY(-90deg); width:100px; z-index:0; }" ],
				topSideTurnOn: [
					"from { transform: rotateX(-90deg); height:100px; z-index:0; }",
					"to { transform: rotateX(0deg); height:50%; z-index:300; }" ],
				topSideTurnOf: [
					"from { transform: rotateX(0deg); height:50%; z-index:300; }",
					"to { transform: rotateX(-90deg); height:100px; z-index:0; }" ],
				bottomSideTurnOn: [
					"from { transform: rotateX(90deg); height:100px; z-index:0; }",
					"to { transform: rotateX(0deg); height:50%; z-index:300; }" ],
				bottomSideTurnOf: [
					"from { transform: rotateX(0deg); height:50%; z-index:300; }",
					"to { transform: rotateX(90deg); height:100px; z-index:0; }" ]
		};
		
		this.cssRules = Object.keys ( cssKeyframesRules );
		
		if ( !document.getElementById ( "stylesOfPerspectiveSides" ) ) {
			var sheetTag = document.createElement ( 'style' );
			sheetTag.appendChild(document.createTextNode(""));
			sheetTag.id = "stylesOfPerspectiveSides";
			document.head.appendChild ( sheetTag );
			var sheet = sheetTag.sheet;
			for ( var i = 0; i < cssRules.length; i++ ) { sheet.insertRule ( cssRules [i], i ); }
		}
		if ( !document.getElementById ( "keyFramesOfPerspective" ) ) {
			var sheetTag = document.createElement ( 'style' );
			sheetTag.appendChild(document.createTextNode(""));
			sheetTag.id = "keyFramesOfPerspective";
			document.head.appendChild ( sheetTag );
			var sheet = sheetTag.sheet;
			for ( var key in cssKeyframesRules ) {
				_rule = key + "{" + cssKeyframesRules [ key ] [0] + cssKeyframesRules [ key ] [1] + "}";
				webkitRule = "@-webkit-keyframes " + key + '{}';
				commonRule = "@keyframes " + key + '{}';
				var ind = sheet.insertRule ( webkitRule, 0 );
				sheet.rules [ ind ].appendRule ( cssKeyframesRules [ key ] [0] );
				sheet.rules [ ind ].appendRule ( cssKeyframesRules [ key ] [1] );
				sheet.insertRule ( commonRule, 0 );
				sheet.rules [ ind ].appendRule ( cssKeyframesRules [ key ] [0] );
				sheet.rules [ ind ].appendRule ( cssKeyframesRules [ key ] [1] );
			}
		}
}

PerspectiveSideConstructor.prototype.cssResize = function () {
	
	var sheet = document.getElementById ( "keyFramesOfPerspective" ).sheet;
	for ( var i = 0; i < sheet.rules.length; i++ ) {
		var rule = sheet.rules [i];
		
		if ( rule.type != CSSRule.KEYFRAMES_RULE ) { continue; }
				
		var tstLeft   = ( rule.name.indexOf ('left') >= 0 );
		var tstRight  = ( rule.name.indexOf ('right') >= 0 );
		var tstTop    = ( rule.name.indexOf ( 'top' ) >= 0 );
		var tstBottom = ( rule.name.indexOf ( 'bottom' ) >= 0 );
		
		var side = tstLeft ? 'left' : ( tstRight ? 'right' : ( tstTop ? 'top' : 'bottom' ) );
		if ( !this.__sides__ [ side ] ) continue;
		var elem = this.__sides__ [ side ];
		
		if ( elem.__content__.size ) {
			var wp = elem.__content__.size.width;
			var hp = elem.__content__.size.height;
			var w = this.__parent__.offsetWidth;
			var h = this.__parent__.offsetHeight;
			wp /= ( hp / h > wp / w ) ? ( hp / h ) : 1;
			size = [
				Math.round ( Math.min ( w * 0.5, wp ) ) + "px",
				Math.round ( Math.min ( h * 0.5, hp ) ) + "px"
			];
		} else { 
			size = [ "50%", "50%" ];
		}
		var atr = ( tstLeft || tstRight ) ? "width" : "height";
		var s = ( tstLeft || tstRight ) ? size [0] : size[1];
			
		var degree = ( rule.name.indexOf ( 'TurnOf' ) >= 0 ) ? 0 : ( ( tstLeft || tstBottom ) ? 90 : -90 );
		
		rule.cssRules[0].style [ atr ] = ( rule.name.indexOf ( 'TurnOf' ) >= 0 ) ? s : "100px";		
		rule.cssRules[1].style [ atr ] = ( rule.name.indexOf ( 'TurnOn' ) >= 0 ) ? s : "100px";;
	}
}
