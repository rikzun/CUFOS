const supportLanguages = ['en', 'ru']

const settings = {
    currentLang: 0
}

const windows = {
    maximize: {}
}

const desktop = {
    files: {},
    selected: [],
    vidgets: {}
}

const translateStrings = {
    'TITLE': {en: 'Title', ru: 'Заголовок'},
    'CONTENT': {en: 'Content', ru: 'Содержание'},
    'SYSTEM': {en: 'System', ru: 'Система'},
    'PC': {en: 'PC', ru: 'ПК'},
	'CHANGE_LANG': {en: 'Change language', ru: 'Изменить язык'}
}

function selector(e) {
    if (e.buttons != 1) return
    // console.log(e.clientX, e.clientY)
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

$(() => {
	$('body').bind('contextmenu', ()=>{
		return false
    })
    
    translate(supportLanguages[settings.currentLang])
    genid(document.querySelectorAll('#gen'))

    $(".desktopFile").click((node)=>{
        if (desktop.selected.indexOf(node.currentTarget.id) !== -1) return
        console.log(node.currentTarget)
        node.currentTarget.classList.add('desktopFileActive')
        desktop.selected.push(node.currentTarget.id)
    })

    $(".desktop").click((node)=>{
        if (desktop.selected.length > 0) {
            for (const node of desktop.selected) {
                $(`#${node}`)[0].classList.remove('desktopFileActive')
                desktop.selected.splice(desktop.selected.indexOf(node), 1)
            }
        }
    })

    $(".desktopFile[data-open-win]").dblclick((o)=>{
        $(o.currentTarget.dataset.openWin).show()
    })


    $(".desktopFile").draggable({
        cursor: 'auto',
        start: (node)=>{
            node.target.style.backgroundColor = 'inherit'
        },
        stop: (node)=>{
            node.target.style.backgroundColor = ''
        }
    })

    $(".window").draggable({
        cursor: 'move',
        snap: 'body, .taskbar, .window',
        cancel: ".windowTitleButtons",
        handle: ".windowTitleBar",
        start: (node)=>{
            const currentNode = node.currentTarget
            if (!windows.maximize.hasOwnProperty(currentNode.id)) return

            currentNode.style.width = windows.maximize[currentNode.id].width
            currentNode.style.height = windows.maximize[currentNode.id].height
            delete windows.maximize[currentNode.id]
        },
        stop: ()=>{}
    }).resizable({
        snap: 'body, .taskbar, .window',
		handles: "all",
        minHeight: 150,
        minWidth: 200
    })

    $("#change_lang").click(() => {
        settings.currentLang++
        if (settings.currentLang == supportLanguages.length) settings.currentLang = 0
        translate(supportLanguages[settings.currentLang])
    })
    
    $(".maximize").click((node) => {
        const currentNode = node.currentTarget.parentElement.parentElement.offsetParent
        if (windows.maximize.hasOwnProperty(currentNode.id)) {
            currentNode.style.width = windows.maximize[currentNode.id].width
            currentNode.style.height = windows.maximize[currentNode.id].height
            currentNode.style.top = windows.maximize[currentNode.id].top
            currentNode.style.left = windows.maximize[currentNode.id].left
            delete windows.maximize[currentNode.id]
            return
        }

        windows.maximize[currentNode.id] = {
            width: currentNode.style.width, height: currentNode.style.height,
            top: currentNode.style.top, left: currentNode.style.left
        }

        $(currentNode).removeAttr("style")
        currentNode.style.top = getComputedStyle(currentNode.firstElementChild).height
        currentNode.style.left = '0rem'
        currentNode.style.width = '100%'
        currentNode.style.height = '100%'
    })

    $(".close").click((node) => {
        const currentNode = node.currentTarget.parentElement.parentElement.offsetParent
        currentNode.style.display = 'none'
    })
})