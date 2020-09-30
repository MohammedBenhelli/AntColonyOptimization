class Ant {
    constructor(map) {
        this._state = "EMPTY";
        this._case = new Case(0, 0);
        this._pheromon = 0;
        this._lifeCycle = 1;
        this._exploration = 0.5;
        this._confiance = 1.1;
        this._evaporation = 0.9999;
        this._bruit = 0.7;
        this.randMove(map);
    }

    randMove(map, AntHill) {
        let tab = [];
        if (this.case.x + 1 < map.length && map[this.case.x + 1][this.case.y].typeCase !== 'P') tab.push({
            x: this.case.x + 1,
            y: this.case.y
        });
        if (this.case.y + 1 < map[this.case.x].length && map[this.case.x][this.case.y + 1].typeCase !== 'P') tab.push({
            x: this.case.x,
            y: this.case.y + 1
        });
        if (this.case.x - 1 >= 0 && map[this.case.x - 1][this.case.y].typeCase !== 'P') tab.push({
            x: this.case.x - 1,
            y: this.case.y
        });
        if (this.case.y - 1 >= 0 && map[this.case.x][this.case.y - 1].typeCase !== 'P') tab.push({
            x: this.case.x,
            y: this.case.y - 1
        });
        // if (map[1][0].typeCase !== 'P') tab.push({x: 1, y: 0});
        // if (map[0][1].typeCase !== 'P') tab.push({x: 0, y: 1});
        const move = tab[Math.floor(Math.random() * tab.length)];
        this.move(map, move.x, move.y, AntHill);
    }

    pheroMove(map, AntHill) {
        let max = -1000;
        let coord;
        if (this.state === 'EMPTY') {
            if (this.case.x + 1 < map.length && map[this.case.x + 1][this.case.y].typeCase !== 'P' && map[this.case.x + 1][this.case.y].pheroFood > max) {
                coord = {
                    x: this.case.x + 1,
                    y: this.case.y
                };
                max = map[this.case.x + 1][this.case.y].pheroFood;
            }
            if (this.case.y + 1 < map[this.case.x].length && map[this.case.x][this.case.y + 1].typeCase !== 'P' && map[this.case.x][this.case.y + 1].pheroFood > max) {
                coord = {
                    x: this.case.x,
                    y: this.case.y + 1
                };
                max = map[this.case.x][this.case.y + 1].pheroFood;
            }
            if (this.case.x - 1 >= 0 && map[this.case.x - 1][this.case.y].typeCase !== 'P' && map[this.case.x - 1][this.case.y].pheroFood > max) {
                coord = {
                    x: this.case.x - 1,
                    y: this.case.y
                };
                max = map[this.case.x - 1][this.case.y].pheroFood;
            }
            if (this.case.y - 1 >= 0 && map[this.case.x][this.case.y - 1].typeCase !== 'P' && map[this.case.x][this.case.y - 1].pheroFood > max) {
                coord = {
                    x: this.case.x,
                    y: this.case.y - 1
                };
            }
        } else {
            if (this.case.x + 1 < map.length && map[this.case.x + 1][this.case.y].typeCase !== 'P' && map[this.case.x + 1][this.case.y].pheroNest > max) {
                coord = {
                    x: this.case.x + 1,
                    y: this.case.y
                };
                max = map[this.case.x + 1][this.case.y].pheroNest;
            }
            if (this.case.y + 1 < map[this.case.x].length && map[this.case.x][this.case.y + 1].typeCase !== 'P' && map[this.case.x][this.case.y + 1].pheroNest > max) {
                coord = {
                    x: this.case.x,
                    y: this.case.y + 1
                };
                max = map[this.case.x][this.case.y + 1].pheroNest;
            }
            if (this.case.x - 1 >= 0 && map[this.case.x - 1][this.case.y].typeCase !== 'P' && map[this.case.x - 1][this.case.y].pheroNest > max) {
                coord = {
                    x: this.case.x - 1,
                    y: this.case.y
                };
                max = map[this.case.x - 1][this.case.y].pheroNest;
            }
            if (this.case.y - 1 >= 0 && map[this.case.x][this.case.y - 1].typeCase !== 'P' && map[this.case.x][this.case.y - 1].pheroNest > max) {
                coord = {
                    x: this.case.x,
                    y: this.case.y - 1
                };
            }
        }
        this.move(map, coord.x, coord.y, AntHill);
    }

    move(map, x, y, Anthill) {
        //TODO:check sur case bouffe ou nid et state
        if (map[x][y].typeCase === 'F' && this.state === 'EMPTY' && map[x][y].remainFood > 0) {
            this.state = 'FULL';
            map[x][y].deleteFood();
            const tdF = document.querySelector(`#col-${x}-${y}`);
            tdF.innerHTML = `<h2><span class="food">${map[x][y].remainFood}<span/></h2>`;
            console.log(map[x][y].remainFood, this.state)
            if (map[x][y].remainFood === 0) {
                Anthill.notFinished = false;
            }
        } else if (map[x][y].typeCase === 'N' && this.state === 'FULL') {
            this.state = 'EMPTY';
            this.lifeCycle = this.lifeCycle++;
            Anthill.killAnt();
            Anthill.spawnAnt(map);
        }
        const tdO = document.querySelector(`#col-${this.case.x}-${this.case.y}`);
        tdO.classList.remove('active')
        this.case.x = x;
        this.case.y = y;
        const td = document.querySelector(`#col-${x}-${y}`);
        td.classList.add('active');
        // console.log(this.case)
    }

    dropPheromon = (Map) => {
        // return = [V1(s), V2(s)]
        const x = this.case.x;
        const y = this.case.y;
        let pheromons;
        if (Map.map[x][y].typeCase === 'P') pheromons = [-1, -1];
        else if (Map.map[x][y].typeCase === 'F') pheromons = [1, this.calculateV(Map, x, y, false)];
        else if (Map.map[x][y].typeCase === 'N') pheromons = [this.calculateV(Map, x, y, true), 1];
        else pheromons = [this.calculateV(Map, x, y, true), this.calculateV(Map, x, y, false)];
        Map.map[x][y].pheroFood = pheromons[0];
        Map.map[x][y].pheroNest = pheromons[1];
        if (Map.map[x][y].typeCase === 'E') {
            const td = document.querySelector(`#col-${x}-${y}`);
            td.innerHTML = `<span class="pheroNest">${(Math.abs(pheromons[1]) * 10).toFixed(2)}</span> 
                        <span class="pheroFood">${(Math.abs(pheromons[0]) * 10).toFixed(2)}</span>`;
        }
    }

    movement(Map, AntHill) {
        if (Math.random() < this.exploration)
            this.randMove(Map.map, AntHill);
        else this.pheroMove(Map.map, AntHill);
    }

    calculateV(Map, x, y, type) {
        if (type) { //cas pheromone Food
            //β (αmax1(N (s)) + (1 − α)avg1(N (s)))
            return this.evaporation * (this.bruit * this.getMaxNeighbour(Map, x, y, true) + ((1 - this.bruit) * this.getAvgNeighbour(Map, x, y, true)));
        } else { //cas pheromone Nest
            //β (αmax2(N (s)) + (1 − α)avg2(N (s)))
            return this.evaporation * (this.bruit * this.getMaxNeighbour(Map, x, y, false) + ((1 - this.bruit) * this.getAvgNeighbour(Map, x, y, false)));
        }
    }

    getMaxNeighbour(Map, x, y, type) {
        const neightborVal = this.getNeighbourTab(Map, x, y, type);
        return Math.max(...neightborVal);
    }

    getAvgNeighbour(Map, x, y, type) {
        const neightborVal = this.getNeighbourTab(Map, x, y, type);
        let total = 0;
        for (let i = 0; i < neightborVal.length; i++)
            total += neightborVal[i];
        return total / neightborVal.length;
    }

    getNeighbourTab(Map, x, y, type) {
        let neightborVal = [];
        if (type) { //cas pheromone Food
            if (typeof Map.map[x + 1] !== "undefined" && typeof Map.map[x + 1][y] !== "undefined") neightborVal.push(Map.map[x + 1][y].pheroFood);
            if (typeof Map.map[x] !== "undefined" && typeof Map.map[x][y + 1] !== "undefined") neightborVal.push(Map.map[x][y + 1].pheroFood);
            if (typeof Map.map[x - 1] !== "undefined" && typeof Map.map[x - 1][y] !== "undefined") neightborVal.push(Map.map[x - 1][y].pheroFood);
            if (typeof Map.map[x][y - 1] !== "undefined" && typeof Map.map[x][y - 1] !== "undefined") neightborVal.push(Map.map[x][y - 1].pheroFood);
        } else { //cas pheromone Nest
            if (typeof Map.map[x + 1] !== "undefined" && typeof Map.map[x + 1][y] !== "undefined") neightborVal.push(Map.map[x + 1][y].pheroNest);
            if (typeof Map.map[x] !== "undefined" && typeof Map.map[x][y + 1] !== "undefined") neightborVal.push(Map.map[x][y + 1].pheroNest);
            if (typeof Map.map[x - 1] !== "undefined" && typeof Map.map[x - 1][y] !== "undefined") neightborVal.push(Map.map[x - 1][y].pheroNest);
            if (typeof Map.map[x][y - 1] !== "undefined" && typeof Map.map[x][y - 1] !== "undefined") neightborVal.push(Map.map[x][y - 1].pheroNest);
        }
        return neightborVal;
    }

    get bruit() {
        return this._bruit;
    }

    set bruit(value) {
        this._bruit = value;
    }

    get evaporation() {
        return this._evaporation;
    }

    set evaporation(value) {
        this._evaporation = value;
    }

    get confiance() {
        return this._confiance;
    }

    set confiance(value) {
        this._confiance = value;
    }

    get exploration() {
        return this._exploration;
    }

    set exploration(value) {
        this._exploration = value;
    }

    get lifeCycle() {
        return this._lifeCycle;
    }

    set lifeCycle(value) {
        this._lifeCycle = value;
    }

    get pheromon() {
        return this._pheromon;
    }

    set pheromon(value) {
        this._pheromon = value;
    }

    get case() {
        return this._case;
    }

    set case(value) {
        this._case = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }
}

class Case {
    constructor(x, y) {
        this._y = y;
        this._x = x;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }
}
