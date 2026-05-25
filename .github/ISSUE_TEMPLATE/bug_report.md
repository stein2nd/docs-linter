---
name: Bug report
about: Report a bug, regression, or unexpected behavior in S2J Docs Linter
title: "[Bug] "
labels: bug
assignees: ""
---

## Summary

Describe the issue clearly.

Example:

* CLI fails unexpectedly
* preset config does not resolve
* GitHub Actions lint fails
* npm package behavior differs from documentation

## Environment

### OS

Example:

```text
macOS 26
Windows 11
Ubuntu 24.04
```

### Node.js version

Output:

```bash
node -v
```

Example:

```text
v24.3.0
```

### npm version

Output:

```bash
npm -v
```

### S2J Docs Linter version

Output:

```bash
npm list @s2j/docs-linter
```

### textlint version (if relevant)

Output:

```bash
npx textlint --version
```

## Reproduction Steps

Steps to reproduce:

1.
2.
3.

Example:

1. install package
2. configure `.textlintrc.json`
3. run `npm run lint:docs`

## Configuration

Relevant config snippets.

Example:

### `.textlintrc.json`

```json
{
  "extends": [
    "./node_modules/@s2j/docs-linter/presets/base/.textlintrc.base.json"
  ]
}
```

### package.json scripts

```json
{
  "scripts": {
    "lint:docs": "npx s2j-docs-linter ./README.md"
  }
}
```

## Expected Behavior

Describe expected behavior.

## Actual Behavior

Describe actual behavior.

Include full error output if available.

```text
paste logs here
```

## Additional Context

Optional:

* CI environment
* GitHub Actions workflow
* migration context
* compatibility notes
