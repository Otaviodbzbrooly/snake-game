window.onload = function () {

    const canvas = document.getElementById("game")
    const ctx = canvas.getContext("2d")

    const box = 20
    const gridSize = 10

    let snake = []
    let food = {}
    let direction = "RIGHT"
    let game = null

    let coins = parseInt(localStorage.getItem("coins")) || 0
    document.getElementById("coins").innerText = coins

    document.addEventListener("keydown", mudarDirecao)

    function iniciarValores() {
        snake = [{ x: 5 * box, y: 5 * box }]
        food = gerarComida()
        direction = "RIGHT"
    }

    function gerarComida() {
        return {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        }
    }

    function mudarDirecao(e) {
        if (e.key === "a" && direction !== "RIGHT") direction = "LEFT"
        if (e.key === "d" && direction !== "LEFT") direction = "RIGHT"
        if (e.key === "w" && direction !== "DOWN") direction = "UP"
        if (e.key === "s" && direction !== "UP") direction = "DOWN"
    }

    function colisao(head) {
        for (let i = 0; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true
            }
        }
        return false
    }

    function jogo() {

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.fillStyle = "lime"
        for (let i = 0; i < snake.length; i++) {
            ctx.fillRect(snake[i].x, snake[i].y, box, box)
        }

        ctx.fillStyle = "red"
        ctx.fillRect(food.x, food.y, box, box)

        let headX = snake[0].x
        let headY = snake[0].y

        if (direction === "LEFT") headX -= box
        if (direction === "RIGHT") headX += box
        if (direction === "UP") headY -= box
        if (direction === "DOWN") headY += box

        if (
            headX < 0 ||
            headY < 0 ||
            headX >= gridSize * box ||
            headY >= gridSize * box ||
            colisao({ x: headX, y: headY })
        ) {
            clearInterval(game)
            alert("💀 GAME OVER")
            return
        }

        if (headX === food.x && headY === food.y) {
            food = gerarComida()

            coins++
            localStorage.setItem("coins", coins)
            document.getElementById("coins").innerText = coins

        } else {
            snake.pop()
        }

        snake.unshift({ x: headX, y: headY })
    }

    window.startGame = function () {
        iniciarValores()
        clearInterval(game)
        game = setInterval(jogo, 80)
    }

    window.resetGame = function () {
        clearInterval(game)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    window.abrirLoja = () => document.getElementById("loja").style.display = "block"
    window.fecharLoja = () => document.getElementById("loja").style.display = "none"

    window.logout = function () {
        localStorage.removeItem("logado")
        window.location.href = "login.html"
    }

}
