# jsonpick

`jsonpick` is a command-line tool for reading a value from a JSON file, URL, or standard input using a dot-separated path. Numeric path segments select array items.

```sh
jsonpick data.json user.name
jsonpick data.json members.1.name
```

## Install

Install globally from npm:

```sh
npm install --global @majkoll/jsonpick
```

The package is scoped, but the installed command is still `jsonpick`.

To install a local checkout instead:

```sh
npm install
npm run build
npm link
```

## Usage

```sh
jsonpick [--compact|-c] [file|url|-] path
```

```sh
jsonpick ./package.json engines
jsonpick data.json user.name
jsonpick data.json members.1.name
curl -s https://jsonplaceholder.typicode.com/users/1 | jsonpick name
curl -s https://jsonplaceholder.typicode.com/users/1 | jsonpick - name
jsonpick --compact data.json user.roles
```

Run `jsonpick --help` for the full command reference and `jsonpick --version` to print the installed version.

## Shell scripting

Use `--compact` or (`-c`) to print selected objects and arrays as sinle-line JSON
Use `-` as the source to explicitly read JSON from standard input; omitting the source also reads from standard input.

String, number, and boolean values are printed without JSON quotes, so they can be captured directly in shell variables:

```sh
VERSION=$(jsonpick package.json version)
echo "$VERSION"
```

Objects and arrays are printed as formatted JSON.

## Testing

Run the local test suite:

```sh
npm test
```

Run the external integration test separately. It requires internet access and calls JSONPlaceholder:

```sh
npm run test:integration
```
