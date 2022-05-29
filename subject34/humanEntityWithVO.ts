// 血液型：a,b,o,ab以外の値は設定できない
// 生年月日：20歳以上の生年月日しか設定できない
// 名前：20文字未満でなければいけない
class BloodType {
  constructor(private value: 'a' | 'b' | 'o' | 'ab') {}

  getValue(): string {
    return this.value
  }
}

class BirthDay {
  static readonly MIN_AGE = 20

  constructor(private value: Date, currentDate: Date) {
    // 簡略化のため、年のみでの比較とする
    const currentAge = currentDate.getFullYear() - value.getFullYear()
    if (currentAge < BirthDay.MIN_AGE) {
      throw new Error(`${BirthDay.MIN_AGE}歳未満は登録できません`)
    }

    this.value = value
  }

  getValue(): Date {
    return this.value
  }
}

class HumanName {
  static readonly MAX_LENGTH = 20
  constructor(private value: string) {
    if (value.length >= HumanName.MAX_LENGTH) {
      throw new Error(`${HumanName.MAX_LENGTH}文字未満の名前しか登録できません`)
    }

    this.value = value
  }

  getValue(): string {
    return this.value
  }
}

class HumanEntityWithVO {
  constructor(
    private id: number,
    private bloodType: BloodType,
    private birthDay: BirthDay,
    private humanName: HumanName) {
    }
}
