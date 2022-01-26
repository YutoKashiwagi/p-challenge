// nameの文字数をチェック
export const isValidName = (name: string) => {
  return (name.length > 0) && (name.length <= 4)
}

// nameが空かチェック。空なら例外投げる
export const ensureValidName = (name: string) => {
  if (name.length === 0) {
    throw new Error("name can not be empty")
  }
}

// 20歳以上のユーザー配列を取得する
export type user = {
  id: number,
  name: string,
  age: number
}

export type users = user[]

export const filterAdultUsers = (users: users) => {
  return users.filter(user => user.age >= 20)
}
