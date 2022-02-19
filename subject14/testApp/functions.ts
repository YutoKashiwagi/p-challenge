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
