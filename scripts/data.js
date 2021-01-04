const data = {
    mouse: {
        start: {},
    },
    switches: {
        draggableWinIcon: false,
        selectedFile: false
    },
    fileController: new FileController(),
    grid: new Grid(),
    selectionBox: new SelectionBox(),
    ddController: new DropdownController(),
    ctxmController: new ContextmenuController(),
    windowsController: new WindowsController()
}
const windows = {
    defaultWin: {
        title: 'TITLE',
        once: true,
        minHeight: 200,
        minWidth: 400,
        html: `<p></p>`
    }
}