const ContenedorConfesiones = document.querySelector("#ContenedorConfesiones");

const plantilla_confesion = document.querySelector(".Confesion");

fetch("http://localhost:3000").then(recurso => recurso.json()).then(respuesta=>{
    for(i=0;i<respuesta.confesiones.length; i++){
        var clon =plantilla_confesion.cloneNode(true);
        ContenedorConfesiones.appendChild(clon);

    }
    plantilla_confesion.remove();

    var arregloTarjetaConfesiones = document.querySelectorAll(".Confesion");

   // console.log(arregloTarjetaConfesiones);

    for(i=0; i < arregloTarjetaConfesiones.length; i++ )
    {
        const numero_confesion = arregloTarjetaConfesiones[i].querySelector(".numero_confesion");

        numero_confesion.innerHTML="#" + respuesta.confesiones[i].numero;

        const Titulo_confesion = arregloTarjetaConfesiones[i].querySelector(".Titulo_confesion");

        Titulo_confesion.innerHTML=respuesta.confesiones[i].titulo;

        const Confesion_texto = arregloTarjetaConfesiones[i].querySelector(".Confesion_texto");

        Confesion_texto.innerHTML= respuesta.confesiones[i].contenido;

        const Emoticonos = arregloTarjetaConfesiones[i].querySelectorAll(".contador_emoticon")
        
        for(j=0; j<Emoticonos.length;j++)
        {
            Emoticonos[j].innerHTML = respuesta.confesiones[i].emoticonos.cantidad[j];
            
            Emoticonos[j].numero_confesion = respuesta.confesiones[i].numero;
            Emoticonos[j].numero_reaccion = j;
            
            Emoticonos[j].addEventListener("click", function(evento){
                alert(evento.currentTarget.numero_confesion);
                alert(evento.currentTarget.numero_reaccion);

                const informacion_emoticon =
                {
                    "numero_confesion":  evento.currentTarget.numero_confesion,
                    "numero_reaccion":  evento.currentTarget.numero_reaccion
                }
                fetch("http://localhost:3000/reaccion", {
                    "method":"PUT",
                    "body": JSON.stringify(informacion_emoticon)
                }).then(recurso=>recurso.json()).then(respuesta=>{

                    Emoticonos[respuesta.numero_reaccion].innerHTML = respuesta.cantidad;
                });
            });
        }
        //console.log(respuesta.confesiones[i].comentarios.length);

        const titulo_comentarios = arregloTarjetaConfesiones[i].querySelector(".titulo_comentarios");
        titulo_comentarios.innerHTML = respuesta.confesiones[i].comentarios.length + "Comentarios";

        const seccion_comentarios = arregloTarjetaConfesiones[i].querySelector(".seccion_comentarios");

        const plantilla_comentario = arregloTarjetaConfesiones[i].querySelector(".Comentario");

        for(j=0; j< respuesta.confesiones[i].comentarios.length; j++)
        {
            var clon_comentario = plantilla_comentario.cloneNode(true);

            const comentador = clon_comentario.querySelector(".comentador");

            comentador.innerHTML = "comentario" + (j + 1);

            seccion_comentarios.appendChild(clon_comentario);

            const comentario_texto = clon_comentario.querySelector(".comentario_texto");

            comentario_texto.innerHTML = respuesta.confesiones[i].comentarios[j];
        }
        plantilla_comentario.remove();

        //Seccion comentar

        const boton_comentar = arregloTarjetaConfesiones[i].querySelector(".boton_comentar");
        const mi_comentario = arregloTarjetaConfesiones[i].querySelector(".mi_comentario");

        const input_mi_comentario = arregloTarjetaConfesiones[i].querySelector(".mi_comentario input");
        //console.log(input_mi_comentario);

        const boton_enviar_comentario = arregloTarjetaConfesiones[i].querySelector(".mi_comentario button");

        boton_enviar_comentario.variable = respuesta.confesiones[i].numero;

        boton_enviar_comentario.addEventListener("click", function(evento){


            //console.log(evento.currentTarget.variable);
            
        const objeto_comentario={
            "numero": evento.currentTarget.variable,
            "comentario": input_mi_comentario.value
        }
//console.log(respuesta.confesiones[i]);

            fetch("http://localhost:3000/comentario",{
                method: "POST",
                body: JSON.stringify(objeto_comentario)
            }).then(recurso => recurso.json()).then(respuesta =>{
                console.log(plantilla_comentario);
                var clon = plantilla_comentario.cloneNode(true);

                seccion_comentarios.appendChild(clon);

                const comentario_texto = clon.querySelector(".comentario_texto");
                comentario_texto.innerHTML = respuesta.comentario;

                const comentador = clon.querySelector(".comentador");
                comentador.innerHTML = "comentario" + respuesta.numero_comentario;

                titulo_comentarios.innerHTML = respuesta.numero_comentario + " Comentarios";
                input_mi_comentario.value="";
                mi_comentario.style.display = "none";

            });
        });

        boton_comentar.addEventListener("click", () =>{
            mi_comentario.style.display = "block";
        });
    }
})