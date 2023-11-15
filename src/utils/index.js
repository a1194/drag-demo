export function formatTime() {
    const time = new Date()
    let hour = time.getHours()
    let minute = time.getMinutes()
    let bar 
    if(hour < 12) {
        bar = '上午'
    } else {
        bar = '下午'
        hour = hour - 12
    }
   
    return `${bar} ${hour}:${String(minute).padStart(2, 0)}`
}

export function getPath() {
    // return "http://" + window.location.host + '/files/assets/images/'
    return "http://192.168.1.250/" + 'files/assets/images/'
}