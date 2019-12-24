export const formatTimeString = (time) => {
    let newTime = new Date(time);

    return newTime.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' }).replace(',', '');
}

export const formatDateString = (time) => {
    let newTime = new Date(time);

    return newTime.toUTCString().slice(0,17);
}

export const formatDateWithTimeString = (time) => {
    let newTime = new Date(time),

    formattedDate = newTime.toUTCString().slice(0,17),
    formattedTime = newTime.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit' })

    return `${formattedDate} ${formattedTime}`
}

export const formatNameToCapitalisation = (name) => {
    return(
        name.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ')    
    )
}

export const formatPriceToLocale = (price) => {
    return (
        price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    )
}