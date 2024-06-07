# Dockdo CLI
![npm](https://img.shields.io/npm/v/@sanghak/dokdo-cli)
![License](https://img.shields.io/github/license/sanghaklee/dokdo-cli)

A library that generates JavaScript class builders based on JSON Schema using the [@sanghak/dokdo](https://www.npmjs.com/package/@sanghak/dokdo) class.

## Usage
```bash
$ npm install -g dokdo-cli

$ dokdo-cli user.json
Class user generated at user.js
```

```bash
# user.json
{
    "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
        "firstName": { "type": "string" },
        "lastName": { "type": "string" },
        "email": { "type": "string" },
        "money": { "type": "number" }
    },
    "required": ["firstName", "lastName", "email", "money"]
}

$ dokdo-cli user.json
Class user generated at user.js


# user.js
class user extends Builder(class {
  constructor(builder = {}) {

    this.firstName = builder.firstName;
    this.lastName = builder.lastName;
    this.email = builder.email;
    this.money = builder.money;
  }
}) {}
```

### Options
- -c, --className <className>: Specify the class name for the generated class. (default: `JSON Schema filename`)
- -d, --dokdoClassName <dokdoClassName>: Specify the parent class name (default: `Builder`).
- -b, --builderName <builderName>: Specify the builder object name (default: `builder`).
- -o, --output <output>: Specify the output file path. (default: `JSON Schema file path`)
- -s, --style <style>: Specify the naming style (js or java, default: js).**

