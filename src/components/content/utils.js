export const allowedEmbed = (url) => {
  if (!url) return false
  try {
    const { hostname } = new URL(url)
    return /(youtube\.com|youtu\.be|vimeo\.com|player\.vimeo\.com)$/i.test(hostname)
  } catch {
    return false
  }
}

export const safeEval = (code) => {
  try {
    const fn = new Function(
      '"use strict"; const window=undefined, document=undefined, localStorage=undefined, sessionStorage=undefined, location=undefined; ' +
        code,
    )
    const result = fn()
    return { ok: true, output: result === undefined ? '✅ Kjørte uten returverdi' : String(result) }
  } catch (error) {
    return { ok: false, output: error?.message || 'Kjøringsfeil' }
  }
}

export const fallbackText = 'Ingen tekst er lagt inn ennå. God jul! 🎄'
