import * as PIXI from "pixi.js";

import Drawer from "./drawer"
import Farm from "./farm";
const FRAME_TIME = 500


const setup = () => {

class Entity {
    constructor(title, product, productionTime) {
        this.title = title
        this.product = product
        this.finishedProducts = 0
        this.productionTime = productionTime
        this.productionProgress = 0
    }


}

class Animal extends Entity {

    constructor(title, product, productionTime, satietyTime, consuming) {
        super(title, product, productionTime)
        this.satiety = 0
        this.consumingPerSec = consuming
        this.productAccumulative = true
        this.feedable = true
    }

    feed(title) {
        if (this.satiety <= 0) {
            drawer.drawHungry(this.areaId, false)
            this.production()
        }
        farm.barn[title]--
        drawer.drawBarnCount(title)
        this.satiety += products[title].satisfying
    }

    production() {
        const prodInterval = setInterval(() => {
            if (this.satiety > 0) {
                this.productionProgress += FRAME_TIME / this.productionTime * 100
                if (this.productionProgress >= 100) {
                    this.finishedProducts += 1
                    drawer.drawProductCount(this)
                    this.productionProgress = 0
                }
                drawer.drawProgress(this.areaId, this.productionProgress)
                this.satiety -= this.consumingPerSec * FRAME_TIME / 1000
            } else {
                drawer.drawHungry(this.areaId, true)
                clearInterval(prodInterval)
            }
        }, FRAME_TIME)
    }

    collect() {
        farm.barn[this.product] += this.finishedProducts
        this.finishedProducts = 0
        drawer.drawBarnCount(this.product)
        drawer.drawProductCount(this)
    }
}

class Plants extends Entity {
    constructor(title, product, productionTime) {
        super(title, product, productionTime)
        this.production()
    }

    collect() {
        this.productionProgress = 0
        farm.barn[this.product] += this.finishedProducts
        this.finishedProducts = 0
        drawer.drawBarnCount(this.product)
        drawer.drawProductCount(this)
        this.production()
    }
    production() {
        const prodInterval = setInterval(() => {
            if (this.productionProgress < 100) {
                this.productionProgress += FRAME_TIME / this.productionTime * 100
                drawer.drawProgress(this.areaId, this.productionProgress)
            } else {
                this.finishedProducts++
                drawer.drawProductCount(this)
                clearInterval(prodInterval)
            }
        }, FRAME_TIME)
    }
}

class Wheat extends Plants {
    constructor() {
        super("wheat", "seeds", 10000)
    }
}

class Corn extends Plants {
    constructor() {
        super("corn", "ear", 5000)
    }
}

class Chicken extends Animal {
    constructor() {
        super("chicken","egg", 10000, 30000, 2)
    }
}

class Cow extends Animal {
    constructor() {
        super("cow","milk", 20000, 20000, 3)
    }
}


    const products = {
        milk: {
            cost: 20
        },
        egg: {
            cost: 10
        },
        seeds: {
            cost: 1,
            satisfying: 60,
        },
        ear: {
            cost: 5,
            satisfying: 90,
        }
    }
    const entities = {
        chicken: {
            cost: 40,
            class: Chicken
        },
        cow: {
            cost: 60,
            class: Cow
        },
        wheat: {
            cost: 20,
            class: Wheat
        },
        corn: {
            cost: 80,
            class: Corn
        }
    }
    const farm = new Farm(products, entities)
    const drawer = new Drawer(farm)

}

PIXI.Loader.shared
    .add("img/atlas.json")
    .load(setup)
