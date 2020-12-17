const data = {
    mouse: {
        start: {},
    },
    switches: {
        draggableWinIcon: false,
        selectedFile: false,
        activeDropdown: false
    },
    fileController: new FilesController(localStorage.clickDelay)
}

function changeLang(lang) {
    for (const node of document.querySelectorAll('p[data-default-string]')) {
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
    for (const node of document.querySelectorAll('#gen')) {
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
        for (const node of document.querySelectorAll('.desktopFile.desktopFileActive')) {
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
            event.target.style.top = calculateRelativeUnits(ui.position.top, 'vh')
            event.target.style.left = calculateRelativeUnits(ui.position.left, 'vw')

            await wait(500)
            data.switches.draggableWinIcon = false
        }
    })

    //change cursor style
    $('.desktopFile').hover((event) => {
        if(event.handleObj.origType !== 'mouseenter') return

        if (localStorage.openClick == 'single') {
            $('body').click()
            event.currentTarget.style.cursor = 'pointer'
            event.currentTarget.classList.add('desktopFileActive')
        } else {
            event.currentTarget.style.cursor = 'default'
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
        stop: (event) => {},
    })
    .resizable({
        handles: 'all',
    })

    //close window button
    $("div[data-win-act='close']").click((event) => {
        let window = event.currentTarget
        for (let i = 0; i < 5; i++) {
            window = window.parentElement
            if (window.classList.contains('window') && window.id) break
        }
        window.style.display = 'none'
    })

//----------
//  others
//----------
    //desktop selection div
    $('*')
    .mouseup((event) => {
        data.mouse.start = {}
        $('.selectionBox').removeAttr('style')
    })
    .mousedown((event) => {
        if (event.target.className !== 'desktop') return
        data.mouse.start = { y: event.pageY, x: event.pageX }
    })
    .mousemove((event) => {
        if (event.buttons !== 1 || data.switches.draggableWinIcon || Object.keys(data.mouse.start).length == 0) return
        const selectionBox = $('.selectionBox')[0]
            .addStyle('display', 'block')
            .addStyle('top', data.mouse.start.y + 'px')
            .addStyle('left', data.mouse.start.x + 'px')

        let height = event.pageY - data.mouse.start.y
        let width = event.pageX - data.mouse.start.x

        if (height == 0 || width == 0) selectionBox.style.display = 'none'
        if (height < 0) {
            height = Math.abs(height)
            selectionBox.addStyle('top', data.mouse.start.y - height + 'px')
        }
        if (width < 0) {
            width = Math.abs(width)
            selectionBox.addStyle('left', data.mouse.start.x - width + 'px')
        }

        selectionBox
            .addStyle('height', height + 'px')
            .addStyle('width', width + 'px')
    })

    //clock
    setInterval(() => {
        const date = new Date()
        $('#taskbarClock')[0].textContent = 
        `${translate(`WEEKDAY${date.getDay()}`)} ${strftime(date, '%H:%M:%S')}`
    }, 1000)

//-------------
//  dropdowns
//-------------
    function hideDropdowns() {
        for (const node of document.querySelectorAll('.dropdown.dropdownActive')) {
            node.classList.remove('dropdownActive')
        }
    }

    function showDropdown(dropdown, parent) {
        dropdown.classList.add('dropdownActive')
        switch (dropdown.dataset.dropdownAlign) {
            case 'left':
                dropdown
                    .addStyle('left', calculateRelativeUnits(
                        parent.offsetLeft, 'vw'))
                    .addStyle('top', calculateRelativeUnits(
                        parent.offsetTop + parent.offsetHeight, 'vh'))
                break

            case 'center':
                dropdown
                    .addStyle('left', calculateRelativeUnits(
                        parent.offsetLeft + (parent.offsetWidth - dropdown.offsetWidth) / 2, 'vw'))
                    .addStyle('top', calculateRelativeUnits(
                        parent.offsetTop + parent.offsetHeight, 'vh'))
                break

            case 'right':
                dropdown
                    .addStyle('left', calculateRelativeUnits(
                        parent.offsetLeft + parent.offsetWidth - dropdown.offsetWidth, 'vw'))
                    .addStyle('top', calculateRelativeUnits(
                        parent.offsetTop + parent.offsetHeight, 'vh'))
                break
        }
    }

    $('.taskbarElement:not(.noDropdown)')
    .click(async (event) => {
        const parent = event.currentTarget
        const dropdown = $(`[data-dropdown="${parent.dataset.openDropdown}"]`)[0]

        if (dropdown.classList.contains('dropdownActive')) {
            dropdown.classList.remove('dropdownActive')
            data.switches.activeDropdown = false
            return
        }

        hideDropdowns()
        showDropdown(dropdown, parent)
        await wait(50)
        data.switches.activeDropdown = true
    })
    .hover((event) => {
        if (!data.switches.activeDropdown || !event.handleObj.origType == 'mouseenter') return
        const parent = event.currentTarget
        const dropdown = $(`[data-dropdown="${parent.dataset.openDropdown}"]`)[0]

        hideDropdowns()
        showDropdown(dropdown, parent)
    })

    $('body').click((event) => {
        if (!data.switches.activeDropdown) return
        console.log('body')
        hideDropdowns()
        data.switches.activeDropdown = false
    })
})
