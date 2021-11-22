/**
 * Return `className` if `bool` is passed and is true, if not checks `className`
 * @author rikzun
 */
export function css(className?: String, bool?: any) {
    let rt: boolean

    if (arguments.length == 1) {
        rt = Boolean(className)
    } else rt = bool

    return rt ? ' ' + className : ''
}