type Merge<T> = { [P in keyof T]: T[P] } & {};

enum Fruit {
  orange = 'orange',
  apricot = 'apricot'
}
enum Color {
  orange = 'orange',
  apricot = 'apricot'
}




type GetBrandName<Union> = Union extends string & { __tag: infer U } ? U : never

type UnbrandUnion<Union> =
  Union extends (infer HumanReadableString & {__tag: GetBrandName<Union>})
    ? HumanReadableString
    : never

type test3 = UnbrandUnion<IFruit_union>
//    ^?

type Color_union =
| 'orange' & {__tag: 'Color'}
| 'green'  & {__tag: 'Color'}

const testUnion: Merge<Record<IFruit_union, number>> = {} // doesn't work
//    ^?

// @ts-expect-error Type '{}' is missing the following properties from type '{ orange: number; apricot: number; peach: number; }': orange, apricot, peach(2739)
const testUnion2: Merge<Record<UnbrandUnion<IFruit_union>, number>> = {} // desired behavior
//    ^?

// @ts-expect-error Type '{}' is missing the following properties from type '{ orange: number; apricot: number; peach: number; }': orange, apricot, peach(2739)
const testEnum: Merge<Record<Fruit, number>> = {} // desired behavior
//    ^?

const testColor: Color = Color.orange

const testColor1: Color = Fruit.orange




type IFruit_Orange  = 'orange'  & {__tag: 'Fruit'}
type IFruit_Apricot = 'apricot' & {__tag: 'Fruit'}
type IFruit_Peach   = 'peach'   & {__tag: 'Fruit'}

const Fruit_Orange  = 'orange'  as IFruit_Orange
const Fruit_Apricot = 'apricot' as IFruit_Apricot
const Fruit_Peach   = 'peach'   as IFruit_Apricot

type IFruit_union =
  | IFruit_Orange
  | IFruit_Apricot
  | IFruit_Peach


type IColor_Orange  = 'orange'  & {__tag: 'Color'}
type IColor_Apricot = 'apricot' & {__tag: 'Color'}
type IColor_Peach   = 'peach'   & {__tag: 'Color'}

const Color_Orange  = 'orange'  as IColor_Orange
const Color_Apricot = 'apricot' as IColor_Apricot
const Color_Peach   = 'peach'   as IColor_Apricot

type IColor_union =
  | IColor_Orange
  | IColor_Apricot
  | IColor_Peach



function funcExample1(fruit: IFruit_union ) {
  if (((t: unknown): t is IFruit_Orange => t === Fruit_Orange)(fruit)) {
    throw new Error('asd2')
  }
  if (((t: unknown): t is IFruit_Apricot => t === Fruit_Apricot)(fruit)) {
    throw new Error('asd2')
  }
  fruit
  // ^?
}

const getEqualityCheckerForPredefinedBrand = <BrandType>() => <
  const CanonicalBrandedValue extends string & {__tag: BrandType}
>(testableBrandedValue: unknown, canonicalBrandedValue: CanonicalBrandedValue): testableBrandedValue is CanonicalBrandedValue => {
  return testableBrandedValue === canonicalBrandedValue;
};

const brandedEqual = <
  const CanonicalBrandedValue extends string & {__tag: string}
>(
  testableBrandedValue: string & {__tag: GetBrandName<NoInfer<CanonicalBrandedValue>>},
  canonicalBrandedValue: CanonicalBrandedValue
): testableBrandedValue is CanonicalBrandedValue => {
  return testableBrandedValue === canonicalBrandedValue;
};


const areFruitsEqual = getEqualityCheckerForPredefinedBrand<'Fruit'>();

const isFruitOrange = (fruit: unknown) => areFruitsEqual(fruit, Fruit_Orange)

const isFruitApple = (fruit: unknown) => areFruitsEqual(fruit, Fruit_Apricot)


brandedEqual('orange' as IFruit_union, Fruit_Orange)
// @ts-expect-error Argument of type 'string' is not assignable to parameter of type 'string & { __tag: "Fruit"; }'.
//   Type 'string' is not assignable to type '{ __tag: "Fruit"; }'.(2345)
brandedEqual('orange', Fruit_Orange)

//@ts-expect-error Argument of type 'IColor_union' is not assignable to parameter of type 'string & { __tag: "Fruit"; }'.
// Type 'IColor_Orange' is not assignable to type 'string & { __tag: "Fruit"; }'.
//   Type 'IColor_Orange' is not assignable to type '{ __tag: "Fruit"; }'.
//     Types of property '__tag' are incompatible.
//       Type '"Color"' is not assignable to type '"Fruit"'.
brandedEqual('orange' as IColor_union, Fruit_Orange)

function funcExample2(fruit: IFruit_union ) {
  if (getEqualityCheckerForPredefinedBrand<'Fruit'>()(fruit, Fruit_Orange)) {
    throw new Error('asd2')
  }
  if (getEqualityCheckerForPredefinedBrand<'Fruit'>()(fruit, Fruit_Apricot)) {
    throw new Error('asd2')
  }
  fruit
  // ^?
}


function funcExample3(fruit: IFruit_union ) {
  if (areFruitsEqual(fruit, Fruit_Orange)) {
    throw new Error('asd2')
  }
  if (areFruitsEqual(fruit, Fruit_Apricot)) {
    throw new Error('asd2')
  }
  fruit
  // ^?
}


function funcExample4(fruit: IFruit_union ) {
  if (isFruitOrange(fruit)) {
    throw new Error('asd2')
  }
  if (isFruitApple(fruit)) {
    throw new Error('asd2')
  }
  fruit
  // ^?
}

function funcExample5(fruit: IFruit_union ) {
  if (brandedEqual('orange', Fruit_Orange)) {
    throw new Error('asd2')
  }
  if (brandedEqual(fruit, Fruit_Apricot)) {
    throw new Error('asd2')
  }
  fruit
  // ^?
}
