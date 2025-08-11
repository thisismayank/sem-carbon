# GymLang 💪

**A programming language for gym bros, by gym bros. Where every program is a gains program!**

[![npm version](https://badge.fury.io/js/gymlang.svg)](https://badge.fury.io/js/gymlang)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🏋️ Installation

```bash
npm install -g gymlang
```

## 🚀 Quick Start

```bash
# Run a program
gymlang program.gym

# Or use Node.js directly
node gymlang.js program.gym
```

## 📝 Syntax

GymLang uses a simple, bro-friendly syntax. One command per line:

```gym
# Set up your starting weights
BRO bench 135
BRO squat 185
BRO deadlift 225

# Progressive overload (bulking season)
BULK bench 10
BULK squat 15

# Get those gains!
GAINS bench 1.5
SWOLE bench

# Show off your progress
FLEX bench
FLEX squat

# Some motivation
MOTIVATION "No pain, no gain"
```

## 🏋️ Core Commands

### Variable Management

- `BRO <name> <value>` - Declare variable with bro energy
- `BULK <name> <value>` - Add to variable (bulking season)
- `SHRED <name> <value>` - Subtract from variable (shredding)
- `GAINS <name> <value>` - Multiply variable (muscle gains)
- `CUT <name> <value>` - Divide variable (cutting season)

### Math Operations

- `REPS <vals...>` - Sum values
- `SETS <vals...>` - Multiply values
- `PUMP <vals...>` - Find maximum (pump it up!)
- `GRIND <vals...>` - Find minimum (grind mode)

### Transformations

- `SWOLE <name>` - Square value (get swole)
- `BEAST <name>` - Cube value (beast mode)
- `SAVAGE <name>` - Factorial (savage mode)
- `YOLO <name>` - Random value (you only live once)

### Supplements

- `PROTEIN <name>` - Double value (protein shake)
- `CREATINE <name>` - Triple value (creatine loading)
- `STEROIDS <name>` - 10x value (not recommended, bro!)

### Gym Bro Classics

- `LEGDAY <name>` - Set to 0 (skip leg day)
- `CARDIO <name>` - Subtract 50% (cardio kills gains)
- `MOTIVATION <"str">` - Print with enthusiasm
- `NOEXCUSES <name>` - Absolute value
- `HUSTLE <name>` - Round up
- `GRINDMODE <name>` - Round down
- `FLEX <value|name|"str">` - Print value (show off)

## 📚 Examples

### Basic Workout Program

```gym
# Starting weights
BRO bench 135
BRO squat 185

# Progressive overload
BULK bench 5
BULK squat 10

# Get swole
SWOLE bench
PROTEIN squat

# Show results
FLEX bench
FLEX squat
```

### Advanced Bro Math

```gym
BRO x 10
BRO y 5

# Bro math operations
REPS x y 15
SETS x y 3
PUMP x y 20
GRIND x y 5

# Transformations
BEAST x
SAVAGE y
YOLO random
```

## 🎯 Features

- **Bro-friendly syntax** - Easy to learn, hard to master
- **Built-in motivation** - Every command has personality
- **Gym culture integration** - Real gym bro terminology
- **Error handling** - Helpful error messages with bro energy
- **Cross-platform** - Works on any system with Node.js

## 🤝 Contributing

Want to add more gym bro commands? Fork this repo and submit a pull request!

### Adding New Commands

1. Fork the repository
2. Add your command to the `execLine` function in `gymlang.js`
3. Update the documentation
4. Submit a pull request

## 📄 License

MIT License - feel free to use this for your gains!

## 🙏 Acknowledgments

- All the gym bros who inspired this language
- The bro code that keeps us together
- Protein shakes and creatine for the gains

---

**Remember: Pain is temporary, gains are forever! 💪**
