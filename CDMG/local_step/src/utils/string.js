export function normalizeCityName(name){
  if (!name) return name
  return name.replace(/-si$/i,'').replace(/\s+City$/i,'').trim()
}