export default {getAll}

export function getAll(): Object {
    const settings = localStorage.getItem('settings')

    if (!settings) return {}
    return JSON.parse(settings)
}