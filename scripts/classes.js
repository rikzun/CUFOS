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
        
        // console.log(this.width, this.height); baka senpai
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

class SelectionBox {
    constructor(node) {
        this.target = node
        this.top = null
        this.left = null
    }

    start(pageY, pageX) {
        this.top = pageY
        this.left = pageX
    }

    end() {
        this.top = null
        this.left = null
        $(this.target).removeAttr('style')
    }

    resize(pageY, pageX) {
        this.target.addStyle('display', 'block')

        let top = this.top
        let left = this.left 
        let height = pageY - this.top
        let width = pageX - this.left

        if (height == 0 || width == 0) this.target.addStyle('display', 'none')
        if (height < 0) {height = Math.abs(height); top = this.top - height}
        if (width < 0) {width = Math.abs(width); left = this.left - width}

        this.target
            .addStyle('top', top + 'px')
            .addStyle('left', left + 'px')
            .addStyle('height', height + 'px')
            .addStyle('width', width + 'px')
    }
}

class DropdownController {
    constructor() {
        this.dropdown = null
        this.parent = null
        this.hoverMode = false
        this.close = false
        // this.mlvlda = []
    }

    checkOverflow(left) {
        if (left + this.dropdown.offsetWidth > window.innerWidth) {
            left -= ((left + this.dropdown.offsetWidth) - window.innerWidth)
        } else if (left < 0) { left = 0 }
        return left
    }

    click(parent, dropdown) {
        if (this.dropdown == dropdown && this.parent == parent) { 
            this.hide()
            this.hoverMode = false
            this.close = false
            return
        }
        if (this.dropdown !== null && parent.classList.contains('taskbarElement')) this.hide()

        this.dropdown = dropdown
        this.parent = parent
        this.hoverMode = true
        this.show(!parent.classList.contains('taskbarElement'))
    }

    async show(multilvl) {
        this.dropdown.classList.add('dropdownActive')
        this.parent.classList.add('taskbarElementActive')

        let top = find('.taskbar').getBoundingClientRect().bottom + 'px'
        let left

        if (multilvl) top = this.parent.getBoundingClientRect().top - getComputedStyle(find('.dropdown')).padding.split(' ')[0].replace('px', '') - 1

        switch (this.parent.dataset.dropdownAlign) {
            case 'left':
                left = this.checkOverflow(this.parent.getBoundingClientRect().left)
                break

            case 'center': 
                left = this.checkOverflow(this.parent.offsetLeft + (this.parent.offsetWidth - this.dropdown.offsetWidth) / 2)
                break

            case 'right':
                left = this.checkOverflow(this.parent.getBoundingClientRect().right)
                break
        }

        this.dropdown
            .addStyle('left', vw(left))
            .addStyle('top', vh(top))

        await wait(50)
        this.close = true
    }

    hide(click) {
        this.dropdown.classList.remove('dropdownActive')
        this.parent.classList.remove('taskbarElementActive')
        
        this.dropdown = null
        this.parent = null
        if (click) {
            this.hoverMode = false
            this.close = false
        }
    }

    hover(parent, dropdown) {
        this.hide()

        this.dropdown = dropdown
        this.parent = parent
        this.show(!parent.classList.contains('taskbarElement'))
    }

    // multilvlOpen(parent, dropdown) {
    //     this.mlvlda.push(dropdown.dataset.dropdown)

    //     console.log(this.mlvlda)
    // }
}