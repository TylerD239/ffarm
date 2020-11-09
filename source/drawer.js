import * as PIXI from "pixi.js"


class Drawer {

    constructor(farm) {
        this.farm = farm
        this.products = farm.products
        this.entities = farm.entities

        this.app = new PIXI.Application({
            transparent: true,
            width: window.innerWidth,
            height: window.innerHeight,
            // resolution: window.devicePixelRatio || 1,
        })
        document.body.appendChild(this.app.view)


        this.container = new PIXI.Container()
        this.container.y = 80
        this.app.stage.addChild(this.container)

        this.textures = {
            chicken: this.loadTexture('chicken'),
            cow: this.loadTexture('cow'),
            grow: this.loadTexture('grow'),
            wheat: this.loadTexture('wheat'),
            milk: this.loadTexture('milk'),
            egg: this.loadTexture('egg'),
            seeds: this.loadTexture('seeds'),
            sale: this.loadTexture('sale'),
            coins: this.loadTexture('coins'),
            corn: this.loadTexture('corn'),
            ear: this.loadTexture('ear'),
            buy: this.loadTexture('buy'),

        }

        this.farmContainer = new PIXI.Container()
        this.farmContainer.x = 300
        this.storageContainer = new PIXI.Container()
        this.storageContainer.x = 180
        this.barnContainer = new PIXI.Container()
        this.barnContainer.x = 980
        this.shopContainer = new PIXI.Container()
        this.shopContainer.x = 1080

        this.container.addChild(this.shopContainer)
        this.container.addChild(this.farmContainer)
        this.container.addChild(this.storageContainer)
        this.container.addChild(this.barnContainer)

        this.shop = {
            coins: {
                img: new PIXI.Sprite(this.textures["coins"]),
                text: new PIXI.Text('', {fill: 0xFFFFFF, fontSize: '30px'}),
            },
            sale: {
                img: new PIXI.Sprite(this.textures["sale"]),
                text: new PIXI.Text('', {fill: 0xFFFFFF, fontSize: '20px', align: 'center'})
            }
        }

        this.storage = {
            wheat: {
                img: new PIXI.Sprite(this.textures["wheat"]),
                img2: new PIXI.Sprite(this.textures["wheat"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
                buy: new PIXI.Sprite(this.textures["buy"]),
                price: new PIXI.Text('', {fill: 0xFFFFFF, fontSize: "18px"}),
            },
            cow: {
                img: new PIXI.Sprite(this.textures["cow"]),
                img2: new PIXI.Sprite(this.textures["cow"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
                buy: new PIXI.Sprite(this.textures["buy"]),
                price: new PIXI.Text('', {fill: 0xFFFFFF, fontSize: "18px"}),
            },
            chicken: {
                img: new PIXI.Sprite(this.textures["chicken"]),
                img2: new PIXI.Sprite(this.textures["chicken"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
                buy: new PIXI.Sprite(this.textures["buy"]),
                price: new PIXI.Text('', {fill: 0xFFFFFF, fontSize: "18px"}),
            },
            corn: {
                img: new PIXI.Sprite(this.textures["corn"]),
                img2: new PIXI.Sprite(this.textures["corn"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
                buy: new PIXI.Sprite(this.textures["buy"]),
                price: new PIXI.Text('', {fill: 0xFFFFFF, fontSize: "18px"}),
            }
        }

        this.barn = {
            milk: {
                img: new PIXI.Sprite(this.textures["milk"]),
                img2: new PIXI.Sprite(this.textures["milk"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
            },
            egg: {
                img: new PIXI.Sprite(this.textures["egg"]),
                img2: new PIXI.Sprite(this.textures["egg"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
            },
            seeds: {
                img: new PIXI.Sprite(this.textures["seeds"]),
                img2: new PIXI.Sprite(this.textures["seeds"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
            },
            ear: {
                img: new PIXI.Sprite(this.textures["ear"]),
                img2: new PIXI.Sprite(this.textures["ear"]),
                count:  new PIXI.Text('', {fill: 0xFFFFFF}),
            }
        }

        this.farmImgsData = {}

        this.drawField()
        this.drawStorage()
        this.drawShop()
        this.drawBarn()
    }

    loadTexture(title) {
        return PIXI.Loader.shared.resources["img/atlas.json"].textures[`${title}.png`]
    }

    add(id, entity) {

        const data = this.farmImgsData[id] = {}
        data.product = {}
        data.progress = {}

        const img = new PIXI.Sprite(this.textures[entity.title])
        img.interactive = true
        img.buttonMode = true
        img.id = id
        img.x = id % 8 * 80
        img.y = Math.floor(id / 8) * 80

        const productImg = new PIXI.Sprite(this.textures[entity.product])
        productImg.interactive = true
        productImg.buttonMode = true
        productImg.anchor.set(1, 0)
        productImg.x = 80
        productImg
            .on('pointerover', this.hoverOn)
            .on('pointerout', this.hoverOff)
        productImg.visible = false

        productImg.on('pointerdown', () => {
            entity.collect()
        })

        img.addChild(productImg)
        this.farmContainer.addChild(img)

        if (entity.productAccumulative) {
            const productCount = new PIXI.Text('0')
            productCount.anchor.set(0.5)
            productCount.x = -16
            productCount.y = 16
            productImg.addChild(productCount)
            data.product.count = productCount
        }

        const progressStatus = new PIXI.Graphics()
        const progressContainer = new PIXI.Graphics()
        progressContainer.lineStyle(1, 0x654100, 1)
        progressContainer.beginFill(0xFFFFFF, 0.60)
        progressContainer.drawRoundedRect(10, 60, 60, 10, 5)

        img.addChild(progressContainer)
        img.addChild(progressStatus)

        if (entity.feedable) {
            const hungryText = new PIXI.Text("HUNGRY", {fontSize: "12px"})
            hungryText.anchor.set(0.5)
            hungryText.x = 40
            hungryText.y = 65
            img.addChild(hungryText)
            data.hungryText = hungryText
        }
        data.progress.status = progressStatus
        data.progress.container = progressContainer
        data.product.img = productImg
        data.img = img

    }

    drawField() {
        this.farm.field.forEach((el, i) => {

            const sprite = new PIXI.Sprite(this.textures["grow"])
            sprite.interactive = true
            sprite.x = (i % 8) * 80
            sprite.y = Math.floor(i / 8) * 80
            sprite
                .on('pointerover', this.hoverOn)
                .on('pointerout', this.hoverOff)

            this.farmContainer.addChild(sprite)
        })

    }
    drawStorage() {
        Object.keys(this.storage).forEach((key, i) => {
            const sprite = this.storage[key].img
            sprite.y = i * 80
            sprite.alpha = this.farm.storage[key] ? 1 : 0.4

            const sprite2 = this.storage[key].img2
            sprite2.x = sprite.x
            sprite2.y = sprite.y
            sprite2.basePosition = {x: sprite2.x, y:sprite2.y}
            sprite2.interactive = true
            sprite2.buttonMode = true
            sprite2.visible = !!this.farm.storage[key]
            sprite2.title = key
            sprite2
                .on('pointerdown', (event) => {
                    this.onDragStart(event, sprite2)
                })
                .on('pointerup', (event) => {
                    this.onEntityDragEnd(event, sprite2)
                })
                .on('pointerupoutside', (event) => {
                    this.onEntityDragEnd(event, sprite2)
                })
                .on('pointermove', (event) => {
                    this.onEntityDragMove(event, sprite2)
                })

            const count = this.storage[key].count
            count.anchor.set(0.5)
            count.x = 90
            count.y = 40
            count.text = this.farm.storage[key]

            const buy = this.storage[key].buy
            buy.x = sprite.x - 30
            buy.y = sprite.y + 40
            buy.title = key
            buy.interactive = true
            buy.buttonMode = true
            buy.anchor.set(0.5)
            const priceNumber = this.entities[key].cost
            buy.buttonMode = buy.interactive = this.farm.money >= priceNumber
            buy.alpha = this.farm.money >= priceNumber ? 1 : 0.4
            buy.on('pointerdown', () => {
                this.farm.buyEntity(key)
                this.drawStorageCount(key)
                this.drawStorageBuy()
                this.drawCoins()
            })

            const price = this.storage[key].price
            price.text = priceNumber + " BTC"
            price.x = -50
            price.anchor.set(0.5)

            buy.addChild(price)
            sprite.addChild(count)
            this.storageContainer.addChild(buy)
            this.storageContainer.addChild(sprite2)
            this.storageContainer.addChild(sprite)
        })

    }
    drawBarn() {
        Object.keys(this.barn).forEach((key, i) => {

            const sprite = this.barn[key].img
            sprite.y = i * 80
            sprite.alpha = this.farm.barn[key] ? 1 : 0.4

            const sprite2 = this.barn[key].img2
            sprite2.x = sprite.x
            sprite2.y = sprite.y
            sprite2.basePosition = {x: sprite2.x, y:sprite2.y}
            sprite2.interactive = true
            sprite2.buttonMode = true
            sprite2.title = key
            sprite2.visible = !!this.farm.barn[key]
            sprite2
                .on('pointerdown', (event) => {
                    this.onEntityDragStart(event, sprite2)
                })
                .on('pointerup', (event) => {
                    this.onProductDragEnd(event, sprite2)
                })
                .on('pointerupoutside', (event) => {
                    this.onProductDragEnd(event, sprite2)
                })
                .on('pointermove', (event) => {
                    this.onProductDragMove(event, sprite2)
                })

            const count = this.barn[key].count
            count.x = 40
            count.text = this.farm.barn[key]

            this.barnContainer.addChild(sprite)
            this.barnContainer.addChild(sprite2)
            sprite.addChild(this.barn[key].count)
        })

    }

    drawCoins() {
        const coinsText = this.shop.coins.text
        coinsText.text = this.farm.money
    }
    drawShop() {
        const coinsSprite = this.shop.coins.img
        const coinsText = this.shop.coins.text

        coinsText.x = 40
        coinsText.text = this.farm.money

        this.shopContainer.addChild(coinsSprite)
        coinsSprite.addChild(coinsText)

        const saleSprite = this.shop.sale.img
        const saleText = this.shop.sale.text

        saleSprite.y = 120

        saleText.y = -50

        saleText.visible = false

        this.shopContainer.addChild(saleSprite)
        saleSprite.addChild(saleText)


    }

    drawHungry(id, hungry) {
        this.farmImgsData[id].hungryText.visible = hungry
    }
    drawStorageBuy() {
        Object.keys(this.storage).forEach((key, i) => {

            const priceNumber = this.entities[key].cost
            const buy = this.storage[key].buy
            buy.buttonMode = buy.interactive = this.farm.money >= priceNumber
            buy.alpha = this.farm.money >= priceNumber ? 1 : 0.4
        })
    }
    drawStorageCount(title) {
        const count = this.farm.storage[title]
        this.storage[title].count.text = count
        this.storage[title].img.alpha = count ? 1 : 0.4
        this.storage[title].img2.visible = !!count
    }
    drawProductCount(entity) {
        this.farmImgsData[entity.areaId].product.img.visible = !!entity.finishedProducts
        if (entity.productAccumulative) this.farmImgsData[entity.areaId].product.count.text = entity.finishedProducts
    }
    drawBarnCount(product) {
        const count = this.farm.barn[product]
        this.barn[product].count.text = count
        this.barn[product].img.alpha = count ? 1 : 0.4
        this.barn[product].img2.visible = !!count
    }
    drawProgress(id, progress) {
        const status = this.farmImgsData[id].progress.status
        status.clear()
        status.beginFill(0xFF9999, 1)
        status.drawRoundedRect(10, 61, progress * 0.6, 9, 5)
    }

    hoverOn() {
        this.tint = 0xAAAAAA
    }
    hoverOff() {
        this.tint = 0xFFFFFF
    }
    onDragStart(event, target) {
        target.data = event.data
        target.dragging = true
    }
    onEntityDragEnd(event, target) {
        if (target.onFarm) {
            const cell = target.farmPositioncell.y * 8 + target.farmPositioncell.x
            if (!this.farm.field[cell].contains) {
                const entity = new this.entities[target.title].class()
                this.farm.field[cell].add(entity, cell)
                this.farm.storage[target.title]--
                this.drawStorageCount(target.title, this.farm.storage[target.title])
                this.add(cell, entity)

            }

        }
        target.x = target.basePosition.x
        target.y = target.basePosition.y

        target.dragging = false
        target.data = null
    }
    onEntityDragMove(event, target) {
        if (target.dragging) {
            const position = target.data.getLocalPosition(this.storageContainer)
            const farmPosition = target.data.getLocalPosition(this.farmContainer)
            if (farmPosition.x > 0 && farmPosition.x < 640 && farmPosition.y > 0 && farmPosition.y < 640) {
                target.onFarm = true
                target.farmPositioncell = {x: Math.floor(farmPosition.x / 80), y: Math.floor(farmPosition.y / 80)}
                position.x = target.farmPositioncell.x * 80 + 160
                position.y = target.farmPositioncell.y * 80 + 40
            } else {
                target.onFarm = false
            }
            target.x = position.x - 40
            target.y = position.y - 40
        }
    }
    onEntityDragStart(event, target) {
        this.shop.sale.img.tint = 0xFFBBBB
        this.farm.field.forEach((el, i) => {
            if (this.products[target.title].satisfying && el.contains && el.contains.feedable) {
                this.farmImgsData[i].img.tint = 0xFFFF99
            }
        })
        const saleText = this.shop.sale.text
        saleText.text = `Продать за \n ${this.products[target.title].cost} BTC`
        saleText.visible = true

        target.data = event.data
        target.dragging = true
    }
    onProductDragEnd(event, target) {
        if (target.dragging) {
            this.shop.sale.img.tint = 0xFFFFFF
            const saleText = this.shop.sale.text
            saleText.text = ``
            saleText.visible = false

            this.farm.field.forEach((el, i) => {
                if (el.contains && el.contains.feedable) {
                    this.farmImgsData[i].img.tint = 0xFFFFFF
                }
            })

            const salePosition = target.data.getLocalPosition(this.shop.sale.img)
            const farmPosition = target.data.getLocalPosition(this.farmContainer)
            if (farmPosition.x > 0 && farmPosition.x < 640 && farmPosition.y > 0 && farmPosition.y < 640) {
                const cell = Math.floor(farmPosition.y  / 80) * 8 + Math.floor(farmPosition.x  / 80)
                const entity = this.farm.field[cell].contains
                if (entity && entity.feedable && this.products[target.title].satisfying) {
                    entity.feed(target.title)
                }
            }

            if (salePosition.x > -10 && salePosition.x < 90 && salePosition.y > -30 && salePosition.y < 90) {
                this.farm.saleProduct(target.title)
                this.drawCoins()
                this.drawBarnCount(target.title)
                this.drawStorageBuy()
            }

            target.x = target.basePosition.x
            target.y = target.basePosition.y

            target.dragging = false
            target.data = null
        }
    }
    onProductDragMove(event, target) {
        if (target.dragging) {
            const position2 = target.data.getLocalPosition(target.parent)
            target.x = position2.x - 16
            target.y = position2.y - 16
        }
    }

}

export default Drawer