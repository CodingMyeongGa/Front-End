export default class WeatherService {
  constructor({ apiKey, lang = 'kr', units = 'metric', timeoutMs = 8000 }){
      this.apiKey = apiKey
      this.lang = lang
      this.units = units
      this.timeoutMs = timeoutMs
  }

  async _fetchWithTimeout(url){
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort('timeout'), this.timeoutMs)
    try {
      const res = await fetch(url, { signal: controller.signal })
      return res
    } finally { clearTimeout(id) }
  }

  async getCurrentWeather(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`
    const res = await this._fetchWithTimeout(url)
    if (!res.ok){
      const text = await res.text().catch(()=> '')
      let payload; try { payload = JSON.parse(text) } catch { payload = { raw:text } }
      const err = new Error('HTTPError'); err.status = res.status; err.statusText = res.statusText; err.payload = payload
      throw err
    }
    return res.json()
  }
}