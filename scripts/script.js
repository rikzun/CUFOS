const data = {
    mouse: {
        start: {},
    },
    switches: {
        draggableWinIcon: false,
        selectedFile: false,
        activeDropdown: false
    },
    fileController: new FilesController(localStorage.clickDelay),
    grid: new Grid(find('.desktop'), find('.desktopFile')),
    selectionBox: new SelectionBox(find('.selectionBox')),
    ddController: new DropdownController()
}

function changeLang(lang) {
    for (const node of findAll('p[data-default-string]')) {
        const key = node.dataset.defaultString
        if (!translateStrings.hasOwnProperty(key)) { node.textContent = key; continue }
        node.textContent = translate(key)
    }
}

$(() => {
//----------
//  global
//----------
    //off contextmenu
    $('body').bind('contextmenu', (event) => {
        return false
    })

    //replace keys to string
    changeLang(localStorage.currentLang)

    //gen id
    for (const node of findAll('#gen', true)) {
        node.id = '_' + Math.random().toString(36).substr(2, 9)
    }

    //change lang func
    $('#change_lang').click(() => {
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

    $('#change_click_single').click(() => {
        localStorage.openClick = 'single'
    })

    $('#change_click_double').click(() => {
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
            const posOnGrid = data.grid.nodeFromPoint(ui.position.left, ui.position.top)
            event.target.style.top = vh(posOnGrid.posY)
            event.target.style.left = vw(posOnGrid.posX)

            await wait(100)
            data.switches.draggableWinIcon = false
        }
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

//-----------
//  windows
//-----------
    //move and resize window
    $('.window').draggable({
        cursor: 'default',
        cancel: '.windowTitleButtons',
        handle: 'div[data-handler]',
        start: (event) => {},
        stop: (event, ui) => {
            event.target
                .addStyle('top', vh(ui.position.top))
                .addStyle('left', vw(ui.position.left))
        }
    })
    .resizable({
        handles: 'all'
    })

    //close window button
    $("div.buttonClose").click((event) => {
        let window = event.currentTarget
        for (let i = 0; i < 5; i++) {
            window = window.parentElement
            if (window.classList.contains('window') && window.id) break
        }
        window.addStyle('display', 'none')
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
    .click((event) => {
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

    $('.dropdown-item[data-open-dropdown]').hover((event) => {
        const parent = event.currentTarget
        const dropdown = find(`[data-dropdown="${parent.dataset.openDropdown}"]`)

        switch (event.handleObj.origType) {
            case 'mouseenter':
                data.ddController.multilvlShow(parent, dropdown)
                break

            case 'mouseleave':
                data.ddController.multilvlHide(parent, dropdown)
                break
        }
    })

    $('.dropdown[data-dropdown-type="multilevel"]').hover((event) => {
        const parent = event.currentTarget
        const dropdown = find(`[data-dropdown="${parent.dataset.dropdown}"]`)

        data.ddController.multilvlHover(event.handleObj.origType, parent, dropdown)
    })

    $('body').click(() => {
        if (!data.ddController.close) return
        data.ddController.hide(true)
    })
})
