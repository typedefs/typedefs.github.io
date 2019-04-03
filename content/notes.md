---
layout: base.njk
title: Typedefs — Some notes
---


# Some notes

*TBD*

<!--

TODO: convert these notes into proper docs

**warning**: you probably don't want to read this. These notes a very rough and partially outdated, mainly for internal use, to be converted into proper documentation eventually.

## Typedefs FAQ

[Typedefs FAQ](https://hackmd.io/ySWhrYXvR4iSStIAJ8gldA?both)

## Typedefs allows you to

- [x] define types
- [ ] have serialisers and deserialisers generated for your chosen language
- [ ] give every type definition an address
- [ ] import types à la `npm install`
- [ ] ...

## What is it

Typedefs allows you to specify data *types* and exchange and use the types in different programming languages, database systems, API- & form-frameworks, etc.

We also allow you to use the types to store and retrieve typed data and work with it in strongly typed programming languages.

We are also thinking hard about meta-data and (homomorphic/Merkle) hashing.

## Can you be more specific?

Typedefs aims to define a data serialization format that interacts well
with strongly typed functional programming languages.

There are already [many great formats in existence](https://en.wikipedia.org/wiki/Comparison_of_data_serialization_formats), and most formats come with some form of [*interface definition language*](https://en.wikipedia.org/wiki/Interface_description_language).

It is here that we want to refine our language, towards a "*type definition language*" that is [*type-theoretic*](http://www.cse.chalmers.se/~abela/eafit2017/) and [*categorical*](https://plato.stanford.edu/entries/category-theory/) in nature.

Very hand-wavy, but if you construct something in a 'categorical' way, one might be able to stumble upon an 'universal construction', that is, some sort of 'best' way to define something.

This definition should then be abstract enough to apply to many systems, but concrete enough to be really useful. And be the best (universal) way define finite serialisable data types.


## Limitations

Examples of types that cannot be defined using Typedefs:

TODO

## Examples of common types that other libs support

- list/array/sequence (variable length)
  - protobuf: `repeated int32 data = 1;`
- fixed length lists
  - Typedefs: supported in the form of product types, e.g. `(* Int Int Int)`
- vectors
  - Typedefs: not supported because that would require dependent types; encode as lists
- maybe/option/optional
  - protobuf: `optional string surname = 2`
- enums
- 'nested fields' à la ProtoBuf
- records
- dictionaries (hash maps)

## Other questions

- named extractors
- lenses

## What is Typedefs?

A data interchange format that can handle typed data, and a set of tools for generating codecs in different languages.

## Why should I use Typedefs? (WIP)

Thrift, ProtoBuf, and other such serialisation libraries are made for languages that don't have a 'proper' type theory. For example, many languages lack support for [Algebraic Data Types](https://en.wikipedia.org/wiki/Algebraic_data_type). Typedefs is intended for languages whose type systems *are* nice.

One of the goals of Typedefs is to **mathematically prove the correctness** of serialisation, deserialisation, etc. This gets complex very quickly, so Typedefs is quite minimalistic on purpose.
 
See also ["Protobuffers Are Wrong"](http://reasonablypolymorphic.com/blog/protos-are-wrong/) by Sandy Maguire, and the associated [Hacker News thread](https://news.ycombinator.com/item?id=18188519).

## Open questions

There are various open questions that still need a proper analysis and resolution:

There are questions about isomorphisms: clearly `(1+1)+1` is isomorphic to `1+(1+1)`, but from a data type point of view we don't want any isomorphisms. We also might want to alias or newtype. There is an interaction with hashing.
> Fab: I am not sure I get this. An iso is a morphism, and clearly $1+(1+1) \simeq (1+1)+1$, but this doesn't mean that they are equal. It means - and this is very reasonable - that there is a procedure to turn one into the other, and this procedure comes exactly from the associator of the coproduct, seen as a monoidal structure on set. So, in terms of data types, it means that I can always translate one data type to the other, while keeping them different.
> If you add names to your categorical structure these things are even clearer: Specifically, if $F = (-) + (-)$, then I can define $X = F(F(1,1),1)$ and $Y = F(1,F(1,1))$. What category theory tells us is that these two endofunctors are different and hence their initial F-algebras have nothing to do with each other. But, again thanks to the properties of the associator, there is a natural transformation $\alpha: X \implies Y$ which is invertible in each component (i.e. it is a natural isomorphism) and this in turn means that the two initial algebras corresponding to $X,Y$ can be translated one into the other.
> The point, then, is that we want an hashing procedure that, in categorical terms, commutes with natural isomorphisms. This, from the categorical point of view, it is such a reasonable property to ask (read: If you don't get this your categorical stuff is clearly wrong) that I am quite sure that if we categorify the concept of hashing in the right way we'll get this for free from the structure itself.
 
```
-- this is to demonstrate the questions:
-- is bit^8 == nibble^2 ?
-- can we and do we want 'homomorphic hashing' ?
bit : type
bit = 1 + 1
nibble = bit * bit * bit * bit
byte = nibble * nibble
char = byte
```

Say we define "String" this way, this raises the need for some kind of Kleene-star operator:

```
-- this is to demonstrate the questions:
-- how to handle strings of arbitrary length?
-- do we encode this as a sigma type?
-- ([sbe places variable length data at the end](https://mechanical-sympathy.blogspot.nl/2014/05/simple-binary-encoding.html))
string = char + char^2 + char^3 + char^4 + ...
```

Or we can also just encode it like we do for list.

This brings us to the follow issue. For idiomatic reasons we might
want to map certain structures into idiomatic structures in the target system.

Say instead of `[[maybe]]` being

    (a:Type) -> Either Unit a

We get `[[maybe]] = Maybe`, the actual maybe from `purescript-maybe`, the Haskell prelude, etc.

It is unclear if this will create issues (between languages, within the system)

This leads to another issue.

We have for every typedef `T:TDef`, a pair of functions

    serialization_T : T -> Bits
    deserialization_T : Bits -> Maybe T

In Idris (dependent type theory) we can write this down as a function.
But in say, Java, we need to generate these functions for every imported type.


2. For efficiency reasons we might want to optimize storage for a often used type.

For this we might be able to use `Iso`s in Haskell/ML-like languages.

End goal should be to be able to write

```
import Data.Human.Age (age)


person : type
person = name * age * email
```

## Approach (in terms of the type theory used)

We first notice that with the unit type `1` and a coproduct `+`, we can build a bit: `1 + 1 = 2`.

If we add product (pair) to the mix, we can build a byte: `bit * bit * ... * bit`.

So it seems that with products and coproducts we can already do some stuff. 

But we also need to have type variables, such as `forall a. maybe a`.

And recusive data types, such as `forall a. list a = 1 + (a * list a)`.

There are several approaches that look like this:

- [The Gentle Art of Levitation](https://pages.lip6.fr/Pierre-Evariste.Dagand/papers/levitation.pdf)
- [True Sums of Products](http://www.andres-loeh.de/TrueSumsOfProducts) — Edsko de Vries and Andres Löh, Workshop on Generic Programming (WGP) 2014. ([presentation slides](https://www.andres-loeh.de/TrueSumsOfProducts/sop-wgp.pdf))
- [Polynomial Functors](http://mat.uab.es/~kock/cat/polynomial.html)
- [(Indexed) Containers (Dependent Polynomial Functors)](http://strictlypositive.org/indexed-containers.pdf)
- [Initial F-Algebra's](http://homepages.inf.ed.ac.uk/wadler/papers/free-rectypes/free-rectypes.txt)

The SoP approach is used in generic programming, in particular the library [`generics-sop`](https://hackage.haskell.org/package/generics-sop). And recently, @arianvp's `generics-mrsop`; a mutually recursive version of SoP.

In general, the F-algebra approach is very nice and clean: a type is given by an endo functor `F: type -> type`. For instance `a -> 1 + a` defines the maybe type.

If we want to turn this into a, say, haskell data type definition

```haskell=
data Maybe a
   = Nothing
   | Just a
```

We can take inspiration from SoP to notice that this is a sum (the constructors) of products (the constructor arguments).

Now we cannot do mutually recursive SoP, but this is where Mr. SoP comes in.

I think we can might be able to find a normal form of the endofunctors or somehow restict construction only to mrsop compatible expressions.

With this in mind we want to build an idris commandline tool that can take declarations looking like this

```haskell
maybe : type -> type
maybe a = 1 + a

list : type -> type
list a = 1 + a * list a
```

And turn them into a binary file, the serialization of the type definitions.

    tdefs pack types/base.tdef types/types.tdef -o types.tdb
    tdefs unpack types.tdb -o types/

Then you can take that and turn it into a helper library for a particular target language or system.

    tdefs compile types.tdb -T purescript -o src/Typedefs/Data


-->
