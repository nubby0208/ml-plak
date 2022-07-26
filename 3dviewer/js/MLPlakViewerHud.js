/*
* Simple hud para la el viewer.
* es una escena que se renderiza sobre lo que ya está.
* Requere THREE.js.
* Autor: Gustavo Vivas 2019.
*/

class MLPlakViewerHud{
    constructor(hudWidth,hudHeight){
        
        this.width = hudWidth;
        this.height = hudHeight;

        this.cameraTypeTextX = 0;
        this.cameraTypeTextY = 20;
        
        this.cameraTypeText = '';
        this.fontSize = 16;
        this.cameraTypeFont =  'normal ' + this.fontSize +'px sans-serif';

        this.bottomCaptionText = '';
        this.bottomCaptionFontSize = 20;
        this.bottomCaptionFont =  'bold ' + this.bottomCaptionFontSize +'px sans-serif';
        this.bottomCaptionVerticalOffset = 0;

        this.hudTextFillStyle = 'rgba(0,0,0,0.75)';
        this.hudBottomRectFillStyle = 'rgba(0,0,0,0.15)';


        this.hudCanvas = document.createElement('canvas');
        this.hudCanvas.width = this.width;
        this.hudCanvas.height = this.height;

        this.context2D =  this.hudCanvas.getContext('2d');
        this.context2D.font = this.cameraTypeFont;
        this.context2D.fillStyle = this.hudTextFillStyle;


        this.sceneHUD = new THREE.Scene();
        this.cameraHUD = new THREE.OrthographicCamera(
            -this.width/2, this.width/2,
            this.height/2, -this.height/2,
            0, 30
        );

        this.hudTexture = new THREE.Texture(this.hudCanvas);
        this.hudTexture.needsUpdate = true;

        this.hudMaterial = new THREE.MeshBasicMaterial( {
                map: this.hudTexture,
            } );
        this.hudMaterial.map.minFilter = THREE.LinearFilter; //sin esto se ve borroso
        this.hudMaterial.transparent = true;

        this.hudPlaneGeometry = new THREE.PlaneGeometry( this.width, this.height );
        this.hudPlane = new THREE.Mesh( this.hudPlaneGeometry, this.hudMaterial );
        this.sceneHUD.add( this.hudPlane );
        this.sceneHUD.add( this.cameraHUD );
        
        //this.setBottomCaptionText("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a nunc scelerisque, porttito");
    }

    /**
     * asigna el texto a ser renderizado en la seccion
     * superior derecha del canvas.
     * 
     * @param {string} text 
     * @param {int} x 
     * @param {int} y 
     */
    setCurrentCameraText(text){
        this.cameraTypeText = text.replace(/Modulo/g,'Módulo');
    }

    /**
     * asigna el texto que se mostrará en la parte inferior de la pantalla
     * @param {string} text 
     */
    setBottomCaptionText(text){
        this.bottomCaptionText = text.trim();
    }

    /**
     * asigna el color del texto del caption
     * @param {string} color 
     */
    setCaptionTextColor(hexColor){
        this.hudTextFillStyle = hexColor;
    }

    /**
     * asigna el tamaño de fuente del caption inferior
     * @param {int} intSize 
     */
    setCaptionTextSize(intSize){
        this.bottomCaptionFontSize = intSize;
        this.bottomCaptionFont =  'bold ' + this.bottomCaptionFontSize +'px sans-serif';
    }

    /**
     * 
     *
     */
    setCaptiontextVerticalOffset(intOffsetY){
        this.bottomCaptionVerticalOffset = parseInt(intOffsetY);
    }

    /**
     * asigna el color del texto del rectangulo de fondo del caption
     y la opacidad
     * @param {string} color 
     * @param {float} opacity  
     */
    setCaptionBackgroundColor(hexColor){
        this.hudBottomRectFillStyle = hexColor;
    }

    /**
     * asigna la opacidad de TODO el hud
     */
    setCaptionOpacity(alpha){
        this.context2D.globalAlpha = alpha;
    }

    /**
     * ajusta el texto al tamano de la canvas.
     * @param {string} text 
     */
    _wordWrapText(text,margin){
        //var max_width  = this.width - this.cameraTypeTextX;
        var max_width  = this.width - margin;
        var lines      =  new Array();
        var width = 0, i, j;
        var result;

        while ( text.length ) {
            for( i=text.length; this.context2D.measureText(text.substr(0,i)).width > max_width; i-- );
        
            result = text.substr(0,i);
        
            if ( i !== text.length ){
                for( j=0; result.indexOf(" ",j) !== -1; j=result.indexOf(" ",j)+1 );
            }
                
            lines.push( result.substr(0, j|| result.length) );
            width = Math.max( width, this.context2D.measureText(lines[ lines.length-1 ]).width );
            text  = text.substr( lines[ lines.length-1 ].length, text.length );
        }
        return lines;
    }


    /**
     * Actualiza la textura del hud desde el canvas
     */
    updateHudTexture(){
        this.context2D.clearRect(0,0, this.width, this.height);
        //this.cameraTypeText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean a nunc scelerisque, porttitor ligula vitae, aliquet lacus. Etiam ut vulputate lacus. Suspendisse in viverra dui, eu ornare tellus. Quisque condimentum, enim ut condimentum consectetur, turpis nulla eleifend magna, sed euismod ligula ante vitae nisl. Pellentesque ac odio orci. Duis vitae elit at diam malesuada ultricies sed quis augue. Phasellus dui ante, cursus nec efficitur sed, aliquam vitae sem.";
        //this.cameraTypeText += " Sed nec nunc id risus interdum maximus. Sed convallis, mauris sit amet luctus sollicitudin, ligula tortor venenatis est, quis semper quam tellus sed risus. In eget lacinia enim, at convallis nisl. Aenean hendrerit arcu sit amet laoreet mattis. Etiam eget nulla est. Donec ac ullamcorper lectus. Fusce mollis molestie turpis, non rutrum nisl pharetra at. Curabitur ut lectus tincidunt, varius nisl ut, volutpat eros. Mauris pulvinar lectus metus, ac imperdiet massa condimentum id. Donec semper consectetur velit, at iaculis enim euismod id. In tempor interdum ligula eget imperdiet. Aliquam vestibulum ex ac arcu interdum, ac varius urna rutrum.";   
        
        // imprimir lineas superiores con texto de camara
        this.context2D.font = this.cameraTypeFont;
        this.context2D.fillStyle = 'rgba(0,0,0,0.75)';
        var lineas = this._wordWrapText(this.cameraTypeText,0);
        var lineaY = 0;

        if(lineas.length == 1){
           var tamanoLinea = this.context2D.measureText(lineas[0]);
           //console.log('tamanoLinea: ', tamanoLinea);
           this.cameraTypeTextX = this.width - tamanoLinea.width;
        }else{
            this.cameraTypeTextX = 0;
        }

        for ( var i = 0, j = lineas.length; i < j; i++ ) {

            lineaY = this.cameraTypeTextY + ( (this.fontSize) + 6 ) * i;

            this.context2D.fillText( 
                                    lineas[i], 
                                    this.cameraTypeTextX,
                                    lineaY
                                     );
        }


        //**************************************************
        //imprimir linea inferior
        
        this.context2D.font = this.bottomCaptionFont;

        var lineasInferiores = this._wordWrapText(this.bottomCaptionText,0);

        if(lineasInferiores.length == 0){
            this.hudTexture.needsUpdate = true;
            return;
        }

        var bottomTextInterlineHeight = this.bottomCaptionFontSize + 4;
        var rectY = this.height - ( bottomTextInterlineHeight  *  lineasInferiores.length  );
        rectY -= this.bottomCaptionVerticalOffset; //aplicar offset

        this.context2D.fillStyle = this.hudBottomRectFillStyle;
        this.context2D.fillRect(0,
            rectY,
            this.width,
            bottomTextInterlineHeight  *  lineasInferiores.length 
        );//this.height - rectY

        this.context2D.fillStyle = this.hudTextFillStyle;
        
        // 
        var bottomTextX,tamanoLineaInferior;
        var lineaBottomY = rectY + this.bottomCaptionFontSize; 

        for ( var k = 0; k < lineasInferiores.length; k++ ) {
            tamanoLineaInferior = this.context2D.measureText(lineasInferiores[k]);
            bottomTextX = this.width/2 - tamanoLineaInferior.width/2;
            
            this.context2D.fillText( 
                lineasInferiores[k], 
                bottomTextX,
                lineaBottomY
            );

            lineaBottomY +=  bottomTextInterlineHeight ;
        }

        this.hudTexture.needsUpdate = true;
    }

    render(renderer){
        this.updateHudTexture();
        renderer.render(this.sceneHUD, this.cameraHUD);
    }

}//class