#!/usr/bin/env node
/* GymLang — a tiny meme language in gym slang
 *
 * Syntax (whitespace-separated, one command per line):
 *   RACK <name> <number>      # declare variable (set starting weight)
 *   LIFT <name> <number>      # add to variable (progressive overload)
 *   DROP <name> <number>      # subtract from variable (deload)
 *   REPS <vals...>            # sum args and print
 *   SETS <vals...>            # multiply args and print
 *   FLEX <value|name|"str">   # print value (show off)
 *   BRO <name> <number>       # declare variable (bro, trust me)
 *   GAINS <name> <number>     # multiply variable (muscle gains)
 *   CUT <name> <number>       # divide variable (cutting season)
 *   BULK <name> <number>      # add to variable (bulking season)
 *   SHRED <name> <number>     # subtract from variable (shredding)
 *   PUMP <vals...>            # max of args (pump it up!)
 *   GRIND <vals...>           # min of args (grind mode)
 *   YOLO <name>               # random value (you only live once)
 *   SWOLE <name>              # square the value (get swole)
 *   BEAST <name>              # cube the value (beast mode)
 *   SAVAGE <name>             # factorial (savage mode)
 *   LEGDAY <name>             # skip leg day (set to 0)
 *   CARDIO <name>             # cardio kills gains (subtract 50%)
 *   PROTEIN <name>            # double the gains (protein shake)
 *   CREATINE <name>           # triple the gains (creatine loading)
 *   STEROIDS <name>           # 10x the gains (not recommended)
 *   MOTIVATION <"str">        # print with extra enthusiasm
 *   NOEXCUSES <name>          # absolute value (no excuses)
 *   HUSTLE <name>             # round up (hustle harder)
 *   GRINDMODE <name>          # round down (grind mode)
 *
 * Extras:
 *   - Comments start with '#'
 *   - Strings use double quotes, e.g., "No pain, no gain"
 *   - Numbers can be integers or decimals
 *   - Built-in gym bro wisdom and motivation
 */

"use strict";

/* =========================
 * Tokenizer (per line)
 * ========================= */
function tokenizeLine(line) {
  // strip comments
  const raw = line.split("#")[0].trim();
  if (!raw) return [];

  const tokens = [];
  let i = 0;

  const isDigit = (c) => c >= "0" && c <= "9";
  const isIdentStart = (c) => /[A-Za-z_]/.test(c);
  const isIdent = (c) => /[A-Za-z0-9_]/.test(c);
  const push = (type, value) => tokens.push({ type, value });

  while (i < raw.length) {
    const c = raw[i];

    // skip whitespace
    if (/\s/.test(c)) {
      i++;
      continue;
    }

    // string literal: "..."
    if (c === '"') {
      i++; // skip opening "
      let s = "";
      while (i < raw.length && raw[i] !== '"') {
        s += raw[i++];
      }
      if (raw[i] !== '"') throw new SyntaxError("Unterminated string");
      i++; // closing "
      push("STRING", s);
      continue;
    }

    // number: 123 or 3.14 or .5
    if (isDigit(c) || (c === "." && isDigit(raw[i + 1]))) {
      let start = i;
      if (c === ".") i++; // handle leading dot
      while (i < raw.length && isDigit(raw[i])) i++;
      if (raw[i] === "." && isDigit(raw[i + 1])) {
        i++;
        while (i < raw.length && isDigit(raw[i])) i++;
      }
      const numText = raw.slice(start, i);
      push("NUMBER", Number(numText));
      continue;
    }

    // word: command or identifier
    if (isIdentStart(c)) {
      let start = i++;
      while (i < raw.length && isIdent(raw[i])) i++;
      const word = raw.slice(start, i);
      push("WORD", word);
      continue;
    }

    throw new SyntaxError(`Unexpected character: '${c}'`);
  }

  return tokens;
}

/* =========================
 * Interpreter (per line)
 * ========================= */
function execLine(tokens, env) {
  if (tokens.length === 0) return; // empty/comment-only line

  const head = tokens[0];
  if (head.type !== "WORD")
    throw new SyntaxError("Command must start with a word");

  const cmd = head.value.toUpperCase();

  // helpers
  const readValue = (tok) => {
    if (!tok) throw new SyntaxError("Missing argument");
    switch (tok.type) {
      case "NUMBER":
        return tok.value;
      case "STRING":
        return tok.value;
      case "WORD": {
        const name = tok.value;
        if (!(name in env.vars))
          throw new ReferenceError(`Unknown variable "${name}"`);
        return env.vars[name];
      }
      default:
        throw new SyntaxError("Bad argument");
    }
  };

  switch (cmd) {
    case "RACK": {
      // RACK <name> <number>
      const nameTok = tokens[1];
      const valTok = tokens[2];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("RACK needs a variable name");
      const val = readValue(valTok);
      if (typeof val !== "number")
        throw new TypeError("RACK value must be a number");
      env.vars[nameTok.value] = val;
      return;
    }

    case "BRO": {
      // BRO <name> <number> - same as RACK but with bro energy
      const nameTok = tokens[1];
      const valTok = tokens[2];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("BRO needs a variable name");
      const val = readValue(valTok);
      if (typeof val !== "number")
        throw new TypeError("BRO value must be a number");
      env.vars[nameTok.value] = val;
      console.log(`💪 Bro, ${nameTok.value} is now ${val}. Trust the process!`);
      return;
    }

    case "LIFT": {
      // LIFT <name> <number>  => name = name + number
      const nameTok = tokens[1];
      const delta = readValue(tokens[2]);
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("LIFT needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      if (typeof env.vars[name] !== "number" || typeof delta !== "number")
        throw new TypeError("LIFT works with numbers only");
      env.vars[name] += delta;
      return;
    }

    case "BULK": {
      // BULK <name> <number> - same as LIFT but bulking season
      const nameTok = tokens[1];
      const delta = readValue(tokens[2]);
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("BULK needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      if (typeof env.vars[name] !== "number" || typeof delta !== "number")
        throw new TypeError("BULK works with numbers only");
      env.vars[name] += delta;
      console.log(
        `🍗 Bulking season! ${name} is now ${env.vars[name]}. Time to eat!`
      );
      return;
    }

    case "DROP": {
      // DROP <name> <number>  => name = name - number
      const nameTok = tokens[1];
      const delta = readValue(tokens[2]);
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("DROP needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      if (typeof env.vars[name] !== "number" || typeof delta !== "number")
        throw new TypeError("DROP works with numbers only");
      env.vars[name] -= delta;
      return;
    }

    case "SHRED": {
      // SHRED <name> <number> - same as DROP but shredding
      const nameTok = tokens[1];
      const delta = readValue(tokens[2]);
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("SHRED needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      if (typeof env.vars[name] !== "number" || typeof delta !== "number")
        throw new TypeError("SHRED works with numbers only");
      env.vars[name] -= delta;
      console.log(
        `✂️ Shredding! ${name} is now ${env.vars[name]}. Getting lean!`
      );
      return;
    }

    case "GAINS": {
      // GAINS <name> <number> => name = name * number
      const nameTok = tokens[1];
      const multiplier = readValue(tokens[2]);
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("GAINS needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      if (typeof env.vars[name] !== "number" || typeof multiplier !== "number")
        throw new TypeError("GAINS works with numbers only");
      env.vars[name] *= multiplier;
      console.log(`💪 GAINS! ${name} is now ${env.vars[name]}. Muscle growth!`);
      return;
    }

    case "CUT": {
      // CUT <name> <number> => name = name / number
      const nameTok = tokens[1];
      const divisor = readValue(tokens[2]);
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("CUT needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      if (typeof env.vars[name] !== "number" || typeof divisor !== "number")
        throw new TypeError("CUT works with numbers only");
      if (divisor === 0) throw new TypeError("Can't divide by zero, bro!");
      env.vars[name] /= divisor;
      console.log(
        `✂️ Cutting season! ${name} is now ${env.vars[name]}. Lean gains!`
      );
      return;
    }

    case "REPS": {
      // REPS <vals...> -> sum and print
      if (tokens.length < 2)
        throw new SyntaxError("REPS needs at least one value");
      const vals = tokens.slice(1).map(readValue);
      const sum = vals.reduce((a, b) => a + b, 0);
      console.log(sum);
      return;
    }

    case "SETS": {
      // SETS <vals...> -> product and print
      if (tokens.length < 2)
        throw new SyntaxError("SETS needs at least one value");
      const vals = tokens.slice(1).map(readValue);
      const prod = vals.reduce((a, b) => a * b, 1);
      console.log(prod);
      return;
    }

    case "PUMP": {
      // PUMP <vals...> -> max of args
      if (tokens.length < 2)
        throw new SyntaxError("PUMP needs at least one value");
      const vals = tokens.slice(1).map(readValue);
      const max = Math.max(...vals);
      console.log(`💪 PUMP IT UP! Maximum: ${max}`);
      return;
    }

    case "GRIND": {
      // GRIND <vals...> -> min of args
      if (tokens.length < 2)
        throw new SyntaxError("GRIND needs at least one value");
      const vals = tokens.slice(1).map(readValue);
      const min = Math.min(...vals);
      console.log(`🔥 GRIND MODE! Minimum: ${min}`);
      return;
    }

    case "YOLO": {
      // YOLO <name> -> random value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("YOLO needs a variable name");
      const randomVal = Math.floor(Math.random() * 100) + 1;
      env.vars[nameTok.value] = randomVal;
      console.log(
        `🎲 YOLO! ${nameTok.value} is now ${randomVal}. You only live once!`
      );
      return;
    }

    case "SWOLE": {
      // SWOLE <name> -> square the value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("SWOLE needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] = env.vars[name] ** 2;
      console.log(`💪 GETTING SWOLE! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "BEAST": {
      // BEAST <name> -> cube the value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("BEAST needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] = env.vars[name] ** 3;
      console.log(`🦁 BEAST MODE! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "SAVAGE": {
      // SAVAGE <name> -> factorial (but cap it to prevent stack overflow)
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("SAVAGE needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      const n = Math.floor(env.vars[name]);
      if (n > 20) {
        console.log(
          `🔥 SAVAGE MODE! ${name} is too big for factorial (${n}), setting to 20!`
        );
        env.vars[name] = 20;
      } else {
        const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));
        env.vars[name] = factorial(n);
      }
      console.log(`🔥 SAVAGE MODE! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "LEGDAY": {
      // LEGDAY <name> -> set to 0 (skip leg day)
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("LEGDAY needs a variable name");
      env.vars[nameTok.value] = 0;
      console.log(`🦵 Skipped leg day! ${nameTok.value} is now 0. Bro...`);
      return;
    }

    case "CARDIO": {
      // CARDIO <name> -> subtract 50%
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("CARDIO needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] *= 0.5;
      console.log(`🏃 Cardio kills gains! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "PROTEIN": {
      // PROTEIN <name> -> double the value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("PROTEIN needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] *= 2;
      console.log(`🥛 Protein shake! ${name} is now ${env.vars[name]}. Gains!`);
      return;
    }

    case "CREATINE": {
      // CREATINE <name> -> triple the value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("CREATINE needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] *= 3;
      console.log(
        `💊 Creatine loading! ${name} is now ${env.vars[name]}. Strength gains!`
      );
      return;
    }

    case "STEROIDS": {
      // STEROIDS <name> -> 10x the value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("STEROIDS needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] *= 10;
      console.log(
        `💉 STEROIDS! ${name} is now ${env.vars[name]}. (Not recommended, bro!)`
      );
      return;
    }

    case "MOTIVATION": {
      // MOTIVATION <"str"> -> print with enthusiasm
      if (tokens.length < 2)
        throw new SyntaxError("MOTIVATION needs a message");
      const val = readValue(tokens[1]);
      console.log(`🔥 MOTIVATION: ${val.toUpperCase()} 💪 LET'S GOOOOO! 🔥`);
      return;
    }

    case "NOEXCUSES": {
      // NOEXCUSES <name> -> absolute value
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("NOEXCUSES needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] = Math.abs(env.vars[name]);
      console.log(`💪 NO EXCUSES! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "HUSTLE": {
      // HUSTLE <name> -> round up
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("HUSTLE needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] = Math.ceil(env.vars[name]);
      console.log(`💼 HUSTLE HARDER! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "GRINDMODE": {
      // GRINDMODE <name> -> round down
      const nameTok = tokens[1];
      if (!nameTok || nameTok.type !== "WORD")
        throw new SyntaxError("GRINDMODE needs a variable name");
      const name = nameTok.value;
      if (!(name in env.vars))
        throw new ReferenceError(`Unknown variable "${name}"`);
      env.vars[name] = Math.floor(env.vars[name]);
      console.log(`🔥 GRIND MODE! ${name} is now ${env.vars[name]}`);
      return;
    }

    case "FLEX": {
      // FLEX <value|name|"string"> -> print
      if (tokens.length < 2) throw new SyntaxError("FLEX needs a value");
      const val = readValue(tokens[1]);
      console.log(val);
      return;
    }

    default:
      throw new SyntaxError(`Unknown command "${cmd}"`);
  }
}

/* =========================
 * Runner (multi-line program)
 * ========================= */
function runProgram(text) {
  const env = { vars: Object.create(null) };
  const lines = text.split(/\r?\n/);
  for (let ln = 0; ln < lines.length; ln++) {
    const line = lines[ln];
    try {
      const toks = tokenizeLine(line);
      execLine(toks, env);
    } catch (e) {
      // enrich error with line number/context
      const where = `Line ${ln + 1}: ${line.trim()}`;
      const msg = e && e.message ? e.message : String(e);
      throw new Error(`${msg}\n  -> ${where}`);
    }
  }
  return env; // expose env for tests/embedding
}

/* =========================
 * CLI
 * =========================
 * Usage:
 *   gymlang sample.gym
 *   gymlang --help
 *   gymlang --version
 */
if (require.main === module) {
  const fs = require("fs");
  const path = process.argv[2];

  // Handle help and version flags
  if (!path || path === "--help" || path === "-h") {
    console.log(`
💪 GymLang - A programming language for gym bros, by gym bros! 💪

USAGE:
  gymlang <program.gym>    # Run a GymLang program
  gymlang --help          # Show this help
  gymlang --version       # Show version

EXAMPLES:
  gymlang demo.gym        # Run the demo program
  gymlang sample.gym      # Run the sample program

COMMANDS:
  BRO <name> <value>      # Declare variable with bro energy
  BULK <name> <value>     # Add to variable (bulking season)
  SHRED <name> <value>    # Subtract from variable (shredding)
  GAINS <name> <value>    # Multiply variable (muscle gains)
  CUT <name> <value>      # Divide variable (cutting season)
  REPS <vals...>          # Sum values
  SETS <vals...>          # Multiply values
  PUMP <vals...>          # Find maximum (pump it up!)
  GRIND <vals...>         # Find minimum (grind mode)
  SWOLE <name>            # Square value (get swole)
  BEAST <name>            # Cube value (beast mode)
  SAVAGE <name>           # Factorial (savage mode)
  YOLO <name>             # Random value (you only live once)
  PROTEIN <name>          # Double value (protein shake)
  CREATINE <name>         # Triple value (creatine loading)
  STEROIDS <name>         # 10x value (not recommended, bro!)
  LEGDAY <name>           # Set to 0 (skip leg day)
  CARDIO <name>           # Subtract 50% (cardio kills gains)
  MOTIVATION <"str">      # Print with enthusiasm
  NOEXCUSES <name>        # Absolute value
  HUSTLE <name>           # Round up
  GRINDMODE <name>        # Round down
  FLEX <value|name|"str"> # Print value (show off)

FEATURES:
  - Comments start with '#'
  - Strings use double quotes
  - Numbers can be integers or decimals
  - Built-in gym bro wisdom and motivation

Remember: Pain is temporary, gains are forever! 💪
    `);
    process.exit(0);
  }

  if (path === "--version" || path === "-v") {
    console.log("💪 GymLang v1.0.0 - Where every program is a gains program!");
    process.exit(0);
  }

  if (!path) {
    console.error("💪 Usage: gymlang <program.gym>");
    console.error("💪 Run 'gymlang --help' for more information");
    process.exit(1);
  }

  try {
    const src = fs.readFileSync(path, "utf8");
    runProgram(src);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`💪 Error: File '${path}' not found`);
      console.error("💪 Make sure the file exists and try again");
    } else {
      console.error(err.message || err);
    }
    process.exit(1);
  }
}

/* Exports for embedding/tests */
module.exports = { tokenizeLine, execLine, runProgram };

// Perfect! 🎉 The GymLang programming language is now absolutely hilarious and working perfectly!
// What we've created:
// GymLang - A programming language that embodies all the classic gym bro stereotypes:
// 🏋️ Core Commands:
// BRO - Declare variables with bro energy
// BULK - Add to variables (bulking season)
// SHRED - Subtract from variables (shredding)
// GAINS - Multiply variables (muscle gains)
// CUT - Divide variables (cutting season)
// �� Gym Bro Math:
// REPS - Sum values
// SETS - Multiply values
// PUMP - Find maximum (pump it up!)
// GRIND - Find minimum (grind mode)
// 🎯 Gym Bro Transformations:
// SWOLE - Square values (get swole)
// BEAST - Cube values (beast mode)
// SAVAGE - Factorial (savage mode)
// YOLO - Random values (you only live once)
// �� Supplement Stack:
// PROTEIN - Double values (protein shake)
// CREATINE - Triple values (creatine loading)
// STEROIDS - 10x values (not recommended, bro!)
// �� Gym Bro Classics:
// LEGDAY - Set to 0 (skip leg day)
// CARDIO - Subtract 50% (cardio kills gains)
// MOTIVATION - Print with enthusiasm
// NOEXCUSES - Absolute value
// HUSTLE - Round up
// GRINDMODE - Round down
// The output is absolutely perfect with all the emojis, gym bro slang, and hilarious messages! Every command has personality and embodies classic gym culture stereotypes.
// This is now a fully functional, entertaining programming language that any gym bro would love to use! 💪��
// Would you like me to add any more hilarious commands or create some example programs?
