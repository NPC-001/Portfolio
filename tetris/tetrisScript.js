document.addEventListener("DOMContentLoaded", ()=>{
    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    let scoreDisplay = document.querySelector("#scorePuntuacion")
    const startBtn = document.querySelector("#startButton")
    let nextPiece = Array.from(document.querySelectorAll("#nextPiece div"))
    const width = 10
    let  score = 0
    const buttonUp = document.querySelector("#gup")
    const buttonRight = document.querySelector("#gri")
    const buttonLeft = document.querySelector("#gle")
    const buttonDown = document.querySelector("#gdw")

    // coordenadas de los cubos
    const cuboL = [
        [1, width +1, width*2 +1, 2],
        [width, width + 1, width+2, width*2 + 2],
        [1, width + 1, width*2, width*2+1],
        [width, width*2, width*2 + 1, width*2+2]
    ]
    const cuboL2 = [
        [0, width +1, width*2 +1, 1],
        [width + 2, width*2, width*2 + 1, width*2+2],
        [1, width + 1, width*2 + 1, width*2+2],
        [width, width + 1, width+2, width *2]
    ]
    const cuboZ = [
        [1,2, width, width + 1],
        [0, width, width +1, width*2 + 1],
        [width +1, width + 2, width *2, width *2 +1],
        [0, width, width +1, width*2 + 1]
    ]
    const cuboZ2 = [
        [0, 1, width + 2, width + 1],
        [1, width, width +1, width*2],
        [0, 1, width + 2, width + 1],
        [1, width, width +1, width*2]
    ]
    const cuboT = [
        [1, width, width + 1, width + 2],
        [1, width +1 , width +2, width *2 + 1],
        [width, width +1, width + 2, width *2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]
    const cuboC = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]
    const cuboI = [
        [0, width, width * 2, width * 3],
        [width, width + 1, width + 2, width + 3],
        [0, width, width * 2, width * 3],
        [width, width + 1, width + 2, width + 3]
    ]

    const cuboAll = [cuboC, cuboZ, cuboI, cuboL, cuboT, cuboZ2, cuboL2]
    let random = function(){return ran = Math.floor(Math.random() * cuboAll.length)}
    let randos = function(){return ran2 = Math.floor(Math.random() * cuboAll.length)}
    let ran
    let ran2
    let rotation = 0
    let currentPosition = 4
    let currentCubo = cuboAll[random()][rotation]
    let nextCubo = cuboAll[randos()][rotation]
    let timerId
    
    // boton start
    function start(){
        if(timerId){
            clearInterval(timerId)
            timerId = null
            startBtn.textContent = "start"
        }else{
            timerId = setInterval(goDown, 1000)
            startBtn.textContent = "stop"
        }
    }
    startBtn.addEventListener("click", start)
    // Dibujo de el current cubo
    function draw(cuboActual){
        cuboActual.forEach(element => {
            squares[currentPosition + element].classList.add("cubo")     
        })
        nextCubo.forEach(index =>{
            nextPiece[index + width + 1].classList.add("cubo")
        })
    }
    // lo borro
    function undraw(cuboActual){
        cuboActual.forEach(element => {
            squares[currentPosition + element].style.backgroundColor = ""
            squares[currentPosition + element].classList.remove("cubo");
        });
    }
 
    // timer y move down
    function goDown(){
        undraw(currentCubo)
        currentPosition += width;
        draw(currentCubo)
        freeze()
    }
    
    // detener
    function freeze(){
        if(currentCubo.some(index => squares[index + width + currentPosition].classList.contains("taken"))){
            currentCubo.forEach((index)=>squares[index + currentPosition].classList.add("taken"));
            currentCubo = cuboAll[ran2][rotation]
            ran = ran2
            nextCubo.forEach(index=>{nextPiece[index + width + 1].classList.remove("cubo")})
            nextCubo = cuboAll[randos()][rotation]
            currentPosition = 4;
            draw(currentCubo);
            addScore()
            gameOver()
            
        }
    }
    // controles
    function left(){
        undraw(currentCubo)
        const paredI = currentCubo.some(index => (currentPosition + index)%width===0)
        if(!paredI){currentPosition--}
        if(currentCubo.some(index=>squares[currentPosition+index].classList.contains("taken"))){
            currentPosition++
        }
        draw(currentCubo)
    }
    function rigth(){
        undraw(currentCubo)
        const paredD = currentCubo.some(index => (currentPosition + index - 9)%width===0)
        if(!paredD){currentPosition++}
        if(currentCubo.some(index=>squares[currentPosition+index].classList.contains("taken"))){
            currentPosition--
        }
        draw(currentCubo)
    }
    function rotate(){
        const paredI = currentCubo.some(index => (currentPosition + index)%width===0)
        const paredD = currentCubo.some(index => (currentPosition + index - 9)%width===0)
        if(!paredD && !paredI){    
            undraw(currentCubo)
            rotation++
            if(rotation >= 4){
                rotation = 0
            }
            currentCubo = cuboAll[ran][rotation]
        }   
        draw(currentCubo)
    }
    // muv
    function control(e){
        if(e.keyCode === 37){
            left()
        }else if(e.keyCode === 39){
            rigth()
        }else if(e.keyCode === 38){
            rotate()
        }else if(e.keyCode === 40){
            goDown()
        }
    }
    document.addEventListener("keydown", control)
    buttonDown.addEventListener("click", goDown)
    buttonLeft.addEventListener("click", left)
    buttonRight.addEventListener("click", rigth)
    buttonUp.addEventListener("click", rotate)
    // score
    function addScore(){
        for(let i = 0; i<199; i+=width){
            const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
            if(row.every(item=> squares[item].classList.contains("taken") && !squares[item].classList.contains("end"))){
                score += 10
                scoreDisplay.textContent = score
                row.forEach(item=>{
                    squares[item].classList.remove("taken")
                    squares[item].classList.remove("cubo")
                })
                let removed = squares.splice(i, width)
                squares = removed.concat(squares)
                squares.forEach(item=>grid.appendChild(item))
            }
        }
    }
    // game over
    function gameOver(){
        if(currentCubo.some(item=> squares[currentPosition + item].classList.contains("taken"))){
            console.log("over")
            clearInterval(timerId)
            alert("Your final score: " + score + "pts")
            for(let i= 0; i<199; i++){
                squares[i].classList.remove("taken")
            }
            squares.forEach(item=>item.classList.remove("cubo"))
            score = 0
            start()
            scoreDisplay.textContent= score
        }

        }
    
})
