# jsonpick

`jsonpick` is a command-line tool for reading a value from a JSON file or URL using a dot-separated path, including numeric array indexes.

```sh
jsonpick data.json user.name
```

## Install

Install globally from npm:

```sh
npm install --global jsonpick
```

To install a local checkout instead:

```sh
npm install
npm run build
npm link
```

After installation, the `jsonpick` command is available globally.

## Usage

```sh
jsonpick [file|url] path
```

For example:

```sh
jsonpick ./package.json engines
jsonpick data.json user.name
jsonpick data.json members.1.name
```

## Shell scripting

String, number, and boolean values are printed without JSON quotes, so they can be captured directly in shell variables:

```sh
VERSION=$(jsonpick package.json version)
echo "$VERSION"
# 0.0.0
```

Objects and arrays are printed as formatted JSON.
