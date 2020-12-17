//-------------------------------------------------------------
// Classes -- WARNING!! REFACTORING ZONE!! TOO MUCH WET CODE!!
//-------------------------------------------------------------

class FilesController {
    constructor() {
        this.delay = 700
        this.clicks = 0
        this.timer = null
        this.target = null
    }

    resetFields() {
        this.clicks = 0
        this.timer = null
    }

    selectNewTarget(targetApp) {
        this.clicks++
        selectFile(targetApp)
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
            selectFile(targetApp)
            this.resetFields()
        } else {
            clearTimeout(this.timer)
            this.resetFields()
            this.openNewTarget(targetApp)
        }
    }
}

async function selectFile(node) {
    $('body').click()
    data.switches.selectedFile = true
    node.classList.add('desktopFileActive')

    await wait(50)
    data.switches.selectedFile = false
}
