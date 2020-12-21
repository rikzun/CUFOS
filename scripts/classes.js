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

        //calculation grid size with considering offsets (-1 stands for file)
        this.width = Math.floor(this.desktop.offsetWidth / (this.filesize.offsetWidth + this.fileOffsetX)) - 1
        this.height = Math.floor(this.desktop.offsetHeight / (this.filesize.offsetHeight + this.fileOffsetY)) - 1

        //indents from screen boundaries. Using spare file and remainder after division of expression above
        this.screenOffsetX = this.filesize.offsetWidth + (this.desktop.offsetWidth % (this.filesize.offsetWidth + this.fileOffsetX))
        this.screenOffsetY = this.filesize.offsetHeight + (this.desktop.offsetHeight % (this.filesize.offsetHeight + this.fileOffsetY))
        
        // console.log(this.width, this.height); baka senpai
        this.data = new Array(this.width * this.height)
        for (let i = 0; i < this.data.length; i++) {
            /** 
            * In one-dimentional array X always represents as "X mod width" due to looping 0-width values.
            * Y represents as float value until reached "width", thus on every row it's increments.
            */
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
        //unity-based normalization
        //https://en.wikipedia.org/wiki/Feature_scaling 
        let percentX = (x / this.desktop.offsetWidth)
        let percentY = (y / this.desktop.offsetHeight)
        
        let arrayX = Math.round(this.width * percentX)
        let arrayY = Math.round(this.height * percentY)

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
        this.target = null
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
        if (this.dropdown !== null) this.hide()

        this.dropdown = dropdown
        this.parent = parent
        this.hoverMode = true
        this.show()
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
        if (click) {
            for (const dropdown of findAll('[data-dropdown].dropdownActive')) {
                dropdown.classList.remove('dropdownActive')
            }
            for (const dropdown of findAll('.taskbarElementActive')) {
                dropdown.classList.remove('taskbarElementActive')
            }
        } else {
            this.dropdown.classList.remove('dropdownActive')
            this.parent.classList.remove('taskbarElementActive')
        }
        
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
        this.show()
    }

    multilvlShow(parent, dropdown) {
        this.dropdown = dropdown
        this.parent = parent
        this.show(true)
    }

    async multilvlHide(parent, dropdown) {
        await wait(100)
        if (this.target == dropdown.dataset.dropdown) return

        this.dropdown = dropdown
        this.parent = parent
        this.hide()
    }

    multilvlHover(event, parent, dropdown) {
        switch (event) {
            case 'mouseenter':
                this.target = dropdown.dataset.dropdown
                break
        
            case 'mouseleave':
                const ddop = find(`[data-dropdown="${dropdown.dataset.dropdown}"] [data-open-dropdown]`)
                if (ddop)  {
                    const includeDropdown = find(`[data-dropdown="${ddop.dataset.openDropdown}"]`)
                    if(includeDropdown.classList.contains('dropdownActive')) return
                }
                
                this.target = null
                this.multilvlHide(parent, dropdown)
                break
        }
    }
}