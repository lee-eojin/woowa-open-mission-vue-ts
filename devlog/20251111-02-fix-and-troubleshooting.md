# 2025-11-11 (8일차) - 장바구니 반응성 문제 해결

## 문제 발견

프로모션 모달 구현을 마치고 바로 브라우저에서 테스트를 했다. 담기 버튼을 누르면 프로모션 모달은 정상적으로 표시된다. 예/아니오를 선택하면 alert도 "콜라 3개를 장바구니에 담았습니다"라고 잘 나온다. 하지만 오른쪽 장바구니 UI에는 아무것도 표시되지 않는다. "장바구니가 비어있습니다"라는 문구만 계속 보인다.

일단 개발자 도구 콘솔로 확인해보았다. cartStore.items를 출력하면 빈 배열이다. 하지만 cartStore.cart.value를 직접 접근하면 items Map에 상품이 담겨있다. 즉, 데이터는 정상적으로 추가되는데 UI가 업데이트되지 않는 상황이다.

## 원인 분석 (가설)

cartStore는 shallowRef를 사용하고 있다.

```typescript
const cart = shallowRef<Cart | null>(null)
const inventory = shallowRef<Inventory | null>(null)
```

shallowRef는 객체 자체가 교체될 때만 변경을 감지한다. Cart 클래스 내부의 items Map이 변경되어도 cart.value는 여전히 같은 Cart 인스턴스를 가리킨다. Vue의 반응형 시스템이 내부 변경을 감지하지 못한다.

devlog 20251109-01.md 써둔 것을 다시 읽어봤다. 당시에는 "도메인 클래스 인스턴스를 반응형으로 만들 때 깊은 반응성은 필요하지 않다"고 판단했다. 클래스 인스턴스 자체만 교체되면 된다고 생각했다. 하지만 실제로는 클래스 내부의 Map이 변경될 때도 반응성이 필요하다. Map에 아이템이 추가되거나 삭제될 때마다 UI가 업데이트되어야 한다.

## 해결 방법 검토

찾아본 결과, 최종적으로는 두 가지 해결 방법이 있다.

첫 번째는 triggerRef를 사용하는 것이다. shallowRef를 유지하면서 addItem, removeItem, updateQuantity 같은 메서드 호출 후에 triggerRef(cart)를 명시적으로 호출한다. 이렇게 하면 Vue에게 cart가 변경되었으니 다시 확인하라는 신호를 준다. 장점은 명시적이라서 언제 업데이트가 일어나는지 명확하다는 것이다. 도메인 클래스의 모든 프로퍼티를 깊게 추적하지 않아도 된다. 단점은 모든 메서드 호출 후에 triggerRef를 붙여야 한다는 것이다. addItem, removeItem, updateQuantity, clear 모두에 붙여야 한다. 나중에 메서드를 추가할 때 triggerRef를 빼먹으면 버그가 된다.

두 번째는 ref로 변경하는 것이다. shallowRef 대신 ref를 사용하면 객체 내부까지 깊게 추적한다. Cart 내부의 items Map이 변경되면 자동으로 감지한다. 장점은 자동으로 감지해서 간단하다는 것이다. triggerRef를 붙일 필요가 없다. 단점은 성능 오버헤드가 있을 수 있다는 것이다. Cart의 모든 프로퍼티를 깊게 추적하면 불필요한 추적이 생길 수 있다.

## ref를 선택한 이유

ref로 바꾸기로 결정했다. 이유는 다섯 가지다.

첫째, 실수를 방지하기 위해서 결정했다. triggerRef는 모든 메서드에 붙여야 한다. addItem, removeItem, updateQuantity, clear 모두에 붙여야 한다. 나중에 메서드를 추가할 때 빠뜨리면 버그다. 컴파일 타임에 잡히지 않는다. 런타임에 왜 UI가 안 바뀌는지 자주 확인하며 디버깅해야 한다. ref를 쓰면 이런 실수를 원천 차단할 수 있다.

둘째, Cart 구조가 단순하다. items Map, promotionPolicy, inventory 정도다. 이 정도면 깊은 추적을 해도 성능 문제가 없다. 수백 개의 상품을 담지도 않고, 초당 수십 번 업데이트되는 것도 아니다.

셋째, Vue 반응형 시스템을 신뢰한다. Vue는 충분히 최적화되어 있다. 이 규모의 프로젝트에서는 shallowRef와 ref의 성능 차이를 체감할 수 없다. 이미 많은 고민을 해서 만든 시스템이다. 내가 수동으로 최적화할 필요가 없다.

넷째, 코드가 간결하다. triggerRef를 붙이는 코드가 전혀 필요 없다. addItem 함수가 그냥 cart.value.addItem만 호출하면 끝이다.

다섯째, 일관성이다. 우테코 2주차 미션 과제에서, 약간 일관성을 지키지 못했었는데 혼란스러웠다는 리뷰를 받았던 경험이 있다.
다른 반응형 데이터는 자동으로 추적된다. ref로 선언한 데이터는 변경되면 자동으로 UI가 업데이트된다. Cart만 수동으로 triggerRef를 호출하는 건 일관성이 없다. 다른 개발자가 봤을 때 혼란스러울 것으로 생각했다.

triggerRef는 정말 큰 객체나 성능이 중요한 경우에 쓰는 최적화 기법이다. 지금은 과하다.

## 구현

cartStore.ts에서 shallowRef를 ref로 바꿨다.

```typescript
// Before
import { computed, shallowRef } from 'vue'
const cart = shallowRef<Cart | null>(null)

// After
import { computed, ref } from 'vue'
const cart = ref<Cart | null>(null)
```

간단한 변경이다.

## 새로운 문제 발생

타입 체크를 돌렸더니 에러가 발생했다.

```
Argument of type '{ findByName: (name: string) => Product[]; ... }'
is not assignable to parameter of type 'Inventory'.
Type '{ findByName: ... }' is missing the following properties
from type 'Inventory': products, productMap, groupByName
```

inventory도 ref로 바꿨더니 생긴 문제다. Inventory를 Cart 생성자에 전달할 때 타입이 안 맞는다고 한다.

## ref와 private 필드 문제

ref는 객체를 깊은 반응형으로 만들기 위해 Proxy로 감싼다. 이 과정에서 모든 중첩된 프로퍼티를 reactive하게 만든다.

```typescript
const inventory = ref<Inventory | null>(null)
inventory.value = new Inventory(products)

// 실제로는 이렇게 됨
inventory.value = new Proxy(new Inventory(products), {...})
```

Inventory 클래스는 private 필드를 가지고 있다.

```typescript
class Inventory {
  private readonly products: Product[]
  private readonly productMap: Map<string, Product[]>

  findByName(name: string): Product[] {...}
}
```

ref로 감싸면 Proxy가 생성되고, TypeScript는 이 Proxy가 public 메서드만 가지고 있다고 판단한다. private 필드는 Proxy를 통해 접근할 수 없다.

Cart 생성자는 Inventory 타입을 기대한다. 하지만 실제로는 Proxy<Inventory>가 전달된다. TypeScript가 보기에 Proxy는 products, productMap private 필드가 없다. 타입 에러가 발생한다.

에러 메시지를 다시 보면 이해가 된다. "Type '{ findByName: ... }'는 public 메서드만 있고, products, productMap, groupByName은 누락되었다"는 뜻이다. Proxy가 public 인터페이스만 노출하고 private 필드는 숨긴다.

## 최종 해결

Inventory는 shallowRef로 유지하고 Cart만 ref로 변경했다.

```typescript
import { computed, ref, shallowRef } from 'vue'

const cart = ref<Cart | null>(null)
const inventory = shallowRef<Inventory | null>(null)
```

Inventory는 초기화 후에 변경되지 않는다. products를 로드해서 Inventory 인스턴스를 만들고 나면 끝이다. 상품이 추가되거나 삭제되지 않는다. 재고 수량도 Cart가 관리하지 Inventory가 직접 변경하지 않는다. 그래서 Inventory는 shallowRef로 충분하다. 인스턴스 자체가 교체될 때만 감지하면 된다.

Cart는 내부 Map이 계속 변경된다. addItem으로 상품이 추가되고 removeItem으로 삭제된다. 이런 변경을 감지해야 한다. 그래서 Cart는 ref가 필요하다.

Cart는 다른 클래스의 생성자에 전달되지 않는다. cartStore 내부에서만 사용된다. public 메서드만 호출한다. 그래서 Proxy로 감싸져 있어도 문제없다.

## 동작 확인

브라우저에서 다시 테스트했다. 콜라 2개를 담으려고 하니 "1개를 무료로 더 받을 수 있습니다" 모달이 표시된다. 예를 누르면 콜라 3개가 장바구니에 담긴다. 오른쪽 장바구니 UI가 즉시 업데이트된다. 상품명, 수량, 금액이 표시된다. 프로모션 할인도 자동으로 계산된다. 최종 금액이 정확하게 나온다.

일단 삭제 버튼을 눌러봤다. 장바구니에서 상품이 잘 사라진다. "장바구니가 비어있습니다"라는 문구가 다시 나타난다. 반응성이 정상적으로 작동한다.

## 배운 점

ref와 shallowRef의 차이를 명확하게 이해했다. ref는 깊은 반응성을 제공하지만 Proxy로 감싼다. shallowRef는 얕은 반응성만 제공하지만 원본 객체를 유지한다.

private 필드가 있는 클래스를 다른 클래스에 전달할 때는 shallowRef를 써야 한다. ref를 쓰면 Proxy 때문에 타입 문제가 생긴다.

모든 것을 shallowRef로 하는 건 과도한 최적화다. 성능이 중요한 부분만 최적화하면 된다. 나머지는 ref로 간단하게 처리하는 게 낫다. 실수도 줄이고 코드도 간결하다.

Vue의 반응형 시스템을 신뢰해야 한다. 직접 최적화하려고 하다가 버그를 만들 수 있다. 필요한 경우에만 shallowRef나 triggerRef를 사용하자.
