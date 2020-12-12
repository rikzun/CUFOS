const data = {
    mouse: {
        start: {},
    },
    switches: {
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
        if (data.switches.selectedFile) return
        for (const node of document.querySelectorAll('.desktopFile.desktopFileActive')) {
            node.classList.remove('desktopFileActive')
        }
    })

    //open or selected file
    $(".desktopFile")
    .dblclick(event => {
        if (localStorage.openClick == 'double') {
            $(event.currentTarget.dataset.openApp).show()
        } else {
            selectFile(event.currentTarget)
        }
    })
    .click(event => {
        if (localStorage.openClick == 'single') {
            $(event.currentTarget.dataset.openApp).show()
        } else {
            selectFile(event.currentTarget)
        }
    })

    async function selectFile(node) {
        $('body').click()
        data.switches.selectedFile = true
        node.classList.add('desktopFileActive')
    
        await wait(50)
        data.switches.selectedFile = false
    }

    //move desktop files
    $(".desktopFile").draggable({
        cursor: 'default',
        start: event => {
            event.target.style.backgroundColor = 'inherit'
            data.switches.draggableWinIcon = true
        },
        stop: (event, ui) => {
            event.target.style.top = calculateRelativeUnits(ui.position.top, 'vh')
            event.target.style.left = calculateRelativeUnits(ui.position.left, 'vw')
            data.switches.draggableWinIcon = false
        }
    })

    //change cursor style 
    $(".desktopFile").hover(event => {
        switch (event.handleObj.origType) {
            case "mouseenter":
                if (localStorage.openClick == 'single') {
                    $('body').click()
                    event.currentTarget.style.cursor = 'pointer'
                    event.currentTarget.classList.add('desktopFileActive')
                } else {
                    event.currentTarget.style.cursor = 'default'
                }
                break;
            
            case "mouseleave":
            
                break;
        }
    })

//---------
// windows
//---------
    //move and resize window
    $(".window").draggable({
        cursor: 'default',
        cancel: ".windowTitleButtons",
        handle: "div[data-handler]",
        start: event => {},
        stop: event => {}
    }).resizable({
        handles: "all"
    })

    //close window button
    $("div[data-win-act='close']").click(event => {
        let window = event.currentTarget
        for (let i = 0; i < 5; i++) {
            window = window.parentElement
            if (window.classList.contains('window') && window.id) break
        }
        window.style.display = "none"
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
        if (event.buttons !== 1 || data.switches.draggableWinIcon || Object.keys(data.mouse.start).length == 0) return
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
        `${translate(`WEEKDAY${date.getDay()}`)} ${strftime(date, '%H:%M')}`
 //     `${translate(`WEEKDAY${date.getDay()}`)} ${strftime(date, '%H:%M:%S')}`
    }, 1000)
})