import { isData, isPlainOnject } from "./util"

function encode(val: string) {
  return encodeURIComponent(val)
  .replace(/%40/g, '@')
  .replace(/%3A/gi, ':')
  .replace(/%24/g, '$')
  .replace(/%2C/gi, ',')
  .replace(/%20/g, '+')
  .replace(/%5B/gi, '[')
  .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    let val = params[key]
    if (val === null || typeof val === 'undefined') {
      return //  当为null或者unde时直接进入下一次循环
    }
    let values: string[]

    if (Array.isArray(val)) {
      values = val
      key += '[]' // a[]
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isData(val)) {
        val = val.toISOString()
      } else if (isPlainOnject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}