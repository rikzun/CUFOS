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
    grid: new Grid($('.desktop')[0], $('.desktopFile')[0])
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
            let posOnGrid = data.grid.nodeFromPoint(ui.position.left, ui.position.top)
            event.target.style.top = calculateRelativeUnits(posOnGrid.posY, 'vh')
            event.target.style.left = calculateRelativeUnits(posOnGrid.posX, 'vw')

            await wait(100)
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
        $('body').click()
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
    function showDropdown(dropdown, parent, multilevel) {
        parent.classList.add('taskbarElementActive')
        dropdown.classList.add('dropdownActive')

        let top = parent.parentNode.parentNode.offsetTop + parent.parentNode.parentNode.offsetHeight
        //shit for normal top, checking padding and border dropdown class
        if (multilevel) top = parent.getBoundingClientRect().top - Number(getComputedStyle(parent.parentNode).padding.split(' ')[0].replace('px', '')) - 1

        function checkOverflow(left) {
            if (left + dropdown.offsetWidth > window.innerWidth) {
                left -= ((left + dropdown.offsetWidth) - window.innerWidth)
            } else if (left < 0) {
                left =0
            }
            return left
        }

        switch (parent.dataset.dropdownAlign) {
            case 'left': {
                const left = checkOverflow(parent.offsetLeft)

                dropdown
                    .addStyle('left', calculateRelativeUnits(left, 'vw'))
                    .addStyle('top', calculateRelativeUnits(top, 'vh'))
                break
            }

            case 'center': {
                const left = checkOverflow(parent.offsetLeft + (parent.offsetWidth - dropdown.offsetWidth) / 2)

                dropdown
                    .addStyle('left', calculateRelativeUnits(left, 'vw'))
                    .addStyle('top', calculateRelativeUnits(top, 'vh'))
                break
            }

            case 'right': {
                let left = checkOverflow(parent.offsetLeft + parent.offsetWidth - dropdown.offsetWidth)
                if (multilevel) left = parent.getBoundingClientRect().left + parent.getBoundingClientRect().width
                
                dropdown
                    .addStyle('left', calculateRelativeUnits(left, 'vw'))
                    .addStyle('top', calculateRelativeUnits(top, 'vh'))
                break
            }
                
        }
    }

    function hideDropdowns() {
        for (const node of document.querySelectorAll('.taskbarElementActive[data-open-dropdown]')) {
            node.classList.remove('taskbarElementActive')
        }

        for (const node of document.querySelectorAll('.dropdown.dropdownActive')) {
            node.classList.remove('dropdownActive')
        }
    }

    $('[data-open-dropdown]')
    .click(async (event) => {
        const parent = event.currentTarget
        const dropdown = $(`[data-dropdown="${parent.dataset.openDropdown}"]`)[0]

        if (dropdown.classList.contains('dropdownActive')) {
            hideDropdowns()
            data.switches.activeDropdown = false
            return
        }

        hideDropdowns()
        showDropdown(dropdown, parent)
        await wait(50)
        data.switches.activeDropdown = true
    })
    .hover((event) => {
        if (!data.switches.activeDropdown) return
        if (event.handleObj.origType !== 'mouseenter' && event.handleObj.origType !== 'mouseleave') return
            
        const parent = event.currentTarget
        const dropdown = $(`[data-dropdown="${parent.dataset.openDropdown}"]`)[0]

        if (parent.classList.contains('dropdown-item')) {
            showDropdown(dropdown, parent, true)
            return
        }
        if (dropdown.classList.contains('dropdownActive')) return
        
        hideDropdowns()
        showDropdown(dropdown, parent)
    })

    $('body').click(() => {
        if (!data.switches.activeDropdown) return
        hideDropdowns()
        data.switches.activeDropdown = false
    })
})
