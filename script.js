//Tomamos el canvas para poder crear el juego dentro
const canvas = document.getElementById("canvas");

//Creamos el contexto donde pintaremos el juego dentro del canvas
const ctx = canvas.getContext("2d");

const menu = document.querySelector(".menu");
const boton = document.querySelector(".boton");
const puntos = document.querySelector(".puntuacion");
let animacion;
let puntaje = 0;

//Ancho de la pantalla
canvas.width = 900;

//Alto de la pantalla
canvas.height = 500;



//Creamos la clase explosion
class Explosion{
    
    constructor(side,position,color,velocity){
        this.side = side;
        this.position = position;
        this.color = color;
        this.velocity = velocity;
    }

    update(){
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.side -= 0.8;
    }

    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,
            this.side,this.side);
        ctx.closePath();
    }

}


//creamos la clase enemigo
class Enemigos{

    //Creamos el constructor para poder crear enemigos
    constructor(position,size,color,velocity){
        this.position = position;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.frame = 0;
        this.frameMax = Math.floor(Math.random()*41)+40;
          
    }

    //Metodo para que los enemigos disparen
    disparoEnemigo(proyectiles){
        if(this.frame > this.frameMax){
            let proyectil = new Proyectil(
                {
                    x:(this.position.x + this.size.width/2)-5,
                    y:this.position.y
                },
                {
                    width:10,
                    height:20
                },
                this.color,
                8
            )
            proyectiles.push(proyectil);
            this.frame = 0;
        }
    }

    //Se mueve a los enemigos y rebotan si llegan a los extremos
    update(){
        this.draw();
        this.position.x += this.velocity;
        
        if(this.position.x + this.size.width > canvas.width){
            this.position.x = canvas.width - this.size.width;
            this.velocity *= -1;
        }
        if(this.position.x < 0){
            this.position.x = 0;
            this.velocity *= -1;
        }
        //Esto es el contador para que disparen
        this.frame++;
    }


    //Se dibujan los enemigos en pantalla
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,
            this.size.width,this.size.height);
        ctx.closePath();
    }

  

}

//Creamos la clase proyectil
class Proyectil{
    
    //Creamos el constructor para poder iniciar las partes del juego
    constructor(position,size,color,velocity){
        this.position = position;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
          
    }

    //Creamos el metodo para actualizar la posicion
    update(){
        //Se dibuja el proyectil
        this.draw();
        //Se mueve
        this.position.y += this.velocity;

    }

    //Metodo para verificar si el proyectil impacto o cumplio el recorrido
    colision(Objeto){
        //Esta parte es para verificar si llego al techo o al piso
        if(this.position.y <= 0 || this.position.y >= canvas.height){
            return 1;
        }
        //Esta parte es para verificar si el proyectil impacto con un enemigo
        if(this.position.x < Objeto.position.x + Objeto.size.width &&
            this.position.x + this.size.width > Objeto.position.x &&
            this.position.y < Objeto.position.y + Objeto.size.height &&
            this.position.y + this.size.height > Objeto.position.y
            ){
                return 2;
        }
        
    }

    //Dibujamos el proyectil en pantalla
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,
            this.size.width,this.size.height);
        ctx.closePath();
    }

}


//Creamos la clase jugador 
class Player{
    //Creamos el constructor para poder iniciar las partes del juego
    constructor(position,size,color,velocity){
        this.position = position;
        this.size = size;
        this.color = color;
        this.velocity = velocity;
        this.keys = {
            left:false,
            right:false,
            bala: true
        }
        this.proyectiles = [];

        this.keyboard();
    }

    //Dibujamos la pieza del jugador
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x,this.position.y,
            this.size.width,this.size.height);
        ctx.closePath();
    }

    //Movimiento del jugador
    update(){
        this.draw();
        if(this.keys.right){
            this.position.x += this.velocity;
            //Este if es para poner el limite a la derecha de la pantalla
            if(this.position.x + this.size.width > canvas.width){
                this.position.x = canvas.width - this.size.width;
            }
        }
        if(this.keys.left){
            this.position.x -= this.velocity;
            //Este if es para poner el limite a la izquierda de la pantalla
            if(this.position.x < 0){
                this.position.x = 0;
            }
        }
    }

    //Pulsacion de teclas
    keyboard(){
        //Realiza acciones cuando se presionan las teclas
        document.addEventListener("keydown",(tecla)=>{
            if(tecla.key=="a"||tecla.key=="A"||tecla.key=="ArrowLeft"){
                this.keys.left = true;
            }
            if(tecla.key=="d"||tecla.key=="D"||tecla.key=="ArrowRight"){
                this.keys.right = true;
            }
            if((tecla.key == "w" && this.keys.bala) || (tecla.key == "W" && this.keys.bala) || (tecla.key == "ArrowUp" && this.keys.bala)){
               let proyectil = new Proyectil(
                {x:(this.position.x + this.size.width/2)-5, y:this.position.y},
                {width:10,height:20},
                this.color,
                -8);  
                this.proyectiles.push(proyectil);
                this.keys.bala = false;
            }
        })

        //Realiza acciones cuando se dejan de presionar las teclas
        document.addEventListener("keyup",(tecla)=>{
            if(tecla.key=="a"||tecla.key=="A"||tecla.key=="ArrowLeft"){
                this.keys.left = false;
            }
            if(tecla.key=="d"||tecla.key=="D"||tecla.key=="ArrowRight"){
                this.keys.right = false;
            }
            if(tecla.key == "w" || tecla.key == "W" || tecla.key == "ArrowUp"){
                this.keys.bala = true;
            }
        })    
        
    }
}

//Objeto jugador (El protagonista)
const player = new Player({x:200,y:480},{width:60,height:20},"white",7);
//Objeto para crear a los enemigos
const enemigos = [];
//Objeto para crear las explosiones
const explosiones = [];
//Objeto para crear disparos del enemigo
const disparoDelEnemigo = [];


//Funcion para crear los enemigos
function creadorDeEnemigos(color){

    //Se crean en posiciones aleatorias
    let enemigo = new Enemigos(
        {
            x:Math.floor(Math.random() * (canvas.width - 61)),
            y:Math.floor(Math.random() * (201))
        },
        {width:60, height:20},
        color,
        2
    )
    //Los agregamos al array de enemigos
    enemigos.push(enemigo);
}

//Funcion para darles color y cargarlos en el canvas
function iniciarEnemigos(){
    let colores = ["#2B807B", "#6E59F1","#54DE24","#F67549","#EB23DC","#A1620E"];
    for(let i = 0; i < colores.length; i++){
        creadorDeEnemigos(colores[i])
    }
}


function crearExplosiones(objeto){
    //El for es para crear 10 particulas
    for(let k = 0; k<10; k++){
        //Esta parte es para generar la explosion
        let explosion = new Explosion(
        Math.floor(Math.random()+16)+15,
        {
            x:objeto.position.x + objeto.size.width/2,
            y:objeto.position.y + objeto.size.height/2
        },
        objeto.color,
        {
            x: Math.random()*6 - 0.8,
            y: Math.random()*6 - 0.8
        }
        );
         //Esta parte es para que exploten desde el centro
        explosion.position.x -= explosion.side/2;
        explosion.position.y -= explosion.side/2;
        
        explosiones.push(explosion);


    }
}


//Cuando matan al player se esconde la pantalla de juego
function gameOver(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    enemigos.length = 0;
    explosiones.length = 0;
    player.length = 0;
    puntaje = 0;
    menu.style.display = "flex";
}

//Cuando se aprieta jugar inicia nuevamente el juego
boton.addEventListener("click", ()=>{
    
    menu.style.display = "none";
    player.position = {x:200,y:480};
    iniciarEnemigos();
    update();
})

//Funcion para actualizar la posicion de los objetos en pantalla
function actualizarObjetos(){
    
    for(let i=0; i<player.proyectiles.length; i++){

        player.proyectiles[i].update();
        
        //Si el proyectil pega al techo se borra
        for(let j = 0; j < enemigos.length; j++){
            if(player.proyectiles[i].colision(enemigos[j])==1){
                player.proyectiles.splice(i,1);
                break;
            }
            //Si el proyectil pega al enemigo se borran los dos
            if(player.proyectiles[i].colision(enemigos[j])==2){
                
                //Hacemos explotar al enemigo
                crearExplosiones(enemigos[j]);

                //Esta parte crea un enemigo luego de morir
                let colorEnemigo = enemigos[j].color;
                setTimeout(()=>{
                    creadorDeEnemigos(colorEnemigo);
                },1000);
                
                //Esta parte elimina el rpyectil y el enemigo
                player.proyectiles.splice(i,1);
                enemigos.splice(j,1);
                puntaje ++;
                puntos.innerHTML = puntaje;
                break;
            }
        }
    }

    //Este metodo crea los enemigos en la pantallay los hace disparar
    enemigos.forEach((e)=>{
        e.update();
        e.disparoEnemigo(disparoDelEnemigo);
    })

    //Este metodo crea las particulas y las elimina
    explosiones.forEach((e,i)=>{
        e.update();
        if(e.side<=0){
            explosiones.splice(i,1);
        }
    })
    
    //Actualizacion de los proyectiles
    for(let i = 0; i < disparoDelEnemigo.length; i++){
        disparoDelEnemigo[i].update();
        //Si el disparo llega al piso
        if(disparoDelEnemigo[i].colision(player)==1){
            disparoDelEnemigo.splice(i,1);
        }
        //Si el disparo da en el jugador
        else if(disparoDelEnemigo[i].colision(player)==2){
            disparoDelEnemigo.splice(i,1);
            
            //Explotamos al jugador
            crearExplosiones(player);
            //Lo sacamos de la pantalla
            player.position.x = -50;
            player.position.y = -50;
            
            setTimeout(()=>{
                cancelAnimationFrame(animacion);
                gameOver();
            },1500);

        }
    }
}

//Funcion recursiva para mantener las animaciones (Main)
function update(){
    animacion = requestAnimationFrame(update);
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    actualizarObjetos();
    
}

update();
iniciarEnemigos();