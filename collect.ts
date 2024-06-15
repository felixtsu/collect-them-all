namespace collect {


    

    const GEMS = [
        new Gem("red", img`
        . . . . . . . e c 7 . . . . . .
        . . . . e e e c 7 7 e e . . . .
        . . c e e e e c 7 e 2 2 e e . .
        . c e e e e e c 6 e e 2 2 2 e .
        . c e e e 2 e c c 2 4 5 4 2 e .
        c e e e 2 2 2 2 2 2 4 5 5 2 2 e
        c e e 2 2 2 2 2 2 2 2 4 4 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 2 2 e
        c e e 2 2 2 2 2 2 2 2 2 2 4 2 e
        . e e e 2 2 2 2 2 2 2 2 2 4 e .
        . 2 e e 2 2 2 2 2 2 2 2 4 2 e .
        . . 2 e e 2 2 2 2 2 4 4 2 e . .
        . . . 2 2 e e 4 4 4 2 e e . . .
        . . . . . 2 2 e e e e . . . . .
    `, 4, 1),
        new Gem("blue", img`
    . . . . . b b b b b b . . . . .
    . . . b b 9 9 9 9 9 9 b b . . .
    . . b b 9 9 9 9 9 9 9 9 b b . .
    . b b 9 d 9 9 9 9 9 9 9 9 b b .
    . b 9 d 9 9 9 9 9 1 1 1 9 9 b .
    b 9 d d 9 9 9 9 9 1 1 1 9 9 9 b
    b 9 d 9 9 9 9 9 9 1 1 1 9 9 9 b
    b 9 3 9 9 9 9 9 9 9 9 9 1 9 9 b
    b 5 3 d 9 9 9 9 9 9 9 9 9 9 9 b
    b 5 3 3 9 9 9 9 9 9 9 9 9 d 9 b
    b 5 d 3 3 9 9 9 9 9 9 9 d d 9 b
    . b 5 3 3 3 d 9 9 9 9 d d 5 b .
    . b d 5 3 3 3 3 3 3 3 d 5 b b .
    . . b d 5 d 3 3 3 3 5 5 b b . .
    . . . b b 5 5 5 5 5 5 b b . . .
    . . . . . b b b b b b . . . . .
`, 4, 3),
        new Gem("orange", img`
    . . . . c c c b b b b b . . . .
    . . c c b 4 4 4 4 4 4 b b b . .
    . c c 4 4 4 4 4 5 4 4 4 4 b c .
    . e 4 4 4 4 4 4 4 4 4 5 4 4 e .
    e b 4 5 4 4 5 4 4 4 4 4 4 4 b c
    e b 4 4 4 4 4 4 4 4 4 4 5 4 4 e
    e b b 4 4 4 4 4 4 4 4 4 4 4 b e
    . e b 4 4 4 4 4 5 4 4 4 4 b e .
    8 7 e e b 4 4 4 4 4 4 b e e 6 8
    8 7 2 e e e e e e e e e e 2 7 8
    e 6 6 2 2 2 2 2 2 2 2 2 2 6 c e
    e c 6 7 6 6 7 7 7 6 6 7 6 c c e
    e b e 8 8 c c 8 8 c c c 8 e b e
    e e b e c c e e e e e c e b e e
    . e e b b 4 4 4 4 4 4 4 4 e e .
    . . . c c c c c e e e e e . . .
`, 4, 6),
        new Gem("yellow", img`
    4 4 4 . . 4 4 4 4 4 . . . . . .
    4 5 5 4 4 5 5 5 5 5 4 4 . . . .
    b 4 5 5 1 5 1 1 1 5 5 5 4 . . .
    . b 5 5 5 5 1 1 5 5 1 1 5 4 . .
    . b d 5 5 5 5 5 5 5 5 1 1 5 4 .
    b 4 5 5 5 5 5 5 5 5 5 5 1 5 4 .
    c d 5 5 5 5 5 5 5 5 5 5 5 5 5 4
    c d 4 5 5 5 5 5 5 5 5 5 5 1 5 4
    c 4 5 5 5 d 5 5 5 5 5 5 5 5 5 4
    c 4 d 5 4 5 d 5 5 5 5 5 5 5 5 4
    . c 4 5 5 5 5 d d d 5 5 5 5 5 b
    . c 4 d 5 4 5 d 4 4 d 5 5 5 4 c
    . . c 4 4 d 4 4 4 4 4 d d 5 d c
    . . . c 4 4 4 4 4 4 4 4 5 5 5 4
    . . . . c c b 4 4 4 b b 4 5 4 4
    . . . . . . c c c c c c b b 4 .
`, 4, 8)
    ]

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
        info.life, info.setLife, (p: number) => info.changeLifeBy(-p))
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
        (p: number) => info.player2.changeLifeBy(-p))

    export const PLAYERS = [player1, player2]


    export function start_manual_game() {

        init()
        _bindControllerEvents()
        _initSpriteOverlapEvents()
        
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
    

    function aiMove() {

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

        if (closest_path.length == 1) {
            console.log(`${closest_path[0].row}, ${closest_path[0].column}`)
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

        if (ans == -1) {
            console.log(`${rowDiff}, ${colDiff} -> ${loc.row}, ${loc.col}`)
        }

        console.log(`going to ${closest_gem}, direction:${ans}`)

        player2.move(ans)

    }
    
    function playerMove() {
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

        for (let player of PLAYERS) {
            player.init()
        }
        

        forever(function () {
            playerMove()
            refresh()
            aiMove()
            refresh()
        })
    }
    

}