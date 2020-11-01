const settings = {
    currentLang: 0
}
const data = {
    supportLanguages: ['en', 'ru'],
    windows: {
        maximize: {}
    },
    desktopMouse: {
        start: {},
        draggableWinIcon: false,
        selection: false
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
	'CHANGE_LANG': {en: 'Change language', ru: 'Изменить язык'}
}

function calculateDesktopIndices() {
    const sizes = {
        desktopW: Number(getComputedStyle($('.desktop')[0]).width.replace('px', '')), 
        desktopH: Number(getComputedStyle($('.desktop')[0]).height.replace('px', '')),
        fileW: Number(getComputedStyle($('.desktopFile')[0]).width.replace('px', '')),
        fileH: Number(getComputedStyle($('.desktopFile')[0]).height.replace('px', '')),
        _distance: (window.innerWidth * 0.9375) / 100
    }
    console.log(
        Math.floor(sizes.desktopW / (sizes.fileW + sizes._distance))
        *
        Math.floor(sizes.desktopH / (sizes.fileH + sizes._distance))
    )
    console.log(sizes.desktopW / (sizes.fileW + sizes._distance))
    console.log(sizes.desktopH / (sizes.fileH + sizes._distance))
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

$(() => {
    // off contextmenu
	$('body').bind('contextmenu', (event)=>{
		return false
    })
    
    //startup settings
    translate(data.supportLanguages[settings.currentLang])
    genid(document.querySelectorAll('#gen'))
    calculateDesktopIndices()

    //clear all selected files
    $(".desktop").click((event)=>{
        if (!event.target.classList.contains('desktop')) return

        for (const node of document.querySelectorAll('.desktopFile.desktopFileActive')) {
            node.classList.remove('desktopFileActive')
        }
    })

    //open windows
    $(".desktopFile[data-open-app]").dblclick((event)=>{
        $(event.currentTarget.dataset.openApp).show()
    })

    //move desktop files
    $(".desktopFile").draggable({
        cursor: 'auto',
        start: (event)=>{
            event.target.style.backgroundColor = 'inherit'
            data.draggableWinIcon = true
        },
        stop: (event, ui)=>{
            event.target.style.top = calculateRelativeUnits(ui.position.top, 'vh')
            event.target.style.left = calculateRelativeUnits(ui.position.left, 'vw')
            event.target.style.backgroundColor = ''
            data.draggableWinIcon = false
        }
    })
    
    //select desktop files
    $(".desktopFile").click((event)=>{
        $(".desktop").click()
        if (event.currentTarget.classList.contains('desktopFileActive')) return
        event.currentTarget.classList.add('desktopFileActive')
    })

    //move and resize window
    $(".window").draggable({
        cursor: 'move',
        snap: 'body, .taskbar, .window',
        cancel: ".windowTitleButtons",
        handle: ".windowTitleBar",
        start: (event)=>{
            const node = event.currentTarget
            if (!data.windows.maximize.hasOwnProperty(node.id)) return

            node.style.width = data.windows.maximize[node.id].width
            node.style.height = data.windows.maximize[node.id].height
            delete data.windows.maximize[node.id]
        },
        stop: (event)=>{}
    }).resizable({
        snap: 'body, .taskbar, .window',
		handles: "all",
        minHeight: 150,
        minWidth: 200
    })

    //change lang func
    $("#change_lang").click(()=>{
        settings.currentLang++
        if (settings.currentLang == data.supportLanguages.length) settings.currentLang = 0
        translate(data.supportLanguages[settings.currentLang])
    })
    
    //maximize window button
    $("svg[data-win-act='maximize']").click((event) => {
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
    $("svg[data-win-act='close']").click((event) => {
        const node = event.currentTarget.parentElement.parentElement.offsetParent
        node.style.display = "none"
    })

    //desktop selection div
    $('.desktop')
    .mouseup(event => {
        data.desktopMouse.start = {}
        data.desktopMouse.selection = false
        // $('.selectionBox').removeAttr('style')
    })
    .mousedown(event => {
        data.desktopMouse.start = {x: event.offsetX, y: event.offsetY}
        
    })
    .mousemove(event => {
        if (event.buttons !== 1 || !(event.target.className !== 'desktop' || event.target.className !== 'selectionBox') || data.draggableWinIcon) return
        if (Object.keys(data.desktopMouse.start).length == 0) return
        const selectionBox = $('.selectionBox')[0]

        console.log(data.desktopMouse.start)

        if (!data.desktopMouse.selection) {
            selectionBox.style.display = 'inline-flex'
            selectionBox.style.top = data.desktopMouse.start.y + 'px'
            selectionBox.style.left = data.desktopMouse.start.x + 'px'
            data.desktopMouse.selection = true
        }

        selectionBox.style.height = event.offsetY - data.desktopMouse.start.y + 'px'
        selectionBox.style.width = event.offsetX - data.desktopMouse.start.x + 'px'
    })
        
})