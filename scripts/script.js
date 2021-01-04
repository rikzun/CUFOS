function changeLang(lang) {
    for (const node of findAll('[data-key]')) {
        const key = node.dataset.key

        const translated = translate(key)
        node.textContent = translated
    }
}

$(() => {
//----------
//  global
//----------
    //replace keys to string
    changeLang(localStorage.currentLang)

    //gen id
    for (const node of findAll('[data-id]')) {
        node.id = genID()
        delete node.dataset.id
    }

    //change lang func
    $('#change_lang').mousedown(() => {
        switch (localStorage.currentLang) {
            case 'en':
                localStorage.currentLang = 'ru'
                changeLang('ru')
                break

            case 'ru':
                localStorage.currentLang = 'en'
                changeLang('en')
                break
        }
    })

    $('#change_click_single').mousedown(() => {
        localStorage.openClick = 'single'
    })

    $('#change_click_double').mousedown(() => {
        localStorage.openClick = 'double'
    })

//-----------------
//  desktop files
//-----------------
    //clear selection
    $('body').click((event) => {
        if (data.switches.selectedFile) return
        for (const node of findAll('.desktopFile.desktopFileActive')) {
            node.classList.remove('desktopFileActive')
        }
    })

    //open or selected file
    $('.desktopFile').click((event) => {
        if (localStorage.openClick == 'single' && !data.switches.draggableWinIcon) {
            data.fileController.fileOpen(event.currentTarget)
        } else {
            data.fileController.fileClick(event.currentTarget)
        }
    })

    //move desktop files
    $('.desktopFile').draggable({
        cursor: 'default',
        start: (event) => {
            event.target.style.backgroundColor = 'inherit'
            data.switches.draggableWinIcon = true
        },
        stop: async (event, ui) => {
            const posOnGrid = data.grid.nodeFromPoint(ui.offset.left, ui.offset.top)
            if (posOnGrid.occupied) {
                posOnGrid.posX = ui.originalPosition.left
                posOnGrid.posY = ui.originalPosition.top
            } else {
                const oldPosOnGrid = data.grid.nodeFromPoint(ui.originalPosition.left, ui.originalPosition.top)
                data.grid.setOccupied(posOnGrid)
                data.grid.setUnoccupied(oldPosOnGrid)
            }
            
            event.target.style.top = vh(posOnGrid.posY)
            event.target.style.left = vw(posOnGrid.posX)

            await wait(100)
            data.switches.draggableWinIcon = false
        }
    })

    //recreate grid on window resize
    $(window).resize(() => {
        clearTimeout(window.onResizeFinished);
        window.onResizeFinished = setTimeout(() => {
            data.grid = new Grid(find('.desktop'), find('.desktopFile'))
        }, 300)
    })

    //change cursor style
    $('.desktopFile').hover((eventIn) => {
        if(eventIn.handleObj.origType !== 'mouseenter') return

        if (localStorage.openClick == 'single') {
            $('body').click()
            eventIn.currentTarget.style.cursor = 'pointer'
            data.fileController.selectionOneClickTimer = setTimeout(() => {
                data.fileController.selectFile(eventIn.currentTarget)
            }, 300)
        } else {
            eventIn.currentTarget.style.cursor = 'default'
        }
    }, (eventOut) => {
        if(data.fileController.selectionOneClickTimer) {
            clearTimeout(data.fileController.selectionOneClickTimer)
        }
    })

//----------
//  others
//----------
    //desktop selection div
    $('*')
    .mouseup((event) => {
        data.selectionBox.end()
    })
    .mousedown((event) => {
        if (event.target.className !== 'desktop') return
        data.selectionBox.start(event.pageY, event.pageX)
    })
    .mousemove((event) => {
        if (event.buttons !== 1 || data.selectionBox.top == null) return
        data.selectionBox.resize(event.pageY, event.pageX)
    })

    //clock
    setInterval(() => {
        const date = new Date()
        find('#taskbarClock').textContent = 
        `${translate(`WEEKDAY${date.getDay()}`)} ${strftime(date, '%H:%M:%S')}`
    }, 1000)

//-------------
//  dropdowns
//-------------
    $('.taskbarElement[data-open-dropdown]')
    .mousedown((event) => {
        if (event.buttons !== 1) return
        const parent = event.currentTarget
        const dropdown = find(`[data-dropdown="${parent.dataset.openDropdown}"]`)

        data.ddController.click(parent, dropdown)
    })
    .hover((event) => {
        if (!data.ddController.hoverMode) return
        if (event.handleObj.origType !== 'mouseenter') return

        const parent = event.currentTarget
        const dropdown = find(`[data-dropdown="${parent.dataset.openDropdown}"]`)

        data.ddController.hover(parent, dropdown)
    })

    $('body').mousedown(async(event) => {
        if (event.buttons !== 1) return
        if (!data.ddController.close) return
        data.ddController.hide(true)
    })

//---------------
//  contextmenu
//---------------
    $('body').bind('contextmenu', () => { return false })

    $('[data-ctxm-type]').mousedown((event) => {
        if (event.buttons !== 2) return

        data.ctxmController.click(event)
    })

    $('body').mousedown((event) => {
        if (event.buttons !== 1) return
        data.ctxmController.hide()
    })
})
