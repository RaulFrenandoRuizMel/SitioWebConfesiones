const http = require("node:http");
const fs = require("node:fs");
const { info } = require("node:console");

var archivo_json;

fs.readFile("./confesiones.json",(error, file)=>{
    archivo_json = JSON.parse(file.toString());
})

const puerto = 3000;

const server = http.createServer((request, response)=>{
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");

        switch(request.method){
            case "GET":
                response.statusCode = 200;
                response.setHeader("Content-Type", "application/json");
                response.end(JSON.stringify(archivo_json));
            break;
            case "POST":
                request.on("data", info=>{
                    
                    const objeto_info = JSON.parse(info.toString());

                    if(request == "/confesiones")
                    {
                    if(objeto_info == ""||objeto_info.contenido == ""){
                        response.statusCode = 400;
                            response.setHeader("Content-Type", "application/json");

                            var objeto_resultado = {
                                "mensaje": "Llena los campos, joputa",
                                "ok": false
                            }
                            response.end(JSON.stringify(objeto_resultado));
                            return 0;
                    }
                    var nueva_confesion ={
                        "numero":archivo_json.confesiones.length + 1,
                        "titulo": objeto_info.titulo,
                        "contenido": objeto_info.contenido,
                        "emoticonos":{
                            "cantidad":[
                                0,0,0,0,0,0,0
                            ]
                        },
                        "comentarios": []
                    }

                    archivo_json.confesiones.push(nueva_confesion);

                    fs.writeFile("./confesiones.json", JSON.stringify(archivo_json), (err)=> {
                        if(!err)
                        {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");

                            var objeto_resultado = {
                                "mensaje": "Confesion Agregada",
                                "ok": true
                            }
                            response.end(JSON.stringify(objeto_resultado));
                        }
                    });
                }
                else if(request.url == "/comentario")
                {
                    console.log(objeto_info);

                    var numero_comentario;
                    
                    for(i =0; i < archivo_json.confesiones.length; i++)
                    {
                        if(archivo_json.confesiones[i].numero == objeto_info.numero)
                        {
                            archivo_json.confesiones[i].comentarios.push(objeto_info.comentario);
                            numero_comentario = archivo_json.confesiones[i].comentarios.length;
                            break;
                        }
                    }

                    
                    fs.writeFile("./confesiones.json", JSON.stringify(archivo_json), (err)=> {
                        if(!err)
                        {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");

                            var objeto_resultado = {
                                "comentario":objeto_info.comentario,
                                "numero_comentario": numero_comentario,
                                "ok": true
                            }
                            response.end(JSON.stringify(objeto_resultado));
                        }
                    });
                    console.log(archivo_json.confesiones);
                }
                });
            break;
            case "PUT":
                request.on("data", info=>{
                    console.log(info.toString());
                    const objeto_reaccion = JSON.parse(info.toString());

                    var cantidad;

                    for(i=0; i<archivo_json.confesiones.length;i++)
                    {
                        if(archivo_json.confesiones[i].numero==objeto_reaccion.numero_confesion)
                        {
                            console.log("aver");
                            archivo_json.confesiones[i].emoticonos.cantidad[objeto_reaccion.numero_reaccion]++;

                            cantidad = archivo_json.confesiones[i].emoticonos.cantidad[objeto_reaccion.numero_reaccion];

                            console.log(archivo_json.confesiones[i].emoticonos.cantidad[objeto_reaccion.numero_reaccion]);
                            break;
                        }
                    }
                    fs.writeFile("./confesiones.json", JSON.stringify(archivo_json), (err)=> {
                        if(!err)
                        {
                            response.statusCode = 200;
                            response.setHeader("Content-Type", "application/json");

                            var objeto_resultado = {
                                "numero_confesion":objeto_reaccion.numero_confesion,
                                "numero_reaccion": objeto_reaccion.numero_reaccion,
                                "cantidad": cantidad,
                                "ok": true
                            }
                            response.end(JSON.stringify(objeto_resultado));
                        }
                    });
                });
                break;
            case "OPTIONS":
                    response.writeHead("204");
                    response.end();
            break;
        }
});

server.listen(puerto, ()=>{
    console.log("Servidor a la escucha en http://localhost:3000");
})
