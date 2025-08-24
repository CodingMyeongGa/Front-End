export function getFormattedDate(d = new Date()){
    const y = d.getFullYear()
    const m = d.getMonth()+1
    const day = d.getDate()
    const w = ['일','월','화','수','목','금','토'][d.getDay()]
    return `${y}년 ${m}월 ${day}일 (${w})`
}