
class Farm {
    constructor(products, entities) {
        this.field = Array(64).fill(null).map((el, i) => new FieldArea(i))
        this.barn = {
            egg: 0,
            milk: 0,
            seeds: 1,
            ear: 0
        }
        this.storage = {
            chicken: 1,
            cow: 1,
            wheat: 1,
            corn: 0
        }
        this.products = products
        this.entities = entities

        this.money = 0
    }

    buyEntity(title) {

        this.storage[title]++
        this.money -= this.entities[title].cost

    }

    saleProduct(product) {
        this.barn[product]--
        this.money += this.products[product].cost
    }
}

class FieldArea {
    constructor(id) {
        this.contains = null
        this.id = id
    }
    add(entity, id) {
        this.contains = entity
        entity.areaId = id
    }
}

export default Farm