const standardSettings = {
    currentLang: 'en'
}

for (const [key, value] of Object.entries(standardSettings)) {
    if (localStorage.hasOwnProperty(key) && localStorage[key] === value) continue
    localStorage.setItem(key, value)
}