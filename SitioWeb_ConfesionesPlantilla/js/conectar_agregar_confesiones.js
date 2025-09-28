const input_titulo = document.querySelector("input");
const input_contenido = document.querySelector("textarea");

function PublicarConfesion(){

const objeto_confesion = {
    "titulo": input_titulo.value,
    "contenido":input_contenido.value
}



    fetch("http://localhost:3000",{
        method: "POST",
        body: JSON.stringify(objeto_confesion)
    }).then(recurso => recurso.json()).then(respuesta=> {
        alert(respuesta.mensaje);
        if(respuesta.ok)
        {
            window.location.href = "index.html";
        }
    });
}