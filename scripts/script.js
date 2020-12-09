const standardSettings = {
    currentLang: 'en'
}

for (const [key, value] of Object.entries(standardSettings)) {
    if (localStorage.hasOwnProperty(key) && localStorage[key] === value) continue
    localStorage.setItem(key, value)
}

const data = {
    windows: {
        maximize: {}
    },
    desktopMouse: {
        start: {},
        draggableWinIcon: false,
    }
}

// const folders = {
//     desktop: {
//         'unnamed.txt': {ico: '', openApp: '', index: 1}
//     }
// }

// const desktopIndices = {}

const translateStrings = {
    'TITLE1': {en: 'Title 1', ru: 'Заголовок 1'},
    'TITLE2': {en: 'Title 2', ru: 'Заголовок 2'},
    'CONTENT': {en: 'Content', ru: 'Содержание'},
    'SYSTEM': {en: 'System', ru: 'Система'},
    'PC': {en: 'PC', ru: 'ПК'},
    'CHANGE_LANG': {en: 'ENG', ru: 'РУС'},
    'WEEKDAY1': {en: 'Mon', ru: 'Пн'},
    'WEEKDAY2': {en: 'Tue', ru: 'Вт'},
    'WEEKDAY3': {en: 'Wed', ru: 'Ср'},
    'WEEKDAY4': {en: 'Thu', ru: 'Чт'},
    'WEEKDAY5': {en: 'Fri', ru: 'Пт'},
    'WEEKDAY6': {en: 'Sat', ru: 'Сб'},
    'WEEKDAY0': {en: 'Sun', ru: 'Вс'}
}

function calculateDesktopIndices() {
    const sizes = {
        desktopW: Number(getComputedStyle($('.desktop')[0]).width.replace('px', '')), 
        desktopH:
            Number(getComputedStyle($('.desktop')[0]).height.replace('px', '')) 
            - 
            Number(getComputedStyle($('.taskbar')[0]).height.replace('px', '')),
        fileW: Number(getComputedStyle($('.desktopFile')[0]).width.replace('px', '')),
        fileH: Number(getComputedStyle($('.desktopFile')[0]).height.replace('px', '')),
        _distance: (window.innerWidth * 0.9375) / 100
    }
    console.log(sizes.desktopW / (sizes.fileW + 10))
}

function translate(lang) {
    for (const node of document.querySelectorAll('p[data-default-string]')) {
        const translated = node.dataset.defaultString
        if (!translateStrings.hasOwnProperty(translated)) {node.textContent = translated; continue}
        node.textContent = translateStrings[translated][lang]
    }
    console.log(`language changed to ${lang}`)
}

function genid(nodeList) {
    for (const node of nodeList) {
        node.id = '_' + Math.random().toString(36).substr(2, 9);
    }
    console.log('all id generated')
}

function calculateRelativeUnits(px, direction) {
    if (typeof px == 'number') px = String(px)
    const directionSize = {'vh': window.innerHeight, 'vw': window.innerWidth}

    return (px.replace('px', '') / directionSize[direction]) * 100 + direction
}

function strftime(date, format) {
    if (date < 0) date = 0

    const matches = format.match(/%(d|m|y|H|M|S)/g)
    const dtfunc = {
        'd': new Date(date).getUTCDate(),
        'm': new Date(date).getUTCMonth() + 1,
        'y': new Date(date).getUTCFullYear(),
        'H': new Date(date).getUTCHours(),
        'M': new Date(date).getUTCMinutes(),
        'S': new Date(date).getUTCSeconds(),
    }

    matches.forEach(e => {
        let value = dtfunc[e.replace('%', '')]
        if (value < 10) {
          value = `0${value}`
        }
  
        format = format.replace(e, value)
    })

    return format
}

$(() => {
    // off contextmenu
	$('body').bind('contextmenu', event =>{
		return false
    })
    
    //startup settings
    translate(localStorage.getItem('currentLang'))
    genid(document.querySelectorAll('#gen'))
    calculateDesktopIndices()

    //clear all selected files
    $("*[data-type='active']").click(event => {
        // console.log(event)
        if (!event.target.dataset.type) return

        for (const node of document.querySelectorAll('.desktopFile.desktopFileActive')) {
            node.classList.remove('desktopFileActive')
        }
    })

    //open windows
    $(".desktopFile[data-open-app]").dblclick(event => {
        $(event.currentTarget.dataset.openApp).show()
    })

    //move desktop files
    $(".desktopFile").draggable({
        cursor: 'auto',
        start: event => {
            event.target.style.backgroundColor = 'inherit'
            data.draggableWinIcon = true
        },
        stop: (event, ui) => {
            event.target.style.top = calculateRelativeUnits(ui.position.top, 'vh')
            event.target.style.left = calculateRelativeUnits(ui.position.left, 'vw')
            event.target.style.backgroundColor = ''
            data.draggableWinIcon = false
        }
    })
    
    //select desktop files
    $(".desktopFile").click(event => {
        $(".desktop").click()
        if (event.currentTarget.classList.contains('desktopFileActive')) return
        event.currentTarget.classList.add('desktopFileActive')
    })

    //move and resize window
    $(".window").draggable({
        cursor: 'move',
        cancel: ".windowTitleButtons",
        handle: ".windowTitleBar",
        start: event => {
            const node = event.currentTarget
            if (!data.windows.maximize.hasOwnProperty(node.id)) return

            node.style.width = data.windows.maximize[node.id].width
            node.style.height = data.windows.maximize[node.id].height
            delete data.windows.maximize[node.id]
        },
        stop: event => {}
    }).resizable({
		handles: "all",
        minHeight: 150,
        minWidth: 200
    })

    //change lang func
    $("#change_lang").click(() => {
        switch (localStorage.getItem('currentLang')) {
            case 'en':
                localStorage.setItem('currentLang', 'ru')
                translate('ru')
                break;

            case 'ru':
                localStorage.setItem('currentLang', 'en')
                translate('en')
                break;
        }
    })
    
    //maximize window button
    $("svg[data-win-act='maximize']").click(event => {
        const node = event.currentTarget.parentElement.parentElement.offsetParent

        //return past values
        if (data.windows.maximize.hasOwnProperty(node.id)) {
            node.style.width = data.windows.maximize[node.id].width
            node.style.height = data.windows.maximize[node.id].height
            node.style.top = data.windows.maximize[node.id].top
            node.style.left = data.windows.maximize[node.id].left
            node.style.borderRadius = ".5vh"
            node.style.boxShadow = "0 0 1.6vh 0 rgba(0, 0, 0, 0.75)"
            delete data.windows.maximize[node.id]
            return
        }

        //save values
        data.windows.maximize[node.id] = {
            width: node.style.width, height: node.style.height,
            top: node.style.top, left: node.style.left,
        }

        $(node).removeAttr("style")
        node.style.top = calculateRelativeUnits(getComputedStyle(document.querySelector(".taskbar")).height, 'vh')
        node.style.left = "0vw"
        node.style.width = "99.8vw"
        node.style.height = "96.5vh"
        node.style.borderRadius = "0"
        node.style.boxShadow = "none"
    })

    //close window button
    $("svg[data-win-act='close']").click(event => {
        const node = event.currentTarget.parentElement.parentElement.offsetParent
        node.style.display = "none"
    })

    //desktop selection div
    $('body')
    .mouseup(event => {
        data.desktopMouse.start = {}
        $('.selectionBox').removeAttr('style')
    })
    .mousedown(event => {
        if (event.target.className !== 'desktop') return
        data.desktopMouse.start = {x: event.pageX, y: event.pageY}
    })
    .mousemove(event => {
        
        if (event.buttons !== 1 || data.draggableWinIcon || Object.keys(data.desktopMouse.start).length == 0) return
        const selectionBox = $('.selectionBox')[0]
        selectionBox.style.display = 'block'
        selectionBox.style.top = data.desktopMouse.start.y + 'px'
        selectionBox.style.left = data.desktopMouse.start.x + 'px'

        let height = event.pageY - data.desktopMouse.start.y
        let width = event.pageX - data.desktopMouse.start.x

        if (height == 0 || width == 0) selectionBox.style.display = 'none'
        if (height < 0) {
            height = Math.abs(height)
            selectionBox.style.top = data.desktopMouse.start.y - height + 'px'
        }
        if (width < 0) {
            width = Math.abs(width)
            selectionBox.style.left = data.desktopMouse.start.x - width + 'px'
        }

        selectionBox.style.height = height + 'px'
        selectionBox.style.width = width + 'px'
    })

    setInterval(()=>{
        const date = new Date()
        $('#taskbarClock')[0].textContent = 
        translateStrings[`WEEKDAY${date.getDay()}`][localStorage.getItem('currentLang')] + ' ' + strftime(date, '%H:%M:%S')
    }, 1000)
})