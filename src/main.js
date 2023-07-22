//Variable Global
var cantidadDiamantes = 10;

administrarJuego = {
	// Inicializa datos
	init: function () {
		// Usamos propiedad del juego 
		// Se adapta a la dimension de la pantalla
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		// Alineamos horizontal y vertical el juego
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		// Para que el raton volador no se mueva
		this.movimientoMouse = false;
		this.finJuego = false;
		this.cantidadDiamanteCapturado = 0;
	},

	// Precarga de assets
	preload: function () {
		// Cargamos todo los assets del juego - imagenes
		game.load.image('fondo', 'assets/images/fondo.jpg');
		game.load.image('epg', 'assets/images/epg.png');
		// Cargamos personajes al juego spritsheets
		game.load.spritesheet('ratonVolador', 'assets/images/raton.png', 84, 156, 1);
		game.load.spritesheet('diamantes', 'assets/images/diamantes.png', 81, 84, 4);
	},

	// Instanciar los assets
	create: function () {
		// Ubicamos coordenadas en la esquina izquierda superior
		game.add.sprite(0, 0, 'fondo');
		game.add.sprite(755, 0, 'epg');// Imagen de la escuela
		// Agregamos el sprite raton en la pantalla y agregamos a una instancia raton
		this.ratonVolador = game.add.sprite(0, 0, 'ratonVolador');
		// Agregamos el frame 0 del sprite raton
		this.ratonVolador.frame = 0;
		// Posicionamos el sprite raton, volvemos a posicionar con la propiedad x - y
		this.ratonVolador.x = game.width / 2;
		this.ratonVolador.y = game.height / 2;
		this.ratonVolador.anchor.setTo(0.5);

		// Capturamos Click en pantalla
		game.input.onDown.add(this.hacerClick, this);

		// Array para guardar 10 elementos
		this.diamantes = [];
		// Cantidad de elementos que queremos agregar en pantalla
		for (var i = 0; i < cantidadDiamantes; i++) {
			// Creamos elementos y agregamos a la pantalla
			// Coordenadas temporales
			var diamante = game.add.sprite(100, 100, 'diamantes');
			// Randon para 4 elementos de los diamantes
			diamante.frame = game.rnd.integerInRange(0, 3);
			// Randon de los diamantes en la pantalla
			diamante.x = game.rnd.integerInRange(50, 800);
			diamante.y = game.rnd.integerInRange(50, 410);
			// Agregamos al array cada diamante
			this.diamantes[i] = diamante;
		}

		// Agregamos texto para el incremento
		this.puntuacionActual = 0;
		this.puntajeTexto = game.add.text(game.width / 2, 40, 'Puntaje: 0'); // mostramos 0 en pantalla
	},

	// Bucle del juego
	update: function () {
		// Llamara todos lo frames
		if (this.movimientoMouse && !this.finJuego) {
			// Capturamos coordenada del mouse
			var punteroX = game.input.x;
			var punteroY = game.input.y;
			// Distancia mouse y raton volador
			var distanciaX = punteroX - this.ratonVolador.x;
			var distanciaY = punteroY - this.ratonVolador.y;

			// Si x e menor a 0 invertimos al raton volador
			distanciaX > 0 ? this.ratonVolador.scale.setTo(1, 1) : this.ratonVolador.scale.setTo(-1, 1)

			// Mover hacia posicion del mouse y velocidad
			this.ratonVolador.x += distanciaX * 0.03;
			this.ratonVolador.y += distanciaY * 0.03;

			// Recorremos cantidadDiamantes para colisionar y cambiar visible=false
			for (var i = 0; i < cantidadDiamantes; i++) {
				var rectanguloRatonVolador = this.devuelveLimitesRatonVolador();
				var rectanguloDiamante = this.devuelveLimitesDiamante(this.diamantes[i]);
				// Solo si es visible y hay colision
				if (this.diamantes[i].visible && this.esRectanguloColisionado(rectanguloRatonVolador, rectanguloDiamante)) {
					this.aumentarPuntaje();
					// Si colisionamos le ponemos en false
					this.diamantes[i].visible = false;
				}
			}
		}
	},

	hacerClick: function () {
		this.movimientoMouse = true;
	},

	aumentarPuntaje: function () {
		// Al colisionar incrementamos en 10 la puntuacion
		this.puntuacionActual += 10;
		this.puntajeTexto.text = 'Puntaje: ' + this.puntuacionActual;
		// Incrementamos +1
		this.cantidadDiamanteCapturado += 1;
		// Si el incremento > es mayor a cantidadDiamantes terminamos el juego
		if (this.cantidadDiamanteCapturado >= cantidadDiamantes) {
			this.game.add.text(game.width / 3, game.height / 2, 'Fin del Juego')
			this.finJuego = true;
		}
	},

	devuelveLimitesRatonVolador: function () {
		var x0 = this.ratonVolador.x - this.ratonVolador.width / 2;
		var width = this.ratonVolador.width / 2;
		var y0 = this.ratonVolador.y - this.ratonVolador.height / 2;
		var height = this.ratonVolador.height;
		//Retornamos la posision del mouse y la medias del rectangulo del raton
		return new Phaser.Rectangle(x0, y0, width, height);
	},

	devuelveLimitesDiamante: function (diamante) {
		// Retornamos las medidas del rectangulo del diamante
		return new Phaser.Rectangle(diamante.left, diamante.top, diamante.width, diamante.height);
	},

	esRectanguloColisionado: function (rect1, rect2) {
		// Si existe colision entre restangulos retorna un false
		if (rect1.x > rect2.x + rect2.width || rect2.x > rect1.x + rect1.width) {
			return false;
		}
		if (rect1.y > rect2.y + rect2.height || rect2.y > rect1.y + rect1.height) {
			return false;
		}
		// Si no existe retorna true
		return true;
	},
}

// Instanciamos un juego en phaser con las dimensiones, se carga en un Canvas o en WebGL
var game = new Phaser.Game(900, 599, Phaser.CANVAS);
// Agregamos un estado juego y le asignamos el objeto administrarJuego
game.state.add("volador", administrarJuego);
// Una ves que agregamos el objeto le damos start, phaser llamara el metodo init, preload, create, update
game.state.start("volador");
