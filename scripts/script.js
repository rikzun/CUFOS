const supportLanguages = ['en', 'ru']

const settings = {
    currentLang: 0
}

const windows = {
    maximize: {}
}

// const desktopObjects = {
//     files: {},
//     vidgets: {}
// }

const translateStrings = {
    'TITLE1': {en: 'Title 1', ru: 'Заголовок 1'},
    'TITLE2': {en: 'Title 2', ru: 'Заголовок 2'},
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
    // off contextmenu
	$('body').bind('contextmenu', (event)=>{
		return false
    })
    
    //startup settings
    translate(supportLanguages[settings.currentLang])
    genid(document.querySelectorAll('#gen'))

    //clear all selected files
    $(".desktop").click((event)=>{
        if (!event.target.classList.contains('desktop')) return

        for (const node of document.querySelectorAll('.desktopFile.desktopFileActive')) {
            node.classList.remove('desktopFileActive')
        }
    })

    //open windows
    $(".desktopFile[data-open-win]").dblclick((event)=>{
        $(event.currentTarget.dataset.openWin).show()
    })

    //move desktop files
    $(".desktopFile").draggable({
        cursor: 'auto',
        delay: 100,
        start: (event)=>{
            event.target.style.backgroundColor = 'inherit'
        },
        stop: (event)=>{
            event.target.style.backgroundColor = ''
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
            if (!windows.maximize.hasOwnProperty(node.id)) return

            node.style.width = windows.maximize[node.id].width
            node.style.height = windows.maximize[node.id].height
            delete windows.maximize[node.id]
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
        if (settings.currentLang == supportLanguages.length) settings.currentLang = 0
        translate(supportLanguages[settings.currentLang])
    })
    
    //maximize window button
    $("svg[data-win-act='maximize']").click((event) => {
        const node = event.currentTarget.parentElement.parentElement.offsetParent

        //return past values
        if (windows.maximize.hasOwnProperty(node.id)) {
            node.style.width = windows.maximize[node.id].width
            node.style.height = windows.maximize[node.id].height
            node.style.top = windows.maximize[node.id].top
            node.style.left = windows.maximize[node.id].left
            node.style.borderRadius = ".5vh"
            node.style.boxShadow = "0 0 1.6vh 0 rgba(0, 0, 0, 0.75)"
            delete windows.maximize[node.id]
            return
        }

        //save values
        windows.maximize[node.id] = {
            width: node.style.width, height: node.style.height,
            top: node.style.top, left: node.style.left,
        }

        $(node).removeAttr("style")
        node.style.top = getComputedStyle(document.querySelector(".taskbar")).height
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
})