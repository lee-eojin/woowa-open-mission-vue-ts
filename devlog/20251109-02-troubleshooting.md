# Pinia Store에서 도메인 클래스 인스턴스를 ref로 저장할 때 발생한 TypeScript 타입 에러 해결 과정

## 문제 발생

장바구니 기능을 구현하기 위해 Pinia store를 만들었다. Cart와 Inventory 도메인 클래스를 전역 상태로 관리하기 위해 ref로 감싸서 저장했다.

브라우저에서 상품을 장바구니에 담으려고 하자 TypeScript 타입 에러가 발생했다. 코드는 정상적으로 컴파일되지 않았고, VSCode PROBLEMS 탭에 에러가 표시됐다.

### 에러 메시지

```
Argument of type is not assignable to parameter of type Inventory.
Type is missing the following properties from type Inventory: products, productMap, groupByName
```

에러 메시지를 보면 Inventory 타입이 필요한데, 실제로는 메서드만 있는 객체가 전달되고 있다는 내용이다. products, productMap, groupByName 같은 프로퍼티가 없다고 나온다.

하지만 Inventory 클래스는 분명히 이런 필드들을 가지고 있다. private readonly로 선언했고, 생성자에서 초기화도 했다.

## 원인 분석

문제의 핵심은 Vue의 ref가 객체를 어떻게 처리하는지에 있었다.

### Vue의 ref와 Proxy

Vue 3의 반응형 시스템은 Proxy를 사용한다. ref로 객체를 감싸면 내부적으로 Proxy로 래핑된다.

일반 객체나 배열이라면 문제가 없다. 하지만 클래스 인스턴스는 다르다.

### 클래스 인스턴스와 Proxy의 문제

Inventory 클래스는 private 필드를 가지고 있다.

Proxy로 감싸면 다음과 같은 일이 발생한다.

1. new Inventory(products) 실제 Inventory 인스턴스 생성
2. ref로 감싸기 깊은 reactive proxy 생성
3. Proxy는 객체 내부까지 재귀적으로 감싼다
4. private 필드에는 외부에서 접근 불가능
5. TypeScript는 Proxy 객체가 private 필드를 가지고 있는지 보증할 수 없음

결과적으로 TypeScript 관점에서 보면 메서드는 있지만 필드는 없는 객체로 추론된다.

### ref의 깊은 반응형

ref는 기본적으로 깊은 deep 반응형이다. 객체 내부의 모든 프로퍼티까지 재귀적으로 Proxy로 감싼다.

클래스 인스턴스에는 이런 깊은 반응형이 필요하지 않다. 오히려 문제를 일으킨다.

나는 Cart나 Inventory 인스턴스를 통째로 교체하는 방식으로만 사용한다. 내부 필드를 직접 수정하지 않는다.

따라서 깊은 반응형은 불필요하고, 오히려 타입 에러와 성능 오버헤드만 발생시킨다.

## 최종 해결책

문제의 근본 원인은 ref의 깊은 반응형이었다. 해결책은 shallowRef를 사용하는 것이다.

### shallowRef란?

shallowRef는 얕은 shallow 반응형이다. value 자체만 추적하고, 내부 프로퍼티는 Proxy로 감싸지 않는다.

ref는 Cart 인스턴스와 내부 모든 프로퍼티가 Proxy로 감싸지지만, shallowRef는 cart.value만 추적하고 Cart 인스턴스는 원본 그대로 유지한다.

### 왜 shallowRef가 적합한가?

우리의 사용 패턴은 초기화 시 인스턴스 생성하고, 이후 메서드만 호출한다. 내부 필드를 직접 수정하지 않는다.

인스턴스를 통째로 교체하는 것만 감지하면 된다. 내부 필드 변화를 추적할 필요가 없다.

shallowRef는 인스턴스 교체는 감지하지만, 내부 필드 변화는 감지하지 않는다. 우리에게 필요한 것만 제공한다.

### 타입 에러 해결 원리

shallowRef는 내부를 Proxy로 감싸지 않으므로, Cart와 Inventory 인스턴스가 원본 그대로 유지된다.

TypeScript는 이제 inventory.value를 정확히 Inventory 타입으로 인식한다. private 필드도 포함해서 말이다.

### 성능상 이점

부수적인 효과로 성능도 개선된다.

ref는 Cart 내부 Map, 모든 CartItem, 모든 Product까지 Proxy를 생성한다. 메모리 사용량이 증가하고 접근 속도가 느려진다.

shallowRef는 cart.value만 추적하고 내부는 원본 그대로 유지한다. 메모리 효율적이고 접근 속도가 빠르다.

## 배운 점

### ref vs shallowRef 선택 기준

일반적인 객체나 배열은 ref를 사용한다. 내부 프로퍼티 변화도 추적해야 하기 때문이다.

클래스 인스턴스는 shallowRef를 사용한다. 인스턴스 교체만 추적하면 되기 때문이다.

Vue 공식 문서에서도 "the inner value of a shallow ref is stored and exposed as-is, and will not be made deeply reactive"라고 설명한다.

클래스 인스턴스를 store에 저장할 때는 shallowRef를 써야 한다는 걸 명확히 알게 됐다.

### 도메인 클래스와 반응형 시스템의 분리

도메인 클래스는 Vue나 Pinia에 대해 알 필요가 없다. 순수한 TypeScript 클래스로 유지하는 게 좋다.

반응형은 Pinia store 레이어에서만 처리한다. shallowRef로 인스턴스를 감싸되, 인스턴스 자체는 원본 그대로 유지한다.

이렇게 하면 도메인 클래스를 다른 환경에서도 재사용 가능하고, 테스트하기 쉬우며, 타입 안전성을 유지할 수 있다.

### Vue의 반응형 시스템 깊이 이해

Vue의 반응형은 강력하지만, 모든 상황에 적합한 것은 아니다. 데이터의 성격과 사용 패턴에 따라 적절한 API를 선택해야 한다.

ref는 깊은 반응형으로 일반 객체와 배열에 적합하다. shallowRef는 얕은 반응형으로 클래스 인스턴스에 적합하다.

각 API의 특성을 이해하고 상황에 맞게 선택하는 것이 중요하다.

### 에러 메시지 분석의 중요성

에러 메시지에 missing properties products, productMap, groupByName이라고 나왔다. 이 필드들이 private이라는 것을 알고 있었기 때문에, Proxy가 private 필드를 숨기고 있다는 추론을 할 수 있었다.

에러 메시지를 정확히 읽고 코드의 동작 원리와 연결하면 해결책을 찾을 수 있다.

## 참고 자료

- Vue 3 공식 문서 Reactivity API Advanced
- Vue 3 공식 문서 Reactivity in Depth
- Pinia 공식 문서 State
- TypeScript 구조적 타입 시스템
- JavaScript Proxy와 Reflect API
