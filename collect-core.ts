namespace SpriteKind {
    export const Box = SpriteKind.create()
}

namespace collect {

    export const DIRECTIONS = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1]
    ]

    export class Item {

        protected _name:string;
        protected _icon: Image;
        protected _icon5: Image;
        protected _row: number;
        protected _col: number;
        protected _sprite: Sprite;
        protected _spriteKind : number;
        
        constructor(name: string, icon: Image, icon5: Image, defaultRow: number, defaultCol: number, spriteKind:number) {
            this._name = name
            this._icon = icon
            this._icon5 = icon5
            this._row = defaultRow
            this._col = defaultCol
            this._spriteKind = spriteKind
        }

        get name() {
            return this._name
        }
        get icon() {
            return this._icon
        }

        get icon5() {
            return this._icon5
        }

        changePosition() {

            let locs = tiles.getTilesByType(sprites.castle.tilePath5)
            let nextPosition = null;
            while (true) {
                let idx = randint(0, locs.length - 1)
                nextPosition = locs[idx]
                for (let character of PLAYERS) {
                    let playerLoc = character.getLocation()
                    if (nextPosition.column == playerLoc.column
                        && nextPosition.row == playerLoc.row) {
                        continue
                    }
                }
                break
            }

            this._place(nextPosition.col, nextPosition.row)

        }

        _place(col: number, row: number) {
            let currentLoc = tiles.getTileLocation(this._col, this._row)
            tiles.setTileAt(currentLoc, sprites.castle.tilePath5)

            let loc = tiles.getTileLocation(col, row)
            tiles.placeOnTile(this._sprite, loc)

            tiles.setTileAt(loc, assets.tile`occupied`)
            this._col = col
            this._row = row
        }

        init() {
            this._sprite = sprites.create(this._icon, this._spriteKind)
            sprites.setDataString(this._sprite, "name", this._name)

            this._place(this._col, this._row)
        }

        getLocation(): tiles.Location {
            return tiles.getTileLocation(this._col, this._row)
        }


    }

    export class Box extends Item{

        constructor(name: string, icon: Image, icon5: Image, defaultRow: number, defaultCol: number) {
            super(name, icon, icon5, defaultRow, defaultCol, SpriteKind.Box)
        }
        
    }

    export class Gem extends Item{

        constructor(name: string, icon: Image, icon5: Image, defaultRow: number, defaultCol: number) {
            super(name, icon, icon5, defaultRow, defaultCol, SpriteKind.Food)
        }


    }

    export const GEMS = [
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
        `, img`
            c e 7 2 e
            e 2 2 4 2
            e 2 2 2 2
            e 2 2 2 4
            2 2 2 4 e
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
        `, img`
            . . b b .
            . 9 9 9 9
            b 9 9 1 9
            b 3 9 9 9
            . 5 3 3 5
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
`, img`
    c 4 5 4 b
    4 4 4 4 4
    e 4 4 4 e
    6 2 2 2 6
    b c e e b
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
`, img`
    5 5 1 5 .
    5 5 5 5 5
    5 d 5 5 5
    4 5 d 5 5
    . 4 4 4 5
`, 4, 8)
    ]

    export const BOX = new Box("box", img`
        . . b b b b b b b b b b b b . .
        . b e 4 4 4 4 4 4 4 4 4 4 e b .
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e 4 4 4 4 4 4 4 4 4 4 4 4 e b
        b e e 4 4 4 4 4 4 4 4 4 4 e e b
        b e e e e e e e e e e e e e e b
        b e e e e e e e e e e e e e e b
        b b b b b b b d d b b b b b b b
        c b b b b b b c c b b b b b b c
        c c c c c c b c c b c c c c c c
        b e e e e e c b b c e e e e e b
        b e e e e e e e e e e e e e e b
        b c e e e e e e e e e e e e c b
        b b b b b b b b b b b b b b b b
        . b b . . . . . . . . . . b b .
    `,
     img`
         4 4 4 4 4
         e 4 4 4 e
         b b d b b
         c c c c c
         e e e e e
     `, 6, 5)


    export class Character {

        private _scores: { [key: string]: number } = {}
        private _box: number[] = []
        private _icon: Image
        private _row: number
        private _col: number
        private sprite: Sprite
        private _id: number
        private _setScore:(s:number) => void

        power: () => number
        setPower: (p: number) => void
        decrPower: (p: number) => void

        constructor(id: number, icon: Image, row: number, col: number,
            power: () => number,
            setPower: (p: number) => void,
            decrPower: (p: number) => void, 
            setScore:(s:number)=>void) {
            this._id = id
            this._icon = icon
            this._row = row
            this._col = col
            this.power = power
            this.setPower = setPower
            this.decrPower = decrPower
            this._setScore = setScore
        }

        init() {

            this.sprite = sprites.create(this._icon, SpriteKind.Player)
            tiles.placeOnTile(this.sprite, tiles.getTileLocation(this._col, this._row))
            sprites.setDataNumber(this.sprite, "id", this._id)
            this.setPower(100)


        }

        getLocation(): tiles.Location {
            return tiles.getTileLocation(this._col, this._row)
        }

        move(direction: number): void {
            if (direction != -1) {
                tiles.setWallAt(tiles.getTileLocation(this._col, this._row), false)
                this._row += DIRECTIONS[direction][0]
                this._col += DIRECTIONS[direction][1]
                tiles.placeOnTile(this.sprite, tiles.getTileLocation(this._col, this._row))
                tiles.setWallAt(tiles.getTileLocation(this._col, this._row), true)
            }


            this.decrPower(1)
        }

        canMove(direction: number): boolean {
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

        getGem(gem: Gem) {

            if (!this._scores[gem.name]) {
                this._scores[gem.name] = 1
            } else {
                this._scores[gem.name] += 1
            }
        }


        getBox(box:Box) {
            
            let score = 1

            let rand = randint(1, 3)
            if (rand == 1) {
                score = -3
            } else if (rand == 2) {
                score = 10
            }

            this._box.push(score)

        }

        findPath(gem: Gem): tiles.Location[] {

            tiles.setWallAt(this.getLocation(), false)

            let result = scene.aStar(this.getLocation(), gem.getLocation())
            tiles.setWallAt(this.getLocation(), true)

            return result
        }

        getScores(): { [key: string]: number } {
            return this._scores
        }

        getBoxes() : number[] {
            return this._box
        }
 

    }

    function sumScores(scores : {[key:string]:number}, boxes:number[]) :number{
        let sum = 0;
        let minScore = 99999;
        for (let gem of GEMS) {

            let gem_score = scores[gem.name]
            if (!gem_score) {
                gem_score = 0
            }
            sum += gem_score
            minScore = Math.min(minScore, gem_score)
        }

        for (let box of boxes) {
            sum += box
        }

        return minScore * 8 + sum;
    }



    function createInfoImage(scores: { [key: string]: number }, boxes:number[], bgcolor:number, left: boolean) : Image {

        let total_length = 1

        let scoreSum = sumScores(scores, boxes)
        for (let gem of GEMS) {
            let gem_score = scores[gem.name]
            if (!gem_score) {
                gem_score = 0
            }
            total_length += gem.icon5.width + 1
            let gem_score_str = gem_score.toString()
            total_length += gem_score_str.length * image.font5.charWidth
        }

        total_length += BOX.icon5.width + 1
        let box_score_str_len = boxes.length.toString()
        total_length += box_score_str_len.length * image.font5.charWidth

        const result = image.create(total_length + scoreSum.toString().length * image.font5.charWidth + 2, 11);

        result.fill(1)
        
        let x = 2, y = 3

        if (!left) {
            result.print(scoreSum.toString(), x , y, bgcolor, image.font5)
            x += scoreSum.toString().length * image.font5.charWidth 
        }

        result.fillRect(x, 1, total_length - 1, 9, bgcolor)
        

        for (let gem of GEMS) {
            let gem_score = scores[gem.name]
            if (!gem_score) {
                gem_score = 0
            }
            result.drawTransparentImage(gem.icon5, x, y)
            let gem_score_str = gem_score.toString()
            result.print(gem_score_str, x + 6, y, 1, image.font5)
            x += 5 + 1 + gem_score_str.length * image.font5.charWidth
        }

        result.drawTransparentImage(BOX.icon5, x, y)
        let boxes_len_str = boxes.length.toString()
        result.print(boxes_len_str, x + 6, y, 1, image.font5)
        x += 5 + 1 + boxes_len_str.length * image.font5.charWidth

        if (left) {
            result.print(scoreSum.toString(), x + 1, y, bgcolor, image.font5)
        }
        return result;

    }

    export function draw(player:Character, left : boolean) {
        let scores = player.getScores()
        let boxes = player.getBoxes()
        let image = createInfoImage(scores, boxes, left ? 2 : 8, left)
        let x = 0;
        if (!left) {
            x = screen.width - image.width
        }
        let y = screen.height - image.height
        screen.drawTransparentImage(image, x, y)

    }
    
}