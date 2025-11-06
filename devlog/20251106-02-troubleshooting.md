# Vue 컴포넌트에서 클래스 인스턴스를 Props로 전달할 때 발생한 TypeScript 타입 에러 해결 과정

## 문제 발생

ProductList 컴포넌트를 완성하고 브라우저에서 확인했을 때는 정상으로 잘 작동했다. 상품 목록이 테이블로 잘 나왔고, 프로모션 배지도 제대로 표시됐다. 콘솔에도 에러는 없었다.

하지만 VSCode의 PROBLEMS 탭에 2개의 타입 에러가 발생했다. Product와 Promotion 클래스를 Props로 전달할 때 타입이 맞지 않는다는 내용이었다.

### 에러 메시지

```
Type '{ getName: () => string; getPrice: () => number; getQuantity: () => number; getPromotion: () => string | null; hasPromotion: () => boolean; getTotalPrice: () => number; }[]' is not assignable to type 'Product[]'.
  Type '{ getName: () => string; getPrice: () => number; getQuantity: () => number; getPromotion: () => string | null; hasPromotion: () => boolean; getTotalPrice: () => number; }' is missing the following properties from type 'Product': name, price, quantity, promotion
```

```
Type '{ getName: () => string; getBuy: () => number; getGet: () => number; getStartDate: () => Date; getEndDate: () => Date; isActive: (currentDate?: Date) => boolean; getTotalQuantity: () => number; }[]' is not assignable to type 'Promotion[]'.
  Type '{ getName: () => string; getBuy: () => number; getGet: () => number; getStartDate: () => Date; getEndDate: () => Date; isActive: (currentDate?: Date) => boolean; getTotalQuantity: () => number; }' is missing the following properties from type 'Promotion': name, buy, get, startDate, endDate
```

에러 메시지를 보면 Product 타입에 name, price, quantity, promotion 필드가 없다고 나온다. 하지만 Product 클래스를 만들 때 분명히 private readonly로 선언했고, getName(), getPrice() 같은 getter 메서드들도 모두 구현했다.

TypeScript는 Product를 메서드만 있는 객체로 인식하고 있었다. 실제 런타임에서는 문제없이 작동하지만, 컴파일 타임 타입 체크에서만 에러가 발생하는 상황이었다.

## 원인 분석

문제의 원인은 TypeScript의 구조적 타입 시스템과 클래스의 private 필드 접근성에 있었다고 판단하였다.

Product 클래스는 다음과 같이 정의되어 있었다.

```typescript
export class Product {
  constructor(
    private readonly name: string,
    private readonly price: number,
    private readonly quantity: number,
    private readonly promotion: string | null,
  ) {}

  getName(): string {
    return this.name
  }
  // ... 기타 getter 메서드들
}
```

TypeScript는 구조적 타입 시스템을 사용한다. 타입의 이름이 아니라 구조를 보고 타입을 체크한다는 뜻이다. Product 타입을 체크할 때 name, price, quantity, promotion 필드가 있는지 확인하는데, 이 필드들은 private이라 외부에서 접근할 수 없다. TypeScript는 접근할 수 없는 필드를 없는 필드로 판단한다.

Vue가 컴포넌트의 Props 타입을 체크할 때도 마찬가지다. Product 클래스의 구조를 분석하면서 private 필드는 타입에서 제외하고, 결과적으로 메서드만 있는 객체로 인식한다.

Props 정의에서는 Product[] 타입을 기대한다. 즉, name, price, quantity, promotion 필드가 있는 객체 배열이어야 한다. 하지만 실제로 TypeScript가 추론한 타입은 getName(), getPrice() 같은 메서드만 있는 객체 배열이다. 두 타입이 일치하지 않아서 에러가 발생한 것이다.

## 시도한 해결 방법

### 시도 1: type import를 일반 import로 변경

처음에는 import 방식 문제라고 생각했다. `import type`은 타입만 가져오고 컴파일 후 사라지니까, 클래스를 제대로 import하면 해결될 거라고 판단했다.

```typescript
// 변경 전
import type { Product } from '@/domain/Product'

// 변경 후
import { Product } from '@/domain/Product'
```

하지만 여전히 같은 에러가 발생했다. import 방식의 문제가 아니었다.

### 시도 2: PropType을 사용한 런타임 Props 선언

TypeScript의 interface Props 방식이 문제라고 생각했다. Vue의 런타임 props 선언 방식으로 바꾸면 타입 체크를 우회할 수 있을 거라고 판단했다.

```typescript
// 변경 전
interface Props {
  products: Product[]
}
const props = defineProps<Props>()

// 변경 후
const props = defineProps({
  products: {
    type: Array as PropType<Product[]>,
    required: true,
  },
})
```

하지만 이것도 실패했다. PropType은 런타임 체크를 위한 것이지, TypeScript의 구조적 타입 체크를 우회하지 못했다.

### 시도 3: v-if로 조건부 렌더링 추가

혹시 빈 배열일 때 타입 추론이 이상하게 작동하는 건 아닐까? 데이터가 있을 때만 렌더링하면 해결될 수도 있다고 생각했다.

```vue
<ProductList v-if="products.length > 0" :products="products" :promotions="promotions" />
```

이것도 소용없었다. 타입 체크는 컴파일 타임에 이루어지므로 런타임 조건문은 타입 에러 해결에 도움이 되지 않았다.

### 시도 4: VSCode TypeScript 서버 재시작

VSCode의 타입 캐시 문제일 수도 있다고 생각해서 TypeScript 서버를 재시작했다. 하지만 여전히 같은 에러가 발생했다. 캐시 문제가 아니라 실제 타입 불일치 문제였다.

## 최종 해결책

여러 시도 끝에 근본 원인을 찾았다. private 필드가 문제였다. 해결책은 클래스 필드를 private readonly에서 public readonly로 변경하고, 단순 getter 메서드들을 제거하는 것이었다.

변경 전:

```typescript
export class Product {
  constructor(
    private readonly name: string,
    private readonly price: number,
    private readonly quantity: number,
    private readonly promotion: string | null,
  ) {}

  getName(): string {
    return this.name
  }

  getPrice(): number {
    return this.price
  }

  getQuantity(): number {
    return this.quantity
  }

  getPromotion(): string | null {
    return this.promotion
  }

  hasPromotion(): boolean {
    return this.promotion !== null
  }

  getTotalPrice(): number {
    return this.price * this.quantity
  }
}
```

변경 후:

```typescript
export class Product {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly quantity: number,
    public readonly promotion: string | null,
  ) {}

  hasPromotion(): boolean {
    return this.promotion !== null
  }

  getTotalPrice(): number {
    return this.price * this.quantity
  }
}
```

### 변경 사항

필드 접근 제어자를 private readonly에서 public readonly로 변경했다. 단순 getter 메서드들(getName, getPrice, getQuantity, getPromotion)은 삭제하고 직접 필드 접근으로 변경했다. 비즈니스 로직 메서드들(hasPromotion, getTotalPrice, isActive, getTotalQuantity)은 그대로 유지했다.

### 사용 코드 변경

Inventory.ts:

```typescript
// 변경 전
const name = product.getName()
return promotionProduct.getQuantity()

// 변경 후
const name = product.name
return promotionProduct.quantity
```

ProductTableRow.vue:

```vue
<!-- 변경 전 -->
<td>{{ product.getName() }}</td>
<td>{{ formatPrice(product.getPrice()) }}원</td>

<!-- 변경 후 -->
<td>{{ product.name }}</td>
<td>{{ formatPrice(product.price) }}원</td>
```

필드가 public이 되면서 TypeScript가 필드에 접근할 수 있게 되었고, 구조적 타입 체크를 통과했다. 하지만 readonly로 선언했기 때문에 외부에서 수정은 불가능하다. 캡슐화의 핵심 목적인 불변성은 여전히 보장된다.

getter 메서드는 Java나 C# 스타일이다. TypeScript에서는 readonly 필드를 사용하는 것이 더 자연스러워 보인다. 코드도 더 간결해진다. product.getName() 대신 product.name으로 접근할 수 있다.

## 배운 점

### TypeScript의 구조적 타입 시스템

TypeScript는 이름이 아니라 구조로 타입을 체크한다. 클래스 이름이 같아도 구조가 다르면 다른 타입으로 인식된다. 특히 private 필드는 외부에서 접근할 수 없기 때문에 타입 체크 시 없는 필드로 간주된다.

### private vs public readonly

캡슐화의 핵심 목적은 외부에서 내부 상태를 수정하지 못하게 하는 것으로 보인다. 읽기까지 막을 필요는 없어 보인다. public readonly는 외부에서 읽을 수 있지만 수정은 불가능하다. TypeScript 타입 시스템과도 잘 작동하고, 코드도 더 간결해진다.

private는 완전히 내부 구현 디테일이거나 외부에 노출하면 안 되는 정보일 때 사용하는 게 좋을 것 같다. 예를 들어 비밀번호 해시나 내부 캐시 같은 경우다.

### Vue의 Props 타입 체크

Vue는 런타임과 컴파일 타임 모두에서 타입 체크를 한다. 런타임에서는 PropType으로 체크하고, 컴파일 타임에서는 TypeScript로 체크한다. 둘 다 통과해야 에러가 없다.

### 에러 메시지 읽기의 중요성

에러 메시지를 제대로 읽으면 문제의 원인을 파악할 수 있다. 메서드만 있는 객체로 추론되었다는 것은 필드가 private이라서 접근할 수 없다는 의미였다.

### 실무에서의 교훈

readonly로도 충분히 안전성을 보장할 수 있어 보인다. getter 메서드는 보일러플레이트 코드가 될 수 있다. 언어의 특성에 맞게 작성하는 것이 중요해 보인다. Java 스타일을 TypeScript에 그대로 적용하면 오히려 문제가 생길 수 있다.

타입 에러를 무시하지 않는 게 좋을 것 같다. 브라우저에서 작동한다고 해서 괜찮은 게 아니다. 나중에 리팩토링할 때 문제가 발생할 수 있고, 타입 안전성을 포기하면 TypeScript를 쓰는 의미가 없어진다.

불필요한 복잡도를 추가하지 말고 실용적인 해결책을 선택하는 게 나아 보인다. readonly로도 캡슐화가 충분히 보장되는 것 같다.

## 참고 자료

- [TypeScript 공식 문서 - 구조적 타입 시스템](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [Vue 3 공식 문서 - Props with TypeScript](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)
- TypeScript readonly modifier
- 객체지향 프로그래밍의 캡슐화 원칙
