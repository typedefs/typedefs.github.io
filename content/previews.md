---
layout: base.njk
title: Typedefs — Feature Previews
---


# Feature Preview 2020-01-31

We are happy to announce a new feature coming up for Typedefs
along with a preview available on try.typedefs.com:
Specialised types.

**Disclaimer**: Keep in mind this is a preview and some things
don't exactly work as expected.

## Specialisation

Specialisation is a feature that will dramatically increase the
range of uses for Typedefs while keeping the same core language.

### Motivation

Specialisation allows Typedefs to use defintions that are not in
the current file. For example, imagine writing a typedef for
transactions:

```clojure
(name Transaction (* Hash Date Amount))
```

Typedefs has this limitation that every type has to be defined as a typedef as well.

With that in mind, how do you define `Hash`, `Date` and `Amount`
as a typedef? You might want `Hash` to be a number, or a string.

For `Date`, do you use `Int` and unix time? What about interfacing
with the `Date` type of a library?

Even if you use `Int`, how do you implement them as a typedefs?
You could define them as a product of bits like so:

```clojure

(name Bit (+ 1 1)
(name Int (* Bit Bit Bit ... Bit))
           ; \---- 64 bits ----/
```

That's slightly bizarre, because now we are representing bits as
a gigantic tuple, which makes it both unwieldy to use in your
host programming language and very inefficent.

### Specialised Types

Our solution is to introduce references to types that are not
defined anywhere and pretend they exist, until the very last
step of the compilation pipeline. We call this mechanism
"specialisation" because it allows us to use the same name to
refer to different types that are _specific_ to a certain backend
or a certain runtime. For example the `Maybe` type might be called
`Maybe` (In Haskell), `Option` (In OCaml) or `Optional` (In Java)
depending on the backend. It might not even exist! But though they
_look_ different they share the same semantics: capturing the
idea that a value might be absent.

Now we can rewrite our typedef as

```clojure
(name Amount (mu (MkAmount Int)))
(name Date (mu (MkDate Date)))
(name Hash (mu (MkHash String)))
(name Transaction (* Hash Date Amount))
```

But there is a slight problem with that: The s-expression syntax
we use matches our AST very closely. And our AST needs to know
about the specialised types we're using _before_ we use them.
For that we declare them in advance with the following syntax:

```clojure
(specialised Int)
(specialised String)
(specialised Date)

; notice we don't need Date anymore since we're using
; the specialised version of it directly
(name Amount (mu (MkAmount Int)))
(name Hash (mu (MkHash String)))
(name Transaction (* Hash Date Amount))
```

This way the compiler will look for specialised version of those
types in the selected backend and insert them in the right places.

### Type Parameters

Specialised types shine when used with type parameters (or
generics). One such example is the type `Maybe` or `Optional` or `Option`:

```clojure
(specialised Maybe 1)

(name MyBool (+ 1 1))

(name MyType (mu (MkType (Maybe Bool))))
```

You will notice a couple things are different in this snippet:

- The specialised type is followed by a number. This number
represents the _arity_ of the specialised type. In our case
`Maybe` expects 1 argument so we follow it by the number `1`. If
we wanted to declare `Either` as a specialised type, we would have
to write `(specialised Either 2)` because `Either` expects 2
arguments to be fully applied.

- We can apply a specialised type directly to already defined
types and the output will be as we expect: a
serialiser/deserialiser that assumes `encodeMaybe` and
`decodeMaybe` already exist and uses them in order to
encode/decode `MyType`.

### The Road Ahead

Specialised types are only the beginning. Not only do they allow
us to reuse types that are defined differently in different host
languages, but they also allow us to implement new features such
as typedefs imports, a standard typedefs repository, reusing
user-defined encoding/decoding function, reusing user-defined
types, and more! Stay tuned for what is coming up next.
