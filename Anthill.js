class AntHill {
    constructor(map, antsNumber = 10) {
        this.ants = [];
        this.notFinished = true;
        for(let i = 0; i < antsNumber; i++)
            this.ants.push(new Ant(map));
    }

    launchSearch = async (Map) => {
        while (this.notFinished) {
            for (let i = 0; i < this.ants.length; i++) {
                this.ants[i].dropPheromon(Map);
                this.ants[i].movement(Map, this);
            }
            await sleep(50);
        }
        console.log(this.ants.length)
    }

    spawnAnt(map) {
        this.ants.push(new Ant(map));
    }

    killAnt() {
        this.ants.filter(x => x.lifeCycle < 4);
    }
}

async function sleep(ms) {
    await new Promise(resolve => setTimeout(resolve, ms));
    return true;
}
