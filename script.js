window.onload = function () {

    const canvas = document.getElementById("game")
    const ctx = canvas.getContext("2d")

    const box = 20
    const gridSize = canvas.width / box // 🔥 automático (10x10)

    let snake
    let food
    let direction

    let coins = parseInt(localStorage.getItem("coins")) || 0
    document.getElementById("coins").innerText = coins

    document.addEventListener("keydown", mudarDirecao)

    function iniciarValores() {

        // 🔥 cobra começa no centro
        snake = [{ x: box * 5, y: box * 5 }]

        food = {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
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

        // fundo
        ctx.fillStyle = "#000"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // cobra
        ctx.fillStyle = "lime"
        snake.forEach(part => {
            ctx.fillRect(part.x, part.y, box, box)
        })

        // comida
        ctx.fillStyle = "red"
        ctx.fillRect(food.x, food.y, box, box)

        let headX = snake[0].x
        let headY = snake[0].y

        if (direction == "LEFT") headX -= box
        if (direction == "RIGHT") headX += box
        if (direction == "UP") headY -= box
        if (direction == "DOWN") headY += box

        // colisão
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

        // comer
        if (headX == food.x && headY == food.y) {

            food = {
                x: Math.floor(Math.random() * gridSize) * box,
                y: Math.floor(Math.random() * gridSize) * box
            }

            coins++
            localStorage.setItem("coins", coins)
            document.getElementById("coins").innerText = coins

            // leve aumento de velocidade
            if (speed > 30) speed -= 1

        } else {
            snake.pop()
        }

        snake.unshift({ x: headX, y: headY })
    }

    // loop otimizado
    let lastTime = 0
    let speed = 60
    let running = false

    function loop(time) {

        if (!running) return

        if (time - lastTime >= speed) {
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
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    // LOJA
    const skins = [
        { name: "Verde", cor: "lime", preco: 0 },
        { name: "Azul", cor: "blue", preco: 10 },
        { name: "Rosa", cor: "pink", preco: 30 }
    ]

    let carrinho = []
    let corAtual = "lime"

    const skinsDiv = document.getElementById("skins")

    skins.forEach((skin, i) => {
        let div = document.createElement("div")
        div.className = "skin"

        div.innerHTML = `
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

            corAtual = carrinho[carrinho.length - 1].cor

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
