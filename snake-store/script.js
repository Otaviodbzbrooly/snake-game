const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const box = 20

let snake
let food
let direction
let game

let coins = localStorage.getItem("coins") || 0
coins = parseInt(coins)

document.getElementById("coins").innerText = coins

let skinImage = new Image()
skinImage.src = "imagens/skin1.png"

let foodImg = new Image()
foodImg.src = "imagens/food.png"

document.addEventListener("keydown", mudarDirecao)

function iniciarValores() {

    snake = [{ x: 200, y: 200 }]

    food = {

        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box

    }

    direction = "RIGHT"

}

function startGame() {

    iniciarValores()

    if (game) clearInterval(game)

    game = setInterval(jogo, 160)

}

function resetGame() {

    clearInterval(game)

    ctx.clearRect(0, 0, 400, 400)

}

function mudarDirecao(e) {

    if (e.key == "a" && direction != "RIGHT") direction = "LEFT"
    if (e.key == "d" && direction != "LEFT") direction = "RIGHT"
    if (e.key == "w" && direction != "DOWN") direction = "UP"
    if (e.key == "s" && direction != "UP") direction = "DOWN"

}

function colisao(head, snake) {

    for (let i = 0; i < snake.length; i++) {

        if (head.x == snake[i].x && head.y == snake[i].y) {

            return true

        }

    }

    return false

}

function jogo() {

    ctx.clearRect(0, 0, 400, 400)

    /* DESENHAR GRADES */

    for (let x = 0; x < canvas.width; x += box) {

        for (let y = 0; y < canvas.height; y += box) {

            ctx.strokeStyle = "#222"
            ctx.strokeRect(x, y, box, box)

        }

    }

    /* COBRA */

    for (let i = 0; i < snake.length; i++) {

        ctx.drawImage(skinImage, snake[i].x, snake[i].y, box, box)

    }

    /* COMIDA */

    ctx.drawImage(foodImg, food.x, food.y, box, box)

    let headX = snake[0].x
    let headY = snake[0].y

    if (direction == "LEFT") headX -= box
    if (direction == "RIGHT") headX += box
    if (direction == "UP") headY -= box
    if (direction == "DOWN") headY += box

    /* MORTE */

    if (

        headX < 0 ||
        headX >= canvas.width ||
        headY < 0 ||
        headY >= canvas.height ||
        colisao({ x: headX, y: headY }, snake)

    ) {

        clearInterval(game)

        alert("💀 GAME OVER")

        return

    }

    /* COMER */

    if (headX == food.x && headY == food.y) {

        food = {

            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box

        }

        coins++

        localStorage.setItem("coins", coins)

        document.getElementById("coins").innerText = coins

    } else {

        snake.pop()

    }

    let newHead = { x: headX, y: headY }

    snake.unshift(newHead)

}

/* LOJA */

const skins = [

    { name: "Skin Verde", img: "imagens/skin1.png", preco: 0 },
    { name: "Skin Azul", img: "imagens/skin2.png", preco: 10 },
    { name: "Skin Rosa", img: "imagens/skin3.png", preco: 30 }

]

let carrinho = []

const skinsDiv = document.getElementById("skins")

skins.forEach((skin, i) => {

    let div = document.createElement("div")

    div.className = "skin"

    div.innerHTML = `

<img src="${skin.img}" width="40">

<br>

${skin.name}

<br>

Preço: ${skin.preco}

<br>

<button onclick="addCarrinho(${i})">Adicionar</button>

`

    skinsDiv.appendChild(div)

})

function abrirLoja() {

    document.getElementById("loja").style.display = "block"

}

function fecharLoja() {

    document.getElementById("loja").style.display = "none"

}

function addCarrinho(i) {

    carrinho.push(skins[i])

    let li = document.createElement("li")

    li.innerText = skins[i].name

    document.getElementById("carrinho").appendChild(li)

}

function comprar() {

    let total = 0

    carrinho.forEach(item => {

        total += item.preco

    })

    if (coins >= total) {

        coins -= total

        localStorage.setItem("coins", coins)

        document.getElementById("coins").innerText = coins

        skinImage.src = carrinho[carrinho.length - 1].img

        alert("Skin equipada!")

    } else {

        alert("Moedas insuficientes!")

    }

}

function logout() {

    localStorage.removeItem("logado")

    window.location.href = "login.html"

}