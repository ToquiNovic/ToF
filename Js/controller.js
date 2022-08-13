/* tres en raya */

let turno = 1;
let fichas = ["O", "X"];
let puestas = 0;
let partidaAcabada = false;
let textoVictoria = 
	document.getElementById("textoVictoria");
let botones = 
	Array.from(document.getElementsByTagName("button"));

botones.forEach(
	x => {
		x.disabled = true;
		x.addEventListener("click", ponerFicha)
	}
);

function ponerFicha(event){
	let botonPulsado = event.target;
	if(!partidaAcabada && botonPulsado.innerHTML == ""){
		botonPulsado.innerHTML = fichas[turno];
		puestas += 1;
		
		let estadoPartida = estado();
		
		if(estadoPartida == 0){
			cambiarTurno();
			if(puestas < 9){
				ia();
				estadoPartida = estado();
				puestas += 1;
				cambiarTurno();	
			}	
		}
		
		if(estadoPartida == 1){
			textoVictoria.style.visibility = "visible";
			partidaAcabada = true;
		}
		else if(estadoPartida == -1){
			textoVictoria.innerHTML = "Has perdido :("
			partidaAcabada = true;
			textoVictoria.style.visibility = "visible";
		}
	}	
}

function cambiarTurno(){
	if(turno==1){
		botones.forEach(
			x => {
				x.disabled = true;
			}
		);
		turno = 0;
	}
	else{
		turno = 1;
	}
	/*
		Otra forma de hacerlo:
		turno += 1;
		turno %= 2;
	*/
}

function estado(){
	posicionVictoria = 0;
	nEstado = 0;

	function sonIguales(...args){
		valores = args.map(x=>x.innerHTML);
		if(valores[0] != "" && valores.every((x, i, arr) => x===arr[0])){
			args.forEach(x => x.style.backgroundColor = "Chartreuse")
			return true;
		}
		else{
			/*
			if (posicionVictoria = 1) {
				args.forEach(x => x.style.backgroundColor = "red")
			}
			*/
			return false;
		}
	}

	//Comprobamos si hay alguna linea
	if(sonIguales(botones[0], botones[1], botones[2])){
		posicionVictoria = 1;
	}

	else if(sonIguales(botones[3], botones[4], botones[5])){
		posicionVictoria = 2;
	}

	else if(sonIguales(botones[6], botones[7], botones[8])){
		posicionVictoria = 3;
	}

	else if(sonIguales(botones[0], botones[3], botones[6])){
		posicionVictoria = 4;
	}

	else if(sonIguales(botones[1], botones[4], botones[7])){
		posicionVictoria = 5;
	}

	else if(sonIguales(botones[2], botones[5], botones[8])){
		posicionVictoria = 6;
	}

	else if(sonIguales(botones[0], botones[4], botones[8])){
		posicionVictoria = 7;
	}

	else if(sonIguales(botones[2], botones[4], botones[6])){
		posicionVictoria = 8;
	}

	//Comprobamos quien ha ganado
	if(posicionVictoria > 0){
		if(turno == 1){
			nEstado = 1;
		}
		else{
			nEstado = -1;
		}
	}

	return nEstado;
}

function ia(){
	function aleatorio(min, max) {
  		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	let valores = botones.map(x=>x.innerHTML);
	let pos = -1;

	if(valores[4]==""){
		pos = 4;
	}
	else{
		let n = aleatorio(0, botones.length-1);
		while(valores[n]!=""){
			n = aleatorio(0, botones.length-1); 
		}
		pos = n;
	}

	botones[pos].innerHTML = "O";
	return pos;
}

/* preguntas */

let base_preguntas = readText("/Js/base-preguntas.json")
		let interprete_bp = JSON.parse(base_preguntas)
		let pregunta
		let posibles_respuestas
		let btn_correspondiente = [
			select_id("btn1"),select_id("btn2"),
			select_id("btn3"),select_id("btn4")
		]

		escogerPreguntaAleatoria()

		function escogerPreguntaAleatoria() {
			escogerPregunta(Math.floor(Math.random()*interprete_bp.length))
		}
		
		function escogerPregunta(n){
			pregunta = interprete_bp[n]
			
            if (pregunta.categoria) {
                select_id("categoria").innerHTML = pregunta.categoria
            } else {
                select_id("categoria").innerHTML = ""
            }

			select_id("pregunta").innerHTML = pregunta.pregunta
			style("imagen").objectFit = pregunta.objectFit;
			desordenarRespuestas(pregunta)
			if (pregunta.imagen) {
				select_id("imagen").setAttribute("src",pregunta.imagen)
				style("imagen").height = "200px"
				style("imagen").width = "100%"
			}else{
				style("imagen").height = "0px"
				style("imagen").width = "0px"
			}
		}

		function desordenarRespuestas(pregunta){

			posibles_respuestas = [
				pregunta.respuesta,
				pregunta.incorrecta1,
				pregunta.incorrecta2,
				pregunta.incorrecta3
			]

			posibles_respuestas.sort(() => Math.random()-0.5)

			if(posibles_respuestas[0]){
				select_id("btn1").innerHTML = posibles_respuestas[0]
			}else {
				select_id("btn4").style.background = "transparent";
				select_id("btn4").innerText = ""
			}

			if(posibles_respuestas[1]){
				select_id("btn2").innerHTML = posibles_respuestas[1]
			}else {
				select_id("btn4").style.background = "transparent";
				select_id("btn4").innerText = ""
			}

			if(posibles_respuestas[2]){
				select_id("btn3").innerHTML = posibles_respuestas[2]
			}else {
				select_id("btn4").style.background = "transparent";
				select_id("btn4").innerText = ""
			}

			if(posibles_respuestas[3]){
				select_id("btn4").innerHTML = posibles_respuestas[3]
			}else {
				select_id("btn4").style.background = "transparent";
				select_id("btn4").innerText = ""
			}		
			
		}

		function oprimir_btn(i){
			if(posibles_respuestas[i] == pregunta.respuesta){
				botones.forEach(
					x => {
						x.disabled = false;
					}
				);
				Swal.fire({
					title: "Respuesta Correcta",
					text: "La respuesta ha sido correcta",
					icon: "success",
				});
			}else{
				Swal.fire({
					title: "Respuesta Incorrecta",
					text: `La respuesta correcta es ${pregunta.respuesta}`,
					icon: "error",
				});
			}
			setTimeout(() => {
				reiniciar()
			}, 1000);
		}


		function reiniciar(){
			for (const btn of btn_correspondiente){
				btn.style.background = "#054265"
			}

			escogerPreguntaAleatoria()
		}

		function select_id(id){
			return document.getElementById(id)
		}

		function style(id){
			return select_id(id).style
		}

		function readText(ruta_local){
			var texto = null;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("GET", ruta_local, false);
			xmlhttp.send();
			if (xmlhttp.status == 200){
				texto = xmlhttp.responseText;
			}
			return texto;
		}