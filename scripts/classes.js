//-------------------------------------------------------------
// Classes -- WARNING!! REFACTORING ZONE!! TOO MUCH WET CODE!!
//-------------------------------------------------------------

class FilesController {
    constructor() {
        this.delay = 700
        this.clicks = 0
        this.timer = null
        this.target = null
        this.selectionOneClickTimer = null
    }

    resetFields() {
        this.clicks = 0
        clearTimeout(this.timer)
    }

    async selectFile(node) {
        $('body').click()
        data.switches.selectedFile = true
        node.classList.add('desktopFileActive')
    
        await wait(50)
        data.switches.selectedFile = false
    }

    selectNewTarget(targetApp) {
        this.clicks++
        this.selectFile(targetApp)
        this.target = targetApp
        this.timer = setTimeout(() => {
            this.resetFields()
        }, this.delay)
    }

    fileClick(targetApp) {
        if (this.clicks === 0) {
            this.selectNewTarget(targetApp)
        } else if (targetApp === this.target) {
            clearTimeout(this.timer)
            $('body').click()
            $(targetApp.dataset.openApp).show()
            this.resetFields()
        } else {
            clearTimeout(this.timer)
            this.resetFields()
            this.selectNewTarget(targetApp)
        }
    }

    openNewTarget(targetApp) {
        this.clicks++
        this.target = targetApp
        this.timer = setTimeout(() => {
            $(targetApp.dataset.openApp).show()
            this.resetFields()
        }, this.delay)
    }

    fileOpen(targetApp) {
        if (this.clicks === 0) {
            this.openNewTarget(targetApp)
        } else if (targetApp === this.target) {
            clearTimeout(this.timer)
            this.selectFile(targetApp)
            this.resetFields()
        } else {
            clearTimeout(this.timer)
            this.resetFields()
            this.openNewTarget(targetApp)
        }
    }
}

class Grid {

    constructor(desk, file) {
        this.desktop = desk
        this.filesize = file

        this.fileOffsetX = 20;
        this.fileOffsetY = 7;

        this.width = Math.floor(this.desktop.offsetWidth / (this.filesize.offsetWidth + this.fileOffsetX)) - 1
        this.height = Math.floor(this.desktop.offsetHeight / (this.filesize.offsetHeight + this.fileOffsetY)) - 1
        this.screenOffsetX = this.filesize.offsetWidth + (this.desktop.offsetWidth % (this.filesize.offsetWidth + this.fileOffsetX))
        this.screenOffsetY = this.filesize.offsetHeight + (this.desktop.offsetHeight % (this.filesize.offsetHeight + this.fileOffsetY))
        
        console.log(this.width, this.height);
        this.data = new Array(this.width * this.height)
        for (let i = 0; i < this.data.length; i++) {
            let x = ((i % this.width) * this.filesize.offsetWidth) + (this.screenOffsetX / 2) + ((i % this.width) * this.fileOffsetX) + this.fileOffsetX
            let y = Math.floor(i / this.width) * this.filesize.offsetHeight + (this.screenOffsetY / 2) + (Math.floor(i / this.width) * this.fileOffsetY) + this.fileOffsetY
            this.data[i] = { posX: x, posY: y, occupied: false }
            //createNewFile(y, x, i + 1, this.desktop)
        }
    }

    checkCoordinates(x, y) {
        // TODO
    }

    nodeFromPoint(x, y) {
        let percentX = ((x + (this.filesize.offsetWidth / 2)) / this.desktop.offsetWidth)
        let percentY = ((y + (this.filesize.offsetHeight / 2)) / this.desktop.offsetHeight)
        
        let arrayX = Math.floor(this.width * percentX)
        let arrayY = Math.floor(this.height * percentY)

        return this.data[arrayX + arrayY * this.width]
    }

    /* get(x, y) {
        this.checkCoordinates(x, y)
        return this.data[x + y * this.width]
    }

    set(x, y, value) {
        this.checkCoordinates(x, y)
        this.data[x + y * this.width] = value
    } */
}

function createNewFile (top, left, name, desktop) {
    const desktopFile = document.createElement('div')
    desktopFile.classList.add('desktopFile')
    desktopFile.addStyle('top', calculateRelativeUnits(top, 'vh'))
    desktopFile.addStyle('left', calculateRelativeUnits(left, 'vw'))

    const desktopFileIcon = document.createElement('i')
    desktopFileIcon.classList.add('desktopFileIcon', 'fas', 'fa-file-alt')

    const desktopFileTitle = document.createElement('div')
    desktopFileTitle.classList.add('desktopFileTitle')
    desktopFileTitle.textContent = name

    desktopFile.appendChild(desktopFileIcon)
    desktopFile.appendChild(desktopFileTitle)
    desktop.appendChild(desktopFile)
}
