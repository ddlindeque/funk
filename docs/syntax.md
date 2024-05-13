# Syntax of *funk*

The language contains the following constructs
* Comments
* Forward declarations
* Type declarations
* Constant declarations
* Function declarations
* Classes

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

The approach is to have a syntax which is recognisable as C++ procedural syntax, but have Haskell-like syntax where it abreviates, especially in type declaration. There's also some C# influence. The language is *pure functional* and statically typed. The entry point of a program is `::main` with a type signature `std::random_access_iterator<string>->std::operation<int64>`. The language allow for *name overloading*. A symbol must be unique only in *name/type* pair. This allow for *ad-hoc* polymorphism, and is useful for *operator overloading*.

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
* Function calls are modelled on C++, i.e.: `add(4,5);`
* Statements are seperated by `;`
* Generics are modelled after the C# style
* Attributes are also just expressions, but they happen to evaluate to a value of type `attribute`
* The *standard library* will follow the same conventions as C++, maps will be `::std::map`, etc. Some types, like *string* will have an alias as a keyword, i.e.: `string` will be alias to `::std::string`.

### Expression lists

#### Comma seperated expressions

```
cse: // empty set
    | cse "," expression
```

### Attributes

Any expression can be associated with a set of attributes. For instance to associate the linearity of a type is specified as an attribute, like so `[affine] int64`.

#### Syntax

```
attributes: // empty
    | "[" cse "]"
```

### Names

The approach to names follow C++ syntax. Namespaces are declare and scoped using `{` `}`, and can be nested. It is allowed to *collapse* nested namespaces into the name. The *anonymous* namespace is also allowed, basically rendering symbols in that namespace as *private*. A *name* can have optionally the namespace, then the name of the symbol, then the optional generic arguments. To reference the root namespace, use `::`, i.e.: `::A::B`. Operators are named using `operator{operator}` approach, modelling on C++. For instance, the `+` operator can be referenced, as a function, using the name `operator+`. All operators are defined in the root namespace.

#### Packages

We are undecided on a package system. For a start, we will adopt the JavaScript/TypeScript model, which means some symbols will be declared as *export*. Those symbols will be accessible from any module which imports them.

#### Syntax

```

name:
    IDENTIFIER
  | "::" IDENTIFIER
  | name "::" IDENTIFIER
  | name "<" cse ">"
  | OPERATOR_PLUS
  | OPERATOR_MINUS
  ...

namespace: 
    "namespace" "{" statements "}" // private
  | "namespace" name "{" statements "}"

```

#### Examples

```
auto print<[class(Printable)] a>(a[] items) -> Operation<void>
{
  std::cout << '[';
  for(x : items) {
    std::cout << ' ' << x;
  }
  std::cout << ']';
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
// forward declare a sum type
variant maybe<a>;

// forward declare a product type
struct person;

// forward declare a function
auto add(int64 x, int64 y) -> int64;
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

variant maybe<a> = none | some(a);
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
  The members of the type are named and keyed by name. These are keyed in the symbol table by the set of property name/type pairs. A predefined structure can also be declared using the *struct* keyword. No guarantees made about the layout of these structures.

#### Examples

```
// Tumple
auto x = (5, "test"); // a tuple of type (int64, string). Keyed by name = "tuple", type = {int64, string}
auto x = { name = "David", surname = "Lindeque" }; // record type. It'll be keyed by a composition of the field names and type as a composition of field types. I.e.: name = {name,surname}, type = {string,string}
struct person {
  string name;
  string surname;
}; // keyed by struct name.
```

### Constant declarations

To define a constant the type, name and value must be supplied, although `auto` can be used as the type, to allow type inference. It is not possible to declare a *generic* constant, since it's not possible to create an instance of a generic type. The language declare the following constant values by default
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

## Classes

A type can be attached to a class, which would add some requirements on the type, i.e.: some functions might be required, etc. This is borrowed from Haskell, to bring consistency amongst types. 


## Expressions

The *IO* monad is generalised as the *operation* monad. This monad encapsulates input-output operations to both console and file, but also includes mutation of data structures (using linear type constraints).

### *Operation* expressions

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
  }
  ```
* `for` and `foreach`
* `while` and `do` `until`
