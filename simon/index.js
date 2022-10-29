class Simon {
    #gameElement
    #resultElement
    #boxes = []
    #level = 1
    #steps = []
    #userSteps = []
    gameSpeed = 1
    colors = []
    isGameContinue = false

    constructor(element, colors) {
        const parentElement = document.getElementById(element)

        const resultElement = document.createElement('div')
        const gameElement = document.createElement('div')

        gameElement.style.width = '440px'
        gameElement.style.margin = '10px auto'

        parentElement.appendChild(resultElement)
        parentElement.appendChild(gameElement)

        this.#gameElement = gameElement
        this.#resultElement = resultElement

        this.colors = colors
    }

    #getRandomNumber() {
        return Math.floor(Math.random() * this.colors.length)
    }

    #incrementLevel() {
        this.#clearResultElement()
        const levelTextNode = document.createTextNode(`Level: ${this.#level}`)
        this.#resultElement.appendChild(levelTextNode)
    }

    #clearResultElement() {
        while(this.#resultElement.firstChild) {
            this.#resultElement.removeChild(this.#resultElement.lastChild)
        }
    }

    #restartButton() {
        const restartButton = document.createElement('button')
        restartButton.style.marginLeft = '10px'

        const restartText = document.createTextNode('Restart')
        restartButton.appendChild(restartText)

        restartButton.addEventListener('click', () => {
            this.isGameContinue = true
            this.#game()
        })

        return restartButton
    }

    #gameOver(){
        this.#clearResultElement()
        const gameOverText = document.createTextNode(`Game Over. Your level: ${this.#level}`)

        this.#resultElement.appendChild(gameOverText)
        this.#restartButton()

        const restartButton = this.#restartButton()
        this.#resultElement.appendChild(restartButton)

    }

    #anima(box) {
        box.disabled = true
        box.style.scale = '1.05'

        setTimeout(() => {
            box.disabled = false
            box.style.scale = '1'
        }, (this.gameSpeed * 1000) / 2);
    }

    #game() {
        const randomNumber = this.#getRandomNumber()
        this.#steps.push(randomNumber)
        this.#level = this.#steps.length
        this.#userSteps = []
        this.#incrementLevel()
        this.#boxes.forEach(box => {
            box.disabled = true
        })
                
        this.#steps.forEach((step, index) => {
            const box = this.#boxes[step]

            setTimeout(() => {
                this.#anima(box)

                setTimeout(() => {
                    this.#boxes.forEach(box => {
                        box.disabled = false
                    })
                }, (index + 1) * 1000)
            }, this.gameSpeed * (index + 1) * 1000)

        })
    }

    #check(){
        const lastUserStepsIndex = this.#userSteps.length - 1
        if(this.#steps[lastUserStepsIndex] !== this.#userSteps[lastUserStepsIndex]) {
            this.#steps = []
            this.#userSteps = []
            this.#gameOver()
            this.#level = 1
            this.isGameContinue = false

        }
        if(this.#steps.length === this.#userSteps.length) {
            setTimeout(() => {
                if(this.isGameContinue) this.#game()
            }, this.gameSpeed * 1000)
        }
    }

    start() {
        this.colors.forEach((color, index) => {
            const box = document.createElement('button')
            this.isGameContinue = true
            box.style.backgroundColor = color
            box.style.width = '200px'
            box.style.height = '200px'
            box.style.display = 'inline-block'
            box.style.margin = '10px'
            box.style.border = '0'
            box.style.transition = `${this.gameSpeed / 2}s`
        
            box.addEventListener('click', () => {
                this.#userSteps.push(index)
                this.#anima(box)
                this.#check()
            })
        
            this.#gameElement.appendChild(box)
            this.#boxes.push(box)
        })

        const levelTextNode = document.createTextNode(`Level: ${this.#level}`)
        this.#resultElement.appendChild(levelTextNode)

        setTimeout(() => {
            this.#game()
        }, 1000)
    }
}

const simon = new Simon('app', [ 'red', 'green', 'blue', 'yellow' ])

simon.gameSpeed = 0.8

simon.start()


