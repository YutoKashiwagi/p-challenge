/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {
  isValidName,
  ensureValidName,
  filterAdultUsers,
  user,
  users,
} from '../myfunctions';

describe('isValidName', (): void => {
  test('[正常系]文字数が１以上４以下ならtrueを返す', () => {
    expect(isValidName('あ')).toBe(true);
    expect(isValidName('あいうえ')).toBe(true);
  });
  test('[異常系]文字数が0だとfalseを返す', () => {
    expect(isValidName('')).toBe(false);
  });
  test('[異常系]文字数が5以上だとfalseを返す', () => {
    expect(isValidName('あいうえお')).toBe(false);
    expect(isValidName('abcde')).toBe(false);
  });
});

describe('ensureValidName', () => {
  test('文字数が0の場合エラーを投げる', () => {
    expect(() => ensureValidName('')).toThrow('name can not be empty');
  });
  test('文字数が1以上の場合はvoid(undefined)を返す', () => {
    expect(ensureValidName('aaa')).toBeUndefined();
  });
});

describe('filterAdultUsers', () => {
  const mockUsers: users = [...Array(80)].map(
    (v, i): user => ({ id: i, name: 'foo', age: i })
  );

  describe('20歳以上のユーザーのみ抽出したユーザーの配列を返す', () => {
    const filteredUsers = filterAdultUsers(mockUsers);
    test('抽出したユーザー数が正しい', () => {
      expect(filteredUsers.length).toBe(60);
    });
    test('抽出したユーザーはすべて20歳以上である', () => {
      expect(filteredUsers.find((user) => user.age < 20)).toBeUndefined();
    });
  });
});
