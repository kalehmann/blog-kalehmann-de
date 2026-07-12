---
categories:       blog
date:             2026-07-12 11:52:13 +0200
description:  >-
  How to write an assembler in assembly\: 0x864 is a self-hosted x86-64
  assembler that can assemble its own code.
lang:             en
last_modified_at: 2026-07-12 11:52:13 +0200
layout:           post
tags:
  - Coding
  - OsDev
title: >-
  0x864 - a minimal self-hosted x86-64 assembler written in assembly
---

Low-level coding has fascinated me for a long time.
I did a bunch of assembly projects before, like
[Pong as a bootable floppy image][pong_post] or a
[simple bootloader for the FAT12 filesystem][bootloader_post].
For years now, I have been dreaming about writing an assembler in assembly
language.

Aside from drafting out the code on paper and writing machine code directly with
a hex editor, writing the assembler in assembly is about as low as software
development can get.
As a bonus, since the assembler is written in assembly itself, the ability to
self-host the project comes naturally.

And let's not lie, being able to assemble a hello world program with your
own assembler feels like a strong achievement.
[![Screenshot of the terminal showing a short hello world program in assembly, how it's assembled with 0x864, linked with ld, and then executed][hello_world_screenshot]][hello_world_screenshot]

By the middle of the year, I finally got around to it.
For the lulz and many insights about the x86 architecture, I created
[0x864][0x864_github] - my x86-64 assembler.

This post will provide an overview of the project, offering insights into its
development and the challenges encountered during the implementation, as well as
the future of the project.
For detailed usage instructions and current limitations, consult the
[technical documentation][0x864_docs].

## Brief overview of available features

The assembler is able to parse and assemble a limited, but versatile subset of
the x86-64 instruction set.
Only the Intel syntax is supported - that is a personal preference of mine.
I do not like the `%` prefix of registers or the offset addressing of the AT&T
syntax.
Comments are supported by _0x864_.
If a semicolon (`;`) is encountered, all characters following it until the end
of the line are treated as comment and discarded.

The set of supported instructions arose naturally while implementing the
assembler - as the ability to assemble itself is the project's primary goal,
all instructions used in the assembler's code itself were implemented.
These include:
1. arithmetic instructions `add`, `dec`, `div`, `inc`, `mul`, `neg`, `sub`
2. bitwise instructions like `and`, `or`, `xor`
3. the shift instructions `shl` and `shr`
4. data transfer instructions `lea`, `mov`, `movsb`, `movsd`, `movsq`, `movsw`,
   `pop`, `push`, `xchg`
5. control flow instructions `call`, `cmp`, `jmp`, `nop`, `retn` and conditional
   jump instructions
6. `int` and `syscall` for interaction with the operating system.

_0x864_ being able to assemble itself, shows that it can handle and support
the instruction set for an adequately complex program.
Labels are supported similarly to how _NASM_ handles them.
For example a simple function that checks if a number is even might be
implemented as

{% highlight nasm %}
is_even:
        and rdi, 1      ; Mask the least significant bit
        cmp rdi, 0      ; Check if the LSB was not set
        je .ret_true
        xor eax, eax    ; Set eax to 0 to return false
        jmp .ret

.ret_true:
        mov eax, 1      ; Set eax to 1 to return true

.ret:
        retn
{% endhighlight %}

Here the labels `.ret_true` and `.ret` are local to the `is_even` function and
internally stored and resolved as `is_even.ret_true` and `is_even.ret`.

Furthermore, labels can be declared as global at the beginning of the source file.
Global labels have `Elf64_Sym.st_info` set to `STB_GLOBAL` and can be linked
against.

The output format is controlled by a `-f` switch with the two options `-fbin`
and `-felf64` similar to how _NASM_ handles output.
The binary format just outputs the `.text` section and is only useful for
inspecting the assembled program without the overhead of the ELF format while
the ELF64 format directly generates a relocatable ELF file.

_0x864_ also supports register indirect memory addressing with an 8 or 16-bit
displacement via the ModR/M byte.
However, the SIB byte is not supported so
{% highlight nasm %}
        mov eax, [rbp - 8]
{% endhighlight %}
is supported, while
{% highlight nasm %}
        mov eax, [rsi + rcx * 4]
{% endhighlight %}
is not.

Aside from the instructions mentioned above - which are all part of the standard
x86 instruction set - _0x864_ lacks
- floating-point instructions
- SIMD instructions
- AMD-V and Intel VT-x instructions
as well as many more extensions to the x86 instruction set.

## High-level structure

The most important file in the whole repository is the C-header file
[`src/0x864.h`][src_0x864_h].
It describes the API of the assembler and defines constants as well as several
structures holding the context of the program being assembled - like tables with
symbol offsets and pointers to the buffer for the assembly text and assembled
binary code.

The parsing and assembling is all written in x86-64 assembly language in the
file [`src/0x864.s`][src_0x864_s].
Due to all functions written in assembly being exported and declared in the
header file, they can be linked against in higher-languages and tested
separately.

The directory [`tests`][tests] contains a bunch of unit tests for the internal
functions of the assembler.
These unit tests are written in C for readability and make use of the
[`acutest` library][acutest].
Furthermore the `tests/demos` subdirectory contains multiple example programs
written in assembly, which are assembled by _0x864_ and _NASM_ each and then
compared byte-for-byte.

The assembly code is independent of any external API like the libc or ABI like
the syscall interface of the operating system.
Instead it relies on the C code for interfacing with the OS.
Buffers for binary output and symbol tables are allocated on the heap using libc.
The allocation of these buffers is covered by the API of _0x864_ and handled
in [`src/0x864.c`][src_0x864_c].

Finally, [`src/harness.c`][src_harness_c] implements the actual entrypoint,
command-line argument parsing, reading the input file, calling the high-level
functions from the _0x864_ API and writing the binary output file.

Provided high-level functions are

- `assemble`: This function parses the assembly text from a provided string,
  assembles the binary code (`.text` segment) into a buffer and stores the
  offsets of all symbols inside the `.text` segment.
- `elf64_dump`: This function writes the binary relocatable .ELF contents to
  a buffer taking the already assembled binary program and symbol table
  as input.

## Defining self-hosting for _0x864_

First things first, _0x864_ cannot produce executables directly.
Tnstead, it can assemble assembly language into relocatable ELF files.
Furthermore, as mentioned earlier, some parts of the assembler are written in C
and it still requires a C compiler to build those C parts and link everything
together.
So why is it still called a self-hosted assembler?

Quoting the [Wikipedia page about self-hosting][wikipedia_self_hosting],

> Self-hosting is the use of a program as part of the toolchain [...]
that produces new versions of that same program

and that is exactly what _0x864_ does - it replaces _NASM_ as an assembler in
its own build chain.

## Notable insights

1. Even if most functions implemented in assembly language inside _0x864_ are
   only called by other assembly functions, following the
   [calling conventions of the System V ABI][system_v_abi] adds significant value
   as
   - first, calling functions is straightforward if their arguments are known,
     as the way the arguments are passed to the function follows from the
     calling conventions.
   - second, these functions are compatible with other languages that use the
     same calling conventions.
     They can be easily called and validated in unit tests or be used by a
     harness around the assembly code.
2. Since the assembly code in _0x864_ does not link against the libc directly
   and therefore lacks access to functions like `strncmp`, nor does _0x864_
   support storing data, such as strings, in the `.data` segment, checking for
   keywords like opcodes is a challenge.
   Since mnemonics for opcodes are generally short (less than 8 characters in
   length), a string containing them can be stored in a single register as an
   integer.
   Taking a look at the ASCII table

   | Letter | ASCII code (hex) |
   |--------|------------------|
   | ...    | ...              |
   | `a`    | 0x61             |
   | `b`    | 0x62             |
   | `c`    | 0x63             |
   | `d`    | 0x64             |
   | ...    | ...              |

   `add` becomes `0x646461`, with the first letter being stored in the least
   significant byte.
   Then, a simple assembly function that mimics the behavior of the C-function

   ```c
   int testinst(const char *assembly_text, uint64_t encoded_instruction)
   {
           for (char c; (c = encoded_instruction & 0xff) != 0;) {
                   if (c != *(assembly_text++))
                           return 0;

                   encoded_instruction >>= 8;
           }

           // Check for newline, space, null-terminator, ...
           return is_opcode_delimiter(assembly_text);
   }
   ```
   can be used to check if the current position in the assembly code is the
   start of the `add` instruction with

   ```nasm
           mov rsi, 0x646461       ; add
           call .testinst
           cmp rax, 1
           jne .check_next_instruction
           lea rsi, [rbp - 32]     ; Load additional argument for as_add
           call as_add
   ```
   That provides an easy way to check for (short) strings without implementing
   `.data` segment handling to store data that is not code.
3. Some instructions are really similar in the way they are encoded.
   For example, there are many instructions which can be described in 5 cases,
   where for each case the operand-size override prefix is used for the 16-bit
   operation and the REX prefix for the 64-bit operation and the opcodes follow
   the logic, that the opcodes for the 64/32/16-bit operation are just the
   opcode for the 8-bit operation plus one.
   These cases are

   1. the destination is the `rax`, `eax`, `ax`, `al` register and the source
      an immediate with the same size as the register or in the case of the
      `rax` register a 32-bit immediate, that will be sign-extended for 64-bit.
   2. the destination is a register or memory address described by the
      ModRM:r/m bits, an additional 3-bit integer defining the operation is
      stored in the ModRM:reg bits and the source is an immediate with the
      size of the register except for a 64-bit register, where the source is
      a 32-bit immediate sign-extended to 64-bit.
   3. the same as case 2, but an 8-bit immediate is sign-extended to the
      operation size.
   4. the destination is a register or memory address described by the
      ModRM:r/m bits and the source is another register.
   5. the destination is a register and the source is a register or memory
      address described by the ModRM:r/m bits.

   That's a lot of logic but fortunately these cases describe a bunch of
   instructions like `add`, `and`, `cmp`, `or`, `sub`, `xor`.

   _0x864_ has a generic implementation for them in the form of the
   `as_genop2ax32` (Assemble generic operation with two operands, special `ax`
   handling and immediates up to 32 bits) function.
   That function has the declaration

   ```c
   enum AsmErr as_genop2ax32(struct AsmCtx *ctx, struct AsmOp *op,
                             uint8_t op_al_imm8, uint8_t op_rimm8,
                             uint8_t op_rsimm8, uint8_t op_rmr8,
                             uint8_t op_rrm8, uint8_t modrm_reg);
   ```

   where `ctx` and `op` are internal structures of the assembler, the next five
   arguments are just the opcodes for the 8-bit operation of each case
   mentioned above and the final argument `modrm_reg` is the 3-bit integer
   encoded in the ModRM:reg bits in cases 2 and 3.

   With this generic implementation, assembling an instruction like `add`
   becomes as simple as

   ```nasm
   ;;; rdi: `struct AsmCtx *ctx`
   ;;; rsi: `struct AsmOp *op`
   as_add:
           push rbp
           mov rbp, rsp
           sub rsp, 16

           mov edx, 0x04           ; uint8_t op_al_imm8 = 0x04
           mov ecx, 0x80           ; uint8_t op_rimm8 = 0x80
           mov r8d, 0x83           ; uint8_t op_rsimm8 = 0x83
           mov r9d, 0x00           ; uint8_t op_rmr8 = 0x00
           mov eax, 0x02
           mov [rbp - 16], rax     ; uint8_t op_rrm8 = 0x02
           xor eax, eax
           mov [rbp - 8], rax      ; uint8_t modrm_mod = 0
           call as_genop2ax32

           mov rsp, rbp
           pop rbp
           retn
   ```
4. Error handling is important and improves the developer experience.
   The project was started under the assumption that _0x864_ would only ever
   encounter valid input files.
   That assumption quickly turned out to be wrong.
   Silly errors like a misspelled instruction still happen and investigating why
   the assembler silently exited is tedious.

   Therefore the enum `AsmErr` was introduced, which defines constants for
   common errors like for example
   - an unknown instruction
   - invalid operand types for an instruction
   - a reference to an unknown label

   Finally, the harness was extended with a `print_error` function that
   prints a human-readable description for the constants of the `AsmErr`
   enumeration.

## Possible next steps

Removing the dependency on the C compiler for the build chain would be a great
path forward for the project.
Since the C-code currently handles all the interfacing with the operating system
and the libc, removing it would require the implementation of the `extern`
keyword, so that the ELF file assembled by _0x864_ can be linked against the
libc directly.
That would be some work implementing the generation of relocation tables in the
ELF64 output, but generally doable.

In addition, I'd really like to explore the idea of generating EFI executables
for writing code that is bootable on a modern x86 system directly in assembly.

## Conclusion

Writing an assembler in assembly is surprisingly doable.
Working on the first half of the project felt rather dull, as there was little
visible progress.
Then, about halfway through the project - when it could assemble the first
minimal programs - hacking the project together became a joy.
With a solid foundation, additional features could be added quite easily and
were directly visible with the ability to assemble further demo programs.
Also, the path forward changed from a labyrinth to a clear road as the demand
for new instructions to implement directly emerged from the codebase of _0x864_
itself.

It was a great little project for me and I really enjoyed the late nights I
spent hacking it together and gaining new insights into the x86 architecture.

## Further reading

1. [OsDev.org, "X86-64 Instruction Encoding"][osdev_instruction_encoding]
2. [NASM - The Netwide Assembler, Documentation of version 3.02][nasm_3_02_docs]
3. [0x864 API documentation][0x864_api]

  [0x864_api]: https://docs.kalehmann.de/0x864/0x864_8h.html
  [0x864_docs]: https://docs.kalehmann.de/0x864/
  [0x864_github]: https://github.com/kalehmann/0x864
  [acutest]: https://github.com/mity/acutest
  [bootloader_post]: {% post_url 2017-07-20-simple-boot-loader %}
  [hello_world_screenshot]: {{ "assets/2026-07-0x864/hello_world.avif" | absolute_url }}
  [nasm_3_02_docs]: https://www.nasm.us/docs/3.02/
  [osdev_instruction_encoding]: https://wiki.osdev.org/X86-64_Instruction_Encoding
  [pong_post]: {% post_url 2016-07-13-pong %}
  [src_0x864_c]: https://github.com/kalehmann/0x864/blob/v0.1.0/src/0x864.c
  [src_0x864_h]: https://github.com/kalehmann/0x864/blob/v0.1.0/src/0x864.h
  [src_0x864_s]: https://github.com/kalehmann/0x864/blob/v0.1.0/src/0x864.s
  [src_harness_c]: https://github.com/kalehmann/0x864/blob/v0.1.0/src/harness.c
  [system_v_abi]: https://wiki.osdev.org/System_V_ABI#x86-64
  [tests]: https://github.com/kalehmann/0x864/blob/v0.1.0/tests/
  [wikipedia_self_hosting]: https://en.wikipedia.org/w/index.php?title=Self-hosting_(compilers)&oldid=1333192171
