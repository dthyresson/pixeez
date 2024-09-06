import { customAlphabet } from 'nanoid'
export const nanoid = customAlphabet(
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
)

export const prefixes = {
  album: 'album',
  pic: 'pic',
  test: 'test', // <-- for tests only
} as const

export function newId(prefix: keyof typeof prefixes): string {
  return [prefixes[prefix], nanoid(16)].join('_')
}
