window.onload = function () {

    const canvas = document.getElementById("game")
    const ctx = canvas.getContext("2d")

    const box = 20
    const gridSize = 10

    let snake = []
    let food = {}
    let direction = "RIGHT"
    let nextDirection = "RIGHT"

    let running = false
    let lastUpdate = 0
    const updateRate = 120 // 🔥 controla velocidade (ms)

    let coins = parseInt(localStorage.getItem("coins")) || 0
    document.getElementById("coins").innerText = coins

    document.addEventListener("keydown", mudarDirecao)

    function iniciarValores() {
        snake = [{ x: 5 * box, y: 5 * box }]
        food = gerarComida()
        direction = "RIGHT"
        nextDirection = "RIGHT"
    }

    function gerarComida() {
        return {
            x: Math.floor(Math.random() * gridSize) * box,
            y: Math.floor(Math.random() * gridSize) * box
        }
    }

    function mudarDirecao(e) {

        if (e.key === "a" && direction !== "RIGHT") nextDirection = "LEFT"
        if (e.key === "d" && direction !== "LEFT") nextDirection = "RIGHT"
        if (e.key === "w" && direction !== "DOWN") nextDirection = "UP"
        if (e.key === "s" && direction !== "UP") nextDirection = "DOWN"
    }

    function colisao(head) {
        return snake.some(s => s.x === head.x && s.y === head.y)
    }

    function jogo() {

        // aplica direção segura
        direction = nextDirection

        // limpa tela
        ctx.fillStyle = "black"
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

        if (direction === "LEFT") headX -= box
        if (direction === "RIGHT") headX += box
        if (direction === "UP") headY -= box
        if (direction === "DOWN") headY += box

        // colisões
        if (
            headX < 0 ||
            headY < 0 ||
            headX >= gridSize * box ||
            headY >= gridSize * box ||
            colisao({ x: headX, y: headY })
        ) {
            running = false
            alert("💀 GAME OVER")
            return
        }

        // comer
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

    function loop(time) {

        if (!running) return

        if (time - lastUpdate >= updateRate) {
            jogo()
            lastUpdate = time
        }

        requestAnimationFrame(loop)
    }

    window.startGame = function () {
        iniciarValores()
        running = true
        lastUpdate = 0
        requestAnimationFrame(loop)
    }

    window.resetGame = function () {
        running = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    window.logout = function () {
        localStorage.removeItem("logado")
        window.location.href = "login.html"
    }

}
