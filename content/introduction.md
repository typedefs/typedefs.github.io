---
layout: base.njk
title: Typedefs — Introduction
---

# Introduction

See [about](/about) for some background and motivation.

In this introduction we will start with a look at the [type theory](https://en.wikipedia.org/wiki/Type_theory) underlying typedefs and in the next section we will show some examples in the S-expression syntax.

## Typesystem

The core theory defines the following rules [`Typedefs.idrs/TDef`](https://github.com/typedefs/typedefs/blob/master/src/Typedefs.idr#L14):

- `0` the empty type;
- `1` the unit type;
- `+` co-product of types (also known as *sum*-types);
- `×` product of types (also known as *tuples*);
- `µ` fixpoint operator (also known as recursion);
- *a*, *b* variables;
- `a b` application.

With this you define *algebraic datatypes* (ADTs) such as:

- Types with a fixed finite number of terms, such as bits (**2**): `Bool` 
- Parametric types, such as the optional type: `α → Maybe α`
- Recursive types, such as homogeneous lists: `α → List α`

(Theoretically, these are seen as *least fixpoints of F-algebras*, we recommend [this blogpost by Bartosz Milewski](https://bartoszmilewski.com/2017/02/28/f-algebras/) to learn about it.)

### The units

The theory has two ground terms, from which all concrete types are assembled:

- `0` the empty type;
- `1` the unit type.

The unit type **1** is the unique type that has only one term, usually denoted as **•**, a dot.

The zero type **0** is the unique type that has no terms (*note*: in practice you don't really need the empty type, but there are theoretic reasons for including it).

Both these types are "units" with respect to the next two type formation rules `+` and `×`, in the following sense:

- `0 + a = a + 0 = a`
- `1 × a = a = a × 1`

*Note*: at the moment, these equalities are *not reduced away* if you write them down.
> **OPEN:** it is an partially open question still how to deal with normalization of types

### Sum and product types

Using the familiar symbols `+` to express choice or co-product and `×` for pairing we have the following two constructors:

- The *coproduct* (or sum) formation rule: for all types a and b, `a + b` is a type;
- The *product* (or tuple) formation rule: for all types a & b, `a × b` is a type.

The **coproduct** type expresses a *choice* between the terms of the two argument types.

The **product** type is the tuple or pair of the two argument types.

Some examples:

- We write `1 + 1` to describe the finite type `2` that has two terms, the left and the right unit terms of `1`;
- The type `2 * 2` is the product of two `1 + 1` terms, so a pair of booleans if you wish.

### Type variables

Type variables can be used to describe parametric type, such as the optional type.

Given a type `x`, `1 + x` is the **option** or **maybe** type: its terms are the unit term or a term of type x.

Categorically, this defines the mapping 'x -> 1 + x`, which defines an *endofunctor* on the category of types.

### Recursive types

There is also a 5th type formation rule, "mu".

- `µ` fixpoint operator (also known as recursion)

When you apply µ to an algebraic functor, it expresses the fixpoint of that functor. Conceptually, "it closes the recursive type definition".

For example, the list type, `l -> a -> (a * l a) + 1`.

## Input Language

We currently use [S-expressions](https://www.computerhope.com/jargon/s/s-expression.htm) as a convenient way to input type definitions.

You can use this from the browser at [try.typedefs.com](https://try.typedefs.com).

Alternatively, you can define types directly in Idris, see [Examples.idr](https://github.com/typedefs/typedefs/blob/master/examples/Examples.idr).

### The Unit Type

In the S-expression language, it is predefined as the string `1` and you can assign a name to it as follows:

```clojure
(name Unit 1)
```

### Basic (closed) types

Let's construct a very basic type, the booleans. In typedefs, we think of this as *the co-product of two unit types*, written as **1 + 1**.

A co-product of types expresses a choice between terms of those types.

The equation **1 + 1 = 2** expresses nicely that the co-product of two unit types is isomorphic to a type called **2**, that has two possible terms, namely the left or the right **•**.

Here is an example of such definition of the boolean type.

```clojure
;; the "boolean" type as the co-product of two unit-types
(name Bool (+ 1 1))
```

This type is called **closed** because it does not have any free variables (*note*: As stressed above, one way to think of these definitions is as *endofunctors* on typedefs. Closed typedefs are then functors from/to the unit type).

### Type variables, basic parametric types

It is also possible to define "endofunctors on types", such as the "optional" or "maybe" type.

This type is called *parametric* because it takes a typedef `α` and constructs a new typedef `Maybe α`.

Hence, it is a 1-ary functor from typedefs to typedefs.

**α → 1 + α**

Here is the definiton:

```clojure
;; the α → Maybe α type constructor
(name Maybe (+ 1 (var 0)))
```

The number in `(var 0)` is a [De Bruijn indice](https://en.wikipedia.org/wiki/De_Bruijn_index).

## **TODO**

That's it for now, more to be written.

If you want to learn more, you can browse the code [here](https://github.com/typedefs).
