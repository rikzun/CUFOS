function calculateRelativeUnits(px, direction) {
    if (typeof px == 'number') px = String(px)
    const directionSize = {'vh': window.innerHeight, 'vw': window.innerWidth}

    return (px.replace('px', '') / directionSize[direction]) * 100 + direction
}

function translate(key) {
    return translateStrings[key][localStorage.getItem('currentLang')]
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

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
HTMLDivElement.prototype.addStyle =
function (style, value) {
    this.style[style] = value
    return this
}