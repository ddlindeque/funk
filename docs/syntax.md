# Syntax of *funk*

The language contains the following constructs
* Comments
* ```import``` statements
* Function declarations
* Type declarations
* Constant declarations
* Function declarations

## Comments

The language support two kinds of comments
* Line comments
* Block comments

### Line comments

Line comments are comments that start with `//`, the comment end at the end of the line.

#### Examples

```
// This is the comment, which ends at the end of this line
auto pi = 3.1415; // This is also a comment which ends at the end of the line
```

### Block comments

Block comments start the `/*` and end with `*/`. Block comments can span many lines.

#### Examples

```
auto pi /* approximation */ = 3.1415;
/*
    This is a multi-line comment.
    Which can span any number of lines.
*/
```

### Comments on comments

A line comment *inside* a block comment is not considered a comment and a block comment *inside* a line comment is not considered a comment and does not end a comment at the `*/` character.

#### Examples

```
// This /* is a comment */ and this still is

/*
    This is a multiline comment
    // and this is */ auto pi = 3.1415;
```

In the above, the `auto pi = 3.1415;` statement is an actual statement, and not a comment.

## General approach

The approach is to have a syntax which is recognisable as C++ procedural syntax, but have Haskell-like syntax where it abreviates. The language is *pure functional* and statically typed. The language allow for *name overloading*. A symbol must be unique only in *name/type* pair. This allow for *ad-hoc* polymorphism, and is useful for *operator overloading*. We do not have c++ templates, but cli like generics.

A document must have the following structure:

```
imports

declarations
```

### Everything are expressions

The language is based on *expressions*
* *Value expressions*  
  Evaluation of a *Value expression* results in a value, i.e.: 5, or "hello world".
* *Type expressions*  
  Evaluation of a *Type expression* results in a type, i.e.: int64, and is known as a *type instance*.
* No distinction is made between type vs value expressions.
* The *type* of a type is `type`. So, `int64` evaluate to a value with the type of `type`.
* Type literals, i.e.: `int64` or `string` are just *expressions* which happen to evaluate to an instance of `type`.
* Function type constructors, i.e.: `int64->string` is an *expression* using `->` as a binary operator with a type `type->type->type`.
* Attributes are also just expressions, but they happen to evaluate to a value of type `attribute`

### Structure

* Function calls are modelled on C++, i.e.: `add(4,5);`
* Function declarations are also modelled on C++, i.e.: `auto name(parameters) -> return_type` (where return type is optional)
* Statements are seperated by `;`
* The *standard library* will follow the same conventions as C++
* Monad's use '{' '}' blocks
* The entry point is a function named 'main' that returns ```operation<int>```

## Expressions

We have the following types of expressions:

* Literals
  * Value literals like ```5```, ```()``` which have type ```void``` (the unit). array literals?
  * Type literals like ```int64```
  * Attribute literal like ```linear```
* Variables using identifiers, like ```x```
* Application
  * We're using c++ style application, using parethesis, i.e.: ```add(5,4)```. Partial application is allowed, like ```add(5)```, ```add(_,5)``` or ```add(5,_)```.
* Operators  
  * We have various operators, some for values, some for types.
* Lambda's
  The capture is inferred

## Type inference

We have a system of *linear types*, which makes mutation and resource management possible. A linear type has to be referenced no more than once, and may be referred to once only. This means we can allocate and heap memory like so:

```
generic<T> auto operator new() -> [linear] T *;
generic<T> auto operator new[](size_t count) -> [linear] T[]
generic<T> auto delete([linear] T* p) -> void;
generic<T> auto delete([linear] T[] p) -> void;

generic<T> auto operator *(T* x) -> T&;
generic<T> auto operator &(T& x) -> T*;

generic<T> auto update([linear] T& x, T new_value) -> operation<void>; // The 'x' is an 'in/out' parameter, meaning that 'linearity' is zero.

auto operator=([linear] int &x, const int &y)
{
  update(x, y)
}

// Example 1
int* x = new int;
*x = 7; // This will work since it calls 'update' and the dereferencing is on a linear pointer. The new 'x' will be 'replaced' with a new linear instance
delete x; // This MUST be called, since the linear x must be referenced

// Example 2
int* x = new int;
*x = 7; // Same as above
int* y = x; // Will not work, since x is linear (because of 'new' function)

// Example 3
int y = 8; // y is immutable
int* z = &y; // Setting up a pointer to a non-heap type, which is not linear
*z = 9; // This will not work, since *z dereferenced is not linear.
int* k = z; // Will work, since z is not linear
```

Another example is file handles
```
auto open(string fn) -> [linear] int;
auto close([linear] int handle) -> void;

auto read(int& handle, void* buffer) -> void; // Since handle is 'in/out', it doesn't affect the linearity

```

## Function declarations

We have 2 kinds of functions, one that returns a monad, and one that doesn't. For functions that returns a monad, we use {} braces, like for instance:

```
auto print_hello_world()
{
  std::cout << "Hello world" << std::endl;
}
```

This function returns `operation<void>`.

The other kind looks like this

```
auto add_numbers(int x, y) = x + y;
```

When defining a function like ```auto add_numbers(x,y) = x + y```, the compiler will notice that the '+' operator has been overloaded a number of times, and thus will keep the function generic, like ```generic<x, y, z> auto add_numbers(x x, y y) -> z = x + z```, to be instantiated at the call sites.

## Type declarations

### Product types

* tuples
* structures

### Sum types

```generic<T> Maybe = Just(T value) | Nothing```


## Names

* All operators must be declared in the root namespace


The approach to names follow C++ syntax. Namespaces are declare and scoped using `{` `}`, and can be nested. It is allowed to *collapse* nested namespaces into the name. The *anonymous* namespace is also allowed, basically rendering symbols in that namespace as *private*. A *name* can have optionally the namespace, then the name of the symbol, then the optional generic arguments. To reference the root namespace, use `::`, i.e.: `::A::B`. Operators are named using `operator{operator}` approach, modelling on C++. For instance, the `+` operator can be referenced, as a function, using the name `operator+`. All operators are defined in the root namespace.

#### Packages

We are undecided on a package system. For a start, we will adopt the JavaScript/TypeScript model, which means some symbols will be declared as *export*. Those symbols will be accessible from any module which imports them.

#### Syntax

```

name:
    IDENTIFIER
  | "::" IDENTIFIER
  | name "::" IDENTIFIER
  | "operator" OPERATOR
  ...

namespace: 
    "namespace" "{" statements "}" // private
  | "namespace" name "{" statements "}"

```

#### Examples

```
generic<a>
auto operator<<(std::ostream os, a[] items) -> std::operation<std::ostream>
{
  os << '[';
  for(x : items) {
    os << ' ' << x;
  }
  return os << ']';
}

namespace A {
  // Here everything is in namespace 'A'
};

namespace B {
  // Here everything is in namespace B
namespace C {
  // Here everything is in namespace B::C
};

};

namespace B::C {
  // Here everything is in the collapsed namespace B::C
};

namespace A {
std::string X::Y::Z::x = "Hello World"; // Defining a symbol A::X::Y::Z::x
std::string ::X::Y::Z::y = "Yes"; // Defining a symbol X::Y::Z::x
std::string z = "Plain"; // Defining a symbol A::z
std::string ::r = "root"; // Defining a symbol r
}

auto operator+(mytype lhs, mytype rhs) -> mytype {
  //...
}

```

## Forward declarations

The symbol table is indexed by name/type pairs. So, a forward declaration only needs a name and type to be able to *reference* it before it was *declared*.


### Syntax

```
forward: expression name ";"
```

### Examples

```
// forward declare a sum type (The name is the type name)
variant maybe<a>;

// forward declare a product type (The name is the type name)
struct person;

// forward declare a function
auto add(int64 x, int64 y) -> int64;

// forward declare a value
int64 x;
```

## Type declarations

There are two kinds of types to be declared
* *Sum* types
* *Product* types

Any type can be associated with a set of attributes, which means all *instantiations* of the type will have those attributes by default.

### *Sum* types

Sum types are modelled after the familiar Haskell syntax using C++ naming.

#### Syntax

```
type: "variant" attributes name "=" members
members:
      member
    | member "|" member
member:
      name
    | name "(" expression ")" // here expressions is a type constructor
```

#### Examples

```
variant yesno = yes | no;
// yesno is an expression of type 'type'
// yes and no are expressions of type 'yesno'

generic<a> variant maybe = none | some(a);
// maybe is a constructor taking one parameter of type 'type', i.e.: 'type->type'
// none is a constructor taking no parameters, i.e.: 'maybe<a>'
// some is a constructor taking one parameter of type 'a', i.e.: 'a->maybe<a>'

variant [affine] handle = empty | resource(int64);
// handle has been associated with the attribute named 'affine'
```

### *Product* types

Product types are modelled on *tuples*, which is convenient *on the fly* type declarations, but can be a bit vague in the meaning of members of the tuple. For instance, to present a type `(string, string)` it is completely unclear what the two members are for. Thus the language support two variants of the *product* type. Even then, all *product* types are defined *on-the-fly*.
* pure tuple     
  Here the members are unnamed and keyed just by index. *On the fly* typed using *tuple* syntax. These are keyed in the symbol table by the list of types.
* record type  
  The members of the type are named and keyed by name. These are keyed in the symbol table by the set of property name/type pairs. A predefined structure can also be declared using the *struct* keyword. No guarantees made about the layout of these structures, unless the appropriate *attribute* was specified. More on this later.

#### Examples

```
// Tumple
auto x = (5, "test"); // a tuple of type (int64, string). Keyed by name = "tuple", type = {int64, string}
auto x = { name = "David", surname = "Lindeque" }; // record type. It'll be keyed by a composition of the field names and type as a composition of field types. I.e.: name = {name,surname}, type = {string,string}
struct person {
  string name;
  string surname;
}; // keyed by struct name 'person' and type 'person'.
```

### Value declarations

To define a value expression, name and value must be supplied, although `auto` can be used as the type, to allow type inference. It is not possible to declare a *generic* value, since it's not possible to create an instance of a generic type. The language declare the following values by default
* `()` which is the only value of type `void`.
* `[]` which is a generic value representing an empty list of the generic type.

#### Syntax

```
const: expression name "=" expression ";"
```

#### Examples

```
int64 x1 = 5;
auto x2 = 5; // int64
auto msg = "Hello world";
```

### Function declarations

```
auto main(std::random_access_iterator<string> args) -> std::operation<int64>
{
    // This is monadic
    let name = std::readLine();
    std::cout << name << std::endl;
    return 0;
};

auto add(int64 x, int64 y) -> int64 
{
    // This is not monadic
    return x + y;
};

auto getLine() -> std::operation<std::string>
{
    return readLine();
};
```

## Expressions

The *IO* monad is generalised as the *operation* monad. This monad encapsulates input-output operations to both console and file, but also includes mutation of data structures (using linear type constraints).

### *Operation* expressions

The core function for making mutation is as follows
```c++
// update the instance of the first parameter to the value of the second parameter
operation<a> update([affine, out] a, a);
```

* `if` `then` and `if` `then` `else`  
  The `if` expression variants take an expression evaluating to `boolean`, and expressions evaluating to `operation<void>` as bodies for the *then* and *else* sections.
  #### Syntax
  ```
  if_expression:
        "if" "(" expression ")" "{" expression "}"
      | "if" "(" expression ")" "{" expression "}" "else" "{" expression "}"
  ```
  #### Examples
  ```
  if (x == 5) {
    std::cout << "x == 5" << std::endl;
  };

  if (y == 6) {
    std::cout << "y == 6" << std::endl;
  }
  else {
    std::cout << "y != 6" << std::endl;
  };
  ```
* `for`  
  The `for` statement contains the following three sections
  * initialising statement
  * compare statement
  * increment statement
  * body

  This can be modelled as a creating a monad as follows:
  ```c++
  {
    loop(/*body*/, /*predicate*/, /*update mutable state*/, /*collection*/);
  }
  ```
  Example
  ```c++
  for(int64 i = 0; i < 10; ++i) {
    op(i);
  };
  ```
  ```c++
  loop<int64>(
    ([in] int64 i) => op(i), 
    0,
    ([in] int64 i) => i < 10, 
    ([in, out] int64 i) => ++i
    // operation<int64> operator++([affine, in, out] int64 i) { update(i, i+1); }
  ```
* `foreach`  
  This maps to an iterator to the `for` above.
* `while` and `do` `until`
