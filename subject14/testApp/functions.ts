export const add = (...args: number[]) => {
  if (args.length === 0) {
    throw new Error('引数は一つ以上指定してください')
  }
  if (args.length > 30) {
    throw new Error('引数が多すぎます')
  }

  const result = args.reduce((sum, current) => sum + current, 0)
  if (result > 1000) {
    throw new Error('too big')
  }
  return result
}

export const subtract = (...args: number[]) => {
  if (args.length === 0) {
    throw new Error('引数は一つ以上指定してください')
  }
  if (args.length > 30) {
    throw new Error('引数が多すぎます')
  }

  const initialValue = args.shift()
  if (args.length === 0) {
    return initialValue
  }

  const result = args.reduce((previous, current) => (previous as number) - current, initialValue) as number
  if (result < 0) {
    throw new Error('negative number')
  }
  return result
}

export const multiply = (...args: number[]) => {
  if (args.length === 0) {
    throw new Error('引数は一つ以上指定してください')
  }
  if (args.length > 30) {
    throw new Error('引数が多すぎます')
  }

  const result = args.reduce((previous, current) => previous * current, 1)
  if (result > 1000) {
    throw new Error('big big number')
  }
  return result
}
