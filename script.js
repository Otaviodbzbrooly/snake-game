window.onload = function () {

    const canvas = document.getElementById("game")
    const ctx = canvas.getContext("2d")

    const box = 20

    let snake
    let food
    let direction

    let coins = parseInt(localStorage.getItem("coins")) || 0
    document.getElementById("coins").innerText = coins

    let skinImage = new Image()
    skinImage.src = "imagens/skin1.png"

    let foodImg = new Image()
    foodImg.src = "imagens/food.png"

    document.addEventListener("keydown", mudarDirecao)

    // 🚀 GRID EM CACHE (PERFORMANCE ALTA)
    let gridCanvas = document.createElement("canvas")
    gridCanvas.width = 400
    gridCanvas.height = 400
    let gridCtx = gridCanvas.getContext("2d")

    for (let x = 0; x < 400; x += box) {
        for (let y = 0; y < 400; y += box) {
            gridCtx.strokeStyle = "#222"
            gridCtx.strokeRect(x, y, box, box)
        }
    }

    function iniciarValores() {
        snake = [{ x: 200, y: 200 }]

        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        }

        direction = "RIGHT"
    }

    function mudarDirecao(e) {
        if (e.key == "a" && direction != "RIGHT") direction = "LEFT"
        if (e.key == "d" && direction != "LEFT") direction = "RIGHT"
        if (e.key == "w" && direction != "DOWN") direction = "UP"
        if (e.key == "s" && direction != "UP") direction = "DOWN"
    }

    function colisao(head, snake) {
        return snake.some(s => s.x === head.x && s.y === head.y)
    }

    function jogo() {

        // 🚀 desenha grid pronto (leve)
        ctx.drawImage(gridCanvas, 0, 0)

        // COBRA
        snake.forEach(part => {
            ctx.drawImage(skinImage, part.x, part.y, box, box)
        })

        // COMIDA
        ctx.drawImage(foodImg, food.x, food.y, box, box)

        let headX = snake[0].x
        let headY = snake[0].y

        if (direction == "LEFT") headX -= box
        if (direction == "RIGHT") headX += box
        if (direction == "UP") headY -= box
        if (direction == "DOWN") headY += box

        // MORTE
        if (
            headX < 0 ||
            headX >= canvas.width ||
            headY < 0 ||
            headY >= canvas.height ||
            colisao({ x: headX, y: headY }, snake)
        ) {
            alert("💀 GAME OVER")
            running = false
            return
        }

        // COMER
        if (headX == food.x && headY == food.y) {

            food = {
                x: Math.floor(Math.random() * 20) * box,
                y: Math.floor(Math.random() * 20) * box
            }

            coins++
            localStorage.setItem("coins", coins)
            document.getElementById("coins").innerText = coins

            // 🔥 aceleração dinâmica
            if (speed > 20) speed -= 2

        } else {
            snake.pop()
        }

        snake.unshift({ x: headX, y: headY })
    }

    // 🚀 LOOP PROFISSIONAL
    let lastTime = 0
    let speed = 50
    let running = false

    function loop(time) {

        if (!running) return

        if (time - lastTime > speed) {
            jogo()
            lastTime = time
        }

        requestAnimationFrame(loop)
    }

    window.startGame = function () {
        iniciarValores()
        running = true
        requestAnimationFrame(loop)
    }

    window.resetGame = function () {
        running = false
        ctx.clearRect(0, 0, 400, 400)
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
            <img src="${skin.img}" width="40"><br>
            ${skin.name}<br>
            Preço: ${skin.preco}<br>
            <button onclick="addCarrinho(${i})">Adicionar</button>
        `

        skinsDiv.appendChild(div)
    })

    window.abrirLoja = () => document.getElementById("loja").style.display = "block"
    window.fecharLoja = () => document.getElementById("loja").style.display = "none"

    window.addCarrinho = function (i) {
        carrinho.push(skins[i])

        let li = document.createElement("li")
        li.innerText = skins[i].name
        document.getElementById("carrinho").appendChild(li)
    }

    window.comprar = function () {
        let total = carrinho.reduce((sum, item) => sum + item.preco, 0)

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

    window.logout = function () {
        localStorage.removeItem("logado")
        window.location.href = "login.html"
    }

}
