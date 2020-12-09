const data = {
    windows: {
        maximize: {}
    },
    mouse: {
        start: {},
        draggableWinIcon: false,
        selectedFile: false
    }
}

function changeLang(lang) {
    for (const node of document.querySelectorAll('p[data-default-string]')) {
        const key = node.dataset.defaultString
        if (!translateStrings.hasOwnProperty(key)) {node.textContent = key; continue}
        node.textContent = translate(key)
    }
}

$(() => {
//--------
// global
//--------
    //off contextmenu
    $('body').bind('contextmenu', event => {
    	return false
    })
    
    //replace keys to string
    changeLang(localStorage.currentLang)

    //gen id
    for (const node of document.querySelectorAll('#gen')) {
        node.id = '_' + Math.random().toString(36).substr(2, 9);
    }

    //change lang func
    $("#change_lang").click(() => {
        switch (localStorage.currentLang) {
            case 'en':
                localStorage.currentLang = 'ru'
                changeLang('ru')
                break;

            case 'ru':
                localStorage.currentLang = 'en'
                changeLang('en')
                break;
        }
    })

    $("#change_click_single").click(() => {
        localStorage.openClick = 'single'
    })

    
    $("#change_click_double").click(() => {
        localStorage.openClick = 'double'
    })
//---------------
// desktop files
//---------------
    //clear selection
    $("body").click(event => {
        if (data.mouse.selectedFile) return
        for (const node of document.querySelectorAll('.desktopFile.desktopFileActive')) {
            node.classList.remove('desktopFileActive')
        }
    })

    //open or selected file
    $(".desktopFile").dblclick(event => {
        if (localStorage.openClick == 'double') {
            $(event.currentTarget.dataset.openApp).show()
        } else {
            selectFile(event.currentTarget)
        }
    })

    //open or selected file
    $(".desktopFile").click(event => {
        if (localStorage.openClick == 'single') {
            $(event.currentTarget.dataset.openApp).show()
        } else {
            selectFile(event.currentTarget)
        }
    })

    async function selectFile(node) {
        $('body').click()
        data.mouse.selectedFile = true
        node.classList.add('desktopFileActive')
    
        await wait(50)
        data.mouse.selectedFile = false
    }

    //move desktop files
    $(".desktopFile").draggable({
        cursor: 'default',
        start: event => {
            event.target.style.backgroundColor = 'inherit'
            data.draggableWinIcon = true
        },
        stop: (event, ui) => {
            event.target.style.top = calculateRelativeUnits(ui.position.top, 'vh')
            event.target.style.left = calculateRelativeUnits(ui.position.left, 'vw')
            data.draggableWinIcon = false
        }
    })

    //change cursor style 
    $(".desktopFile").hover(event => {
        if (localStorage.openClick == 'single') {
            event.currentTarget.style.cursor = 'pointer'
        } else {
            event.currentTarget.style.cursor = 'default'
        }
    })

//---------
// windows
//---------
    //move and resize window
    $(".window").draggable({
        cursor: 'default',
        cancel: ".windowTitleButtons",
        handle: ".windowTitleBar",
        start: event => {},
        stop: event => {}
    }).resizable({
		handles: "all",
        minHeight: 150,
        minWidth: 200
    })

    //close window button
    $("div[data-win-act='close']").click(event => {
        const node = event.currentTarget.parentElement.parentElement.offsetParent
        node.style.display = "none"
    })

//--------
// others
//--------
    //desktop selection div
    $('*')
    .mouseup(event => {
        data.mouse.start = {}
        $('.selectionBox').removeAttr('style')
    })
    .mousedown(event => {
        if (event.target.className !== 'desktop') return
        data.mouse.start = {y: event.pageY, x: event.pageX}
    })
    .mousemove(event => {
        if (event.buttons !== 1 || data.draggableWinIcon || Object.keys(data.mouse.start).length == 0) return
        const selectionBox = $('.selectionBox')[0]
        selectionBox.style.display = 'block'
        selectionBox.style.top = data.mouse.start.y + 'px'
        selectionBox.style.left = data.mouse.start.x + 'px'

        let height = event.pageY - data.mouse.start.y
        let width = event.pageX - data.mouse.start.x

        if (height == 0 || width == 0) selectionBox.style.display = 'none'
        if (height < 0) {
            height = Math.abs(height)
            selectionBox.style.top = data.mouse.start.y - height + 'px'
        }
        if (width < 0) {
            width = Math.abs(width)
            selectionBox.style.left = data.mouse.start.x - width + 'px'
        }

        selectionBox.style.height = height + 'px'
        selectionBox.style.width = width + 'px'
    })

    //clock
    setInterval(()=>{
        const date = new Date()
        $('#taskbarClock')[0].textContent = 
        `${translate(`WEEKDAY${date.getDay()}`)} ${strftime(date, '%H:%M:%S')}`
    }, 1000)
})