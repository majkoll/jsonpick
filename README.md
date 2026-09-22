# jsonpick

`jsonpick` is a command-line tool for reading a value from a JSON file or URL using a dot-separated path.

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
```
