namespace collect {

    export const DIRECTIONS = [
        [-1, 0],
        [0, 1],
        [1, 0],
        [0, -1]
    ]


    export class Character {

        private _scores: { [key: string]: number } = {}
        private _icon: Image
        private _row: number
        private _col: number
        private sprite: Sprite
        private _id: number

        power: () => number
        setPower: (p: number) => void
        decrPower: (p: number) => void

        constructor(id: number, icon: Image, row: number, col: number,
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

        findPath(gem: Gem): tiles.Location[] {

            tiles.setWallAt(this.getLocation(), false)

            let result = scene.aStar(this.getLocation(), gem.getLocation())
            tiles.setWallAt(this.getLocation(), true)

            return result
        }

    }
    export class Gem {

        private _name: string;
        private _icon: Image;
        private _row: number;
        private _col: number;
        private _sprite: Sprite;

        constructor(name: string, icon: Image, defaultRow: number, defaultCol: number) {
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

        _place(col: number, row: number) {


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

        getLocation(): tiles.Location {
            return tiles.getTileLocation(this._col, this._row)
        }


    }
}