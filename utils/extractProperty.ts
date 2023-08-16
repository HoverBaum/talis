type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ''
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S]

export type ExtractProperty<T, K extends string | string[]> = K extends string
  ? _ExtractProperty<T, Split<K, '.'>>
  : K extends string[]
  ? _ExtractProperty<T, K>
  : never

type _ExtractProperty<T, K extends string[]> = K['length'] extends 1
  ? K[0] extends keyof T
    ? T[K[0]]
    : never
  : K[0] extends keyof T
  ? _ExtractProperty<T[K[0]], DropFirst<K>>
  : never

type DropFirst<T extends any[]> = ((...args: T) => void) extends (
  arg1: any,
  ...rest: infer R
) => void
  ? R
  : T

// // Test
// type TestData = {
//   Roller: {
//     a: string
//     nested: {
//       b: number
//       deeper: {
//         c: boolean
//       }
//     }
//   }
//   AnotherProp: number
// }

// type AType = ExtractProperty<TestData, 'Roller'> // { a: string; nested: { b: number; deeper: { c: boolean; } } }
// type BType = ExtractProperty<TestData, 'Roller.nested'> // { b: number; deeper: { c: boolean; } }
// type CType = ExtractProperty<TestData, ['Roller', 'nested', 'deeper']> // { c: boolean }
// type DType = ExtractProperty<TestData, 'Roller.nested.deeper'> // { c: boolean }
