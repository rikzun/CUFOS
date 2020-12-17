const standardSettings = {
    currentLang: 'en',
    openClick: 'double',
    clickDelay: 600
}

for (const [key, value] of Object.entries(standardSettings)) {
    if (localStorage.hasOwnProperty(key)) continue
    localStorage.setItem(key, value)
}