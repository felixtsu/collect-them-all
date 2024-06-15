controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    if (waitForMoveDirection && player1.canMove(0)) {
        currentDirection = 0
    }
})
function refresh () {

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
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (waitForMoveDirection && player1.canMove(2)) {
        currentDirection = 2
    }
})

function aiMove () {

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
        } else if ( closest_path.length > path.length) {
            closest_path = path
            closest_gem = gem.name
        }

    }

    if (closest_path == null) {

        direction = randint(0, 3)
        while (!(player2.canMove(direction))) {
            direction = randint(0, 3)
        }
        player2.move(direction)
        return ;
    }

    if (closest_path.length == 1) {
        console.log(`${closest_path[0].row}, ${closest_path[0].column}`)
    }

    let loc = closest_path[1]

    let rowDiff = loc.row - playerLoc.row
    let colDiff = loc.column - playerLoc.column

    // 这个地方有问题，如果两个格子是通的，会选择斜着走，我们的处理是如果abs_sum == 2
    // 就抹掉1一个

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
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    if (waitForMoveDirection && player1.canMove(1)) {
        currentDirection = 1
    }
})
function playerMove () {
    currentDirection = -1
    waitForMoveDirection = true
    while (currentDirection == -1) {
        pause(10)
    }
    waitForMoveDirection = false
    player1.move(currentDirection)
}

function getGem(sprite:Sprite) :Gem {
    let gemName = sprites.readDataString(sprite, "name")
    for (let gem of GEMS) {
        if (gem.name == gemName) {
            return gem
        }
    }
    return null
}

function getCharacter(playerSprite : Sprite) : Character {
    let _id = sprites.readDataNumber(playerSprite, "id")
    return PLAYERS[_id]
}

sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, (playerSprite, foodSprite)=> {

    let gem = getGem(foodSprite)
    let character = getCharacter(playerSprite)

    character.getGem(gem)

    gem.changePosition()
})


function init () {
    for (let gem of GEMS) {
        gem.init()
    }
}
function moveSprite (sprite: Sprite, direction: number) {
	
}
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    if (waitForMoveDirection && player1.canMove(3)) {
        currentDirection = 3
    }
})
let direction = 0
let waitForMoveDirection = false
let currentDirection = 0
tiles.setTilemap(tilemap`default`)
scene.centerCameraAt(80, 72)
let DIRECTIONS = [
[-1, 0],
[0, 1],
[1, 0],
[0, -1]
]
class Character {

    private _scores :{[key:string] : number}  = {}
    private _icon:Image
    private _row:number
    private _col:number
    private sprite : Sprite
    private _id:number

    power : ()=>number
    setPower: (p:number) => void
    decrPower: (p:number) => void

    constructor(id:number, icon:Image, row:number, col:number,
        power: () => number, 
        setPower: (p: number) => void, 
        decrPower: (p: number) => void) {
        this._id = id
        this._icon = icon
        this._row = row
        this._col = col
        this.power = power
        this.setPower = setPower
        this.decrPower = decrPower

        this.sprite = sprites.create(this._icon, SpriteKind.Player)
        tiles.placeOnTile(this.sprite, tiles.getTileLocation(this._col, this._row))
        sprites.setDataNumber(this.sprite, "id", this._id)
        this.setPower(100)
    }

    getLocation(): tiles.Location {
        return tiles.getTileLocation(this._col, this._row)
    }

    move( direction : number):void {
        if (direction != -1) {
            tiles.setWallAt(tiles.getTileLocation(this._col, this._row), false)
            this._row += DIRECTIONS[direction][0]
            this._col += DIRECTIONS[direction][1]
            tiles.placeOnTile(this.sprite, tiles.getTileLocation(this._col, this._row))
            tiles.setWallAt(tiles.getTileLocation(this._col, this._row), true)
        }

    
        this.decrPower(1)
    }

    canMove(direction:number):boolean {
        let nextRow = this._row + DIRECTIONS[direction][0]
        let nextCol = this._col + DIRECTIONS[direction][1]

        if (nextRow < 0 || nextRow > 8 || nextCol < 0 || nextCol > 9) {
            return false
        }

        if (tiles.getTileLocation(nextCol, nextRow).isWall()) {
            return false
        }

        return true
    }

    getGem(gem:Gem) {

        if (!this._scores[gem.name]) {
            this._scores[gem.name] = 1
        } else {
            this._scores[gem.name] += 1
        }
    }

    findPath(gem:Gem) : tiles.Location[] {

        tiles.setWallAt(this.getLocation(), false)

        let result = scene.aStar(this.getLocation(), gem.getLocation())
        tiles.setWallAt(this.getLocation(), true)
        
        return result
    }
    
}
class Gem{

    private _name: string;
    private _icon:Image;
    private _row :number;
    private _col:number;
    private _sprite:Sprite;

    constructor(name:string, icon:Image, defaultRow : number, defaultCol:number) {
        this._name = name
        this._icon = icon
        this._row = defaultRow
        this._col = defaultCol
        
    }

    init() {
        this._sprite = sprites.create(this._icon, SpriteKind.Food)
        sprites.setDataString(this._sprite, "name", this._name)

        this._place(this._col, this._row)

    }

    get name() {
        return this._name
    }
    get icon() {
        return this._icon
    }

    _place(col : number, row : number) {
        

        let currentLoc = tiles.getTileLocation(this._col, this._row)
        tiles.setTileAt(currentLoc, sprites.castle.tilePath5)

        let loc = tiles.getTileLocation(col, row)
        tiles.placeOnTile(this._sprite, loc)

        tiles.setTileAt(loc, assets.tile`occupied`)
        this._col = col
        this._row = row
    }

    changePosition() {

        let locs = tiles.getTilesByType(sprites.castle.tilePath5)
        let nextPosition = null;
        while (true) {
            let idx = randint(0, locs.length -1)
            nextPosition = locs[idx]
            for ( let character of PLAYERS) {
                let playerLoc = character.getLocation()
                if ( nextPosition.column == playerLoc.column 
                    && nextPosition.row == playerLoc.row ){
                        continue
                }
            }
            break
        }

        this._place(nextPosition.col, nextPosition.row)
        
    }

    getLocation() : tiles.Location {
        return tiles.getTileLocation(this._col, this._row)
    }


}
const GEMS = [
new Gem("red",img`
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
    () => {return info.player2.life()}, 
    (p:number) => {info.player2.setLife(p)},
     (p: number) => info.player2.changeLifeBy(-p))
let PLAYERS = [player1, player2]
currentDirection = -1
init()
forever(function () {
    playerMove()
    refresh()
    aiMove()
    refresh()
})
