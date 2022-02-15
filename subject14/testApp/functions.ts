export const add = (...args: number[]) => {
  return args.reduce((sum, current) => sum + current, 0)
}
