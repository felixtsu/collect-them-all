//%icon="\u25c8" color="#6A6FEA"
//%block="Collect Gems"
//%block.loc.zh-CN="收集宝石"
namespace collect {

    export enum Difficulty {
        //% block="Easy"
        //% block.loc.zh-CN="简单"
        EASY, 
        //% block="Normal"
        //% block.loc.zh-CN="正常"
        NORMAL, 
        //% block="Hard"
        //% block.loc.zh-CN="困难"
        HARD
    }

    const player1 = new Character(0, img`
    . . . . . . f f f f . . . . . .
    . . . . f f f 2 2 f f f . . . .
    . . . f f f 2 2 2 2 f f f . . .
    . . f f f e e e e e e f f f . .
    . . f f e 2 2 2 2 2 2 e e f . .
    . . f e 2 f f f f f f 2 e f . .
    . . f f f f e e e e f f f f . .
    . f f e f b f 4 4 f b f e f f .
    . f e e 4 1 f d d f 1 4 e e f .
    . . f e e d d d d d d e e f . .
    . . . f e e 4 4 4 4 e e f . . .
    . . e 4 f 2 2 2 2 2 2 f 4 e . .
    . . 4 d f 2 2 2 2 2 2 f d 4 . .
    . . 4 4 f 4 4 5 5 4 4 f 4 4 . .
    . . . . . f f f f f f . . . . .
    . . . . . f f . . f f . . . . .
`, 0, 0,
        info.life, info.setLife, (p: number) => info.changeLifeBy(-p),
        info.setScore)
    const player2 = new Character(1, img`
    . . . . . . 5 . 5 . . . . . . .
    . . . . . f 5 5 5 f f . . . . .
    . . . . f 1 5 2 5 1 6 f . . . .
    . . . f 1 6 6 6 6 6 1 6 f . . .
    . . . f 6 6 f f f f 6 1 f . . .
    . . . f 6 f f d d f f 6 f . . .
    . . f 6 f d f d d f d f 6 f . .
    . . f 6 f d 3 d d 3 d f 6 f . .
    . . f 6 6 f d d d d f 6 6 f . .
    . f 6 6 f 3 f f f f 3 f 6 6 f .
    . . f f d 3 5 3 3 5 3 d f f . .
    . . f d d f 3 5 5 3 f d d f . .
    . . . f f 3 3 3 3 3 3 f f . . .
    . . . f 3 3 5 3 3 5 3 3 f . . .
    . . . f f f f f f f f f f . . .
    . . . . . f f . . f f . . . . .
`, 0, 9,
        () => { return info.player2.life() },
        (p: number) => { info.player2.setLife(p) },
        (p: number) => info.player2.changeLifeBy(-p),
        (s: number)=> {info.player2.setScore(s)})

    export const PLAYERS = [player1, player2]

    let difficulty = Difficulty.NORMAL

    //%block="start game"
    //%blockNamespace=collect
    //%group="Game"
    //%group.loc.zh-CN="游戏"
    //%blockId=collect_start_manual_game block="start %difficulty game"
    //%block.loc.zh-CN="开始 %difficulty 游戏"
    export function start_manual_game(difficulty:Difficulty) {

        init()
        _bindControllerEvents()
        _initSpriteOverlapEvents()
        _initHud() 
        
    }

    function _initHud() {

        scene.createRenderable(
            scene.HUD_Z,
            () => { 
                collect.draw(player1, true)
                collect.draw(player2, false)
            }
        )

    }

    let currentDirection = -1

    function _bindControllerEvents() {
        controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
            if (player1.canMove(0)) {
                currentDirection = 0
            }
        })
        controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
            if (player1.canMove(2)) {
                currentDirection = 2
            }
        })
        controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
            if (player1.canMove(1)) {
                currentDirection = 1
            }
        })
        controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
            if (player1.canMove(3)) {
                currentDirection = 3
            }
        })
    }

    function _initSpriteOverlapEvents() {
        function getGem(sprite: Sprite): Gem {
            let gemName = sprites.readDataString(sprite, "name")
            for (let gem of GEMS) {
                if (gem.name == gemName) {
                    return gem
                }
            }
            return null
        }

        function getCharacter(playerSprite: Sprite): Character {
            let _id = sprites.readDataNumber(playerSprite, "id")
            return PLAYERS[_id]
        }

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Box, (playerSprite, boxSprite) => {
            let character = getCharacter(playerSprite)
            character.getBox(BOX)

            BOX.changePosition()
        })

        sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, (playerSprite, foodSprite) => {

            let gem = getGem(foodSprite)
            let character = getCharacter(playerSprite)

            character.getGem(gem)

            gem.changePosition()
        })

    }

    
    function refresh() {

        let row = 0
        let col = 0
        for (let player of PLAYERS) {
            let loc = player.getLocation()
            row += loc.row
            col += loc.column
        }

        col /= 2
        row /= 2

        scene.centerCameraAt(col * 16 + 8, row * 16 + 8)

    }

    function randomAiMove() {

        if (player2.power() == 0) {
            return;
        }

        let candidates = []
        for (let direction of [0,1,2,3]) {
            if (player2.canMove(direction) ) {
                candidates.push(direction)
            }
        }

        if (candidates.length == 0) {
            return
        }

        player2.move(randint(0, candidates.length - 1))

    }

    function redGemAiMove() {

        if (player2.power() == 0) {
            return;
        }

        let playerLoc = player2.getLocation()
        let closest_path = null

        let closest_gem = ""

        for (let gem of GEMS) {
            if (gem.name != "red") {
                continue
            }

            let path = player2.findPath(gem)
            if (path == null) {
                continue
            }
            if (closest_path == null) {
                closest_path = path
                closest_gem = gem.name
            } else if (closest_path.length > path.length) {
                closest_path = path
                closest_gem = gem.name
            }

        }

        if (closest_path == null) {

            let direction = randint(0, 3)
            while (!(player2.canMove(direction))) {
                direction = randint(0, 3)
            }
            player2.move(direction)
            return;
        }

        let loc = closest_path[1]

        let rowDiff = loc.row - playerLoc.row
        let colDiff = loc.column - playerLoc.column

        if (Math.abs(rowDiff) + Math.abs(colDiff) == 2) {
            rowDiff = 0
        }

        let ans = -1
        for (let i = 0; i < DIRECTIONS.length; i++) {
            let direction = DIRECTIONS[i]
            if (direction[0] == rowDiff && direction[1] == colDiff) {
                ans = i
                break
            }
        }

        player2.move(ans)

    }
    

    function closestGemAiMove() {

        if ( player2.power() == 0) {
            return ;
        }

        let playerLoc = player2.getLocation()
        let closest_path = null

        let closest_gem = ""

        for (let gem of GEMS) {

            let path = player2.findPath(gem)
            if (path == null) {
                continue
            }
            if (closest_path == null) {
                closest_path = path
                closest_gem = gem.name
            } else if (closest_path.length > path.length) {
                closest_path = path
                closest_gem = gem.name
            }

        }

        if (closest_path == null) {

            let direction = randint(0, 3)
            while (!(player2.canMove(direction))) {
                direction = randint(0, 3)
            }
            player2.move(direction)
            return;
        }

        let loc = closest_path[1]

        let rowDiff = loc.row - playerLoc.row
        let colDiff = loc.column - playerLoc.column

        if (Math.abs(rowDiff) + Math.abs(colDiff) == 2) {
            rowDiff = 0
        }

        let ans = -1
        for (let i = 0; i < DIRECTIONS.length; i++) {
            let direction = DIRECTIONS[i]
            if (direction[0] == rowDiff && direction[1] == colDiff) {
                ans = i
                break
            }
        }

        player2.move(ans)

    }
    
    function playerMove() {
        if ( player1.power() == 0 ) {
            return 
        }


        currentDirection = -1

        while (currentDirection == -1) {
            pause(10)
        }

        player1.move(currentDirection)
    }

    function init() {
        tiles.setTilemap(tilemap`default`)
        // scene.centerCameraAt(80, 72)

        for (let gem of GEMS) {
            gem.init()
        }

        BOX.init()

        for (let player of PLAYERS) {
            player.init()
        }
        

        forever(function () {
            playerMove()
            refresh()
            switch ( difficulty) {
                case Difficulty.EASY: randomAiMove();break;
                case Difficulty.NORMAL: redGemAiMove();break;
                case Difficulty.HARD: closestGemAiMove;break;
                
            }
 
            
            refresh()

            if (player1.power() == 0 && player2.power() == 0) {
                if (player1.score > player2.score) {
                    game.setGameOverMessage(true, `You:${player1.score}, AI:${player2.score}` )
                    game.gameOver(true)
                } else {
                    game.setGameOverMessage(false, `You:${player1.score}, AI:${player2.score}`)
                    game.gameOver(false)
                }
            }
        })
    }
    

}