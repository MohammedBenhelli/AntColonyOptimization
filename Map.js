class Piece {
    constructor() {
        this._pheroNest = 0.0;
        this._pheroFood = 0.0;
        this._typeCase = ``;
    }

    get typeCase() {
        return this._typeCase;
    }

    set typeCase(value) {
        this._typeCase = value;
    }

    get pheroFood() {
        return this._pheroFood;
    }

    set pheroFood(value) {
        this._pheroFood = value;
    }

    get pheroNest() {
        return this._pheroNest;
    }

    set pheroNest(value) {
        this._pheroNest = value;
    }
}

class Wall extends Piece {
    constructor() {
        super();
        this._typeCase = `P`;
        this.pheroFood = -1;
        this.pheroNest = -1;
    }
}

class Empty extends Piece {
    constructor() {
        super();
        this._typeCase = `E`;
    }
}

class Food extends Piece {
    constructor() {
        super();
        this._remainFood = 100;
        this._typeCase = `F`;
        this.pheroFood = 1;
    }

    get remainFood() {
        return this._remainFood;
    }

    set remainFood(value) {
        this._remainFood = value;
    }

    deleteFood() {
        this._remainFood--;
    }
}

class Nest extends Piece {
    constructor() {
        super();
        this._typeCase = `N`;
        this.pheroNest = 1;
    }
}

class Map {
    constructor(x = 10, y = 10, noise = 6) {
        this.x = x;
        this.y = y;
        this.noise = noise;
        this.hasFood = false;
        this.stopVerif = false;
        this.constructArray();
    }

    constructArray = async () => {
        this.map = [];
        document.querySelector("#root").innerHTML = '';
        this.visitedMap = [];
        for (let i = 0; i < this.x; i++) {
            this.map[i] = [];
            this.visitedMap[i] = [];
            for (let j = 0; j < this.y; j++) {
                this.map[i][j] = this.generateCase(i, j);
                this.visitedMap[i][j] = false;
            }
        }
        const [fX, fY] = this.getFoodCord();
        this.map[fX][fY] = new Food();
        await this.checkMap(fX, fY, 0, 0);
        if (!this.stopVerif) this.constructArray();
        else {
            this.constructMap();
            this.setNest();
        }
    }

    setNest() {
        this.nest = new AntHill(this.map, 50);
        this.nest.launchSearch(this);
    }

    generateCase(i, j) {
        if (i === 0 && j === 0) return new Nest();
        else if (getRandomInt(1, this.noise) === 1) return new Wall();
        else return new Empty();
    }

    constructMap() {
        const table = document.querySelector("#root");
        table.innerHTML = '';
        for (let i = 0; i < this.x; i++) {
            const tr = document.createElement('tr');
            table.appendChild(tr);
            for (let j = 0; j < this.y; j++) {
                const td = document.createElement('td');
                td.setAttribute('id', `col-${i}-${j}`);
                if (this.map[i][j].typeCase === 'P')
                    td.innerText = '|';
                else if (this.map[i][j].typeCase === 'E')
                    td.innerHTML = `<span class="pheroNest">${this.map[i][j].pheroNest}<span/> 
                                    <span class="pheroFood">${this.map[i][j].pheroFood}<span/>`;
                else if (this.map[i][j].typeCase === 'N')
                    td.innerHTML = `<h2><span class="nest">N<span/></h2>`;
                else if (this.map[i][j].typeCase === 'F')
                    td.innerHTML = `<h2><span class="food">${this.map[i][j].remainFood}<span/></h2>`;
                tr.appendChild(td);
            }
        }
    }

    checkMap = (fX, fY, x, y) => {
        if (this.stopVerif) return;
        if (x === fX && fY === y) {
            this.stopVerif = true;
            return;
        }
        this.visitedMap[x][y] = true;
        if (this.isValid(x, y) && this.map[x][y].typeCase !== 'P') {
            if (x + 1 < this.map.length && this.visitedMap[x + 1][y] === false)
                this.checkMap(fX, fY, x + 1, y)
            if (x - 1 >= 0 && this.visitedMap[x - 1][y] === false)
                this.checkMap(fX, fY, x - 1, y)
            if (y + 1 < this.map[x].length && this.visitedMap[x][y + 1] === false)
                this.checkMap(fX, fY, x, y + 1)
            if (y - 1 >= 0 && this.visitedMap[x][y - 1] === false)
                this.checkMap(fX, fY, x, y - 1)
        }
        this.visitedMap[x][y] = false;
    }

    isValid(x, y) {
        return !(x < 0 || y < 0 || x >= this.map.length || y >= this.map[x].length)
    }

    getFoodCord() {
        let fX = getRandomInt(0, this.x - 1);
        let fY = getRandomInt(0, this.y - 1);
        while (fX === 0 && fY === 0) {
            fX = getRandomInt(0, this.x - 1);
            fY = getRandomInt(0, this.y - 1);
        }
        return [fX, fY];
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
