//Variable Global
var cantidadDiamantes=5;

administrarJuego = {
    init: function () {
        // Usamos propiedad del juego 
        // Se adapta a la dimension de la pantalla
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; 
        // Alineamos horizontal y vertical el juego
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        // Para que el raton volador no se mueva
        this.flagFirstMouseDown = false;
    },
    
    preload: function () {
        // Cargamos todo los assets del juego - imagenes
        game.load.image('fondo','assets/images/fondo.jpg');
        // Cargamos imagen al juego spritsheets
        game.load.spritesheet('raton', 'assets/images/raton.png',84,92,1); // imagen con 1 elemento
        game.load.spritesheet('diamantes', 'assets/images/diamantes.png',81,84,4); // imagen con 4 elementos
    },
    
    create: function () {
        // Ubicamos coordenadas en la esquina izquierda superior
        game.add.sprite(0,0,'fondo');
        // Agregamos el sprite raton en la pantalla y agregamos a una instancia raton
        this.raton = game.add.sprite(0,0,'raton');
        // Agregamos el frame 0 del sprite raton
        this.raton.frame = 0;
        // Posicionamos el sprite raton, volvemos a posicionar con la propiedad x - y
        this.raton.x = game.width/2;
        this.raton.y = game.height/2;
        // Capturamos click en pantalla
        game.input.onDown.add(this.click,this)
        
        // Array para guardar 4 elementos
        this.diamantes = [];
        // Cantidad de elementos que queremos agregar en pantalla
       for(var i=0; i<cantidadDiamantes; i++){
            // Creamos elementos y agregamos a la pantalla
            var diamante = game.add.sprite(100,100,'diamantes'); // Coordenadas temporales
            diamante.frame = game.rnd.integerInRange(0,3); // randon especificando para 4 elementos
           // Randon de la imagen en la pantalla
            diamante.x = game.rnd.integerInRange(50,1050); 
            diamante.y = game.rnd.integerInRange(50,600); 
           
        }
    },
    
    click:function(){
       this.flagFirstMouseDown = true; 
    },

    
    update: function () {
        // Llamara todos lo frames
        if(this.flagFirstMouseDown){
            //coordenada del mouse
            var pointerX = game.input.x;
            var pointerY = game.input.y;
            //console.log('x:' +pointerX);
            //console.log('y:' +pointerY);
            // Distancia mouse y volador y guardarlo
            var distX = pointerX - this.raton.x;
            var distY = pointerY - this.raton.y;

            if(distX>0){
                this.raton.scale.setTo(1,1)
            }else{ // si esta del otro lado invertimos la orientacion en x
                this.raton.scale.setTo(-1,1)
            }
            // Mover hacia posicion del mouse
            this.raton.x += distX * 0.02; // velocidad
            this.raton.y += distY * 0.02;
        }
    }
}
// Instanciamos un juego en phaser con las dimensiones y le asignamos el render AUTO
var game = new Phaser.Game(1473, 980, Phaser.AUTO); // WEBGL - CANVAS
// Agregamos un estado juego y le asignamos el objeto administrarJuego
game.state.add('juego', administrarJuego);
game.state.start('juego');// Una ves que agregamos el objeto le damos start, phaser llamara el metodo init, preload, create, update