const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dokdoCli = path.join(__dirname, '..', 'dokdo-cli.js');
const schemaFile = path.join(__dirname, 'user.json');

beforeAll(() => {
});

afterAll(() => {
    cleanUp();
});

const trim = (str) => str.replace(/\s+/g, '');

const cleanUp = () => {
    const directory = path.join(__dirname, '..', '/test');
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        if (file.endsWith('.js') && !file.endsWith('.test.js')) {
            const filePath = path.join(directory, file);
            fs.unlinkSync(filePath);
        }
    });
};

describe('generateClass CLI tool', () => {
    test('generates class with default settings', () => {
        execSync(`node ${dokdoCli} ${schemaFile}`);
        const outputPath = path.join(__dirname, 'user.js');

        expect(fs.existsSync(outputPath)).toBe(true);
        expect(
            trim(fs.readFileSync(outputPath, 'utf-8'))
        ).toEqual(
            trim(`class user extends Builder(class {
              constructor(builder = {}) {

                this.firstName = builder.firstName;
                this.lastName = builder.lastName;
                this.email = builder.email;
                this.money = builder.money;
              }
            }) {}`)
        );
    });

    test('generates class with custom class name', () => {
        execSync(`node ${dokdoCli} -c CustomUser ${schemaFile}`);
        const outputPath = path.join(__dirname, 'CustomUser.js');

        expect(fs.existsSync(outputPath)).toBe(true);
        expect(
            trim(fs.readFileSync(outputPath, 'utf-8'))
        ).toEqual(
            trim(`class CustomUser extends Builder(class {
              constructor(builder = {}) {

                this.firstName = builder.firstName;
                this.lastName = builder.lastName;
                this.email = builder.email;
                this.money = builder.money;
              }
            }) {}`)
        );
    });

    test('generates class with java style', () => {
        execSync(`node ${dokdoCli} -s java ${schemaFile}`);
        const outputPath = path.join(__dirname, 'User.js');

        expect(fs.existsSync(outputPath)).toBe(true);
        expect(
            trim(fs.readFileSync(outputPath, 'utf-8'))
        ).toEqual(
            trim(`class User extends Builder(class {
              constructor(builder = {}) {

                this.firstName = builder.firstName;
                this.lastName = builder.lastName;
                this.email = builder.email;
                this.money = builder.money;
              }
            }) {}`)
        );
    });

    test('generates class with custom output path', () => {
        execSync(`node ${dokdoCli} -o test/newUser.js ${schemaFile}`);
        const outputPath = path.join(__dirname, 'newUser.js');

        expect(fs.existsSync(outputPath)).toBe(true);
        expect(
            trim(fs.readFileSync(outputPath, 'utf-8'))
        ).toEqual(
            trim(`class user extends Builder(class {
              constructor(builder = {}) {

                this.firstName = builder.firstName;
                this.lastName = builder.lastName;
                this.email = builder.email;
                this.money = builder.money;
              }
            }) {}`)
        );
    });

    test('generates class with all options', () => {
        execSync(`node ${dokdoCli} -c sanghak -d MyBuilder -b innerBuilder -o test/client.js -s java ${schemaFile}`);
        const outputPath = path.join(__dirname, 'client.js');

        expect(fs.existsSync(outputPath)).toBe(true);
        expect(
            trim(fs.readFileSync(outputPath, 'utf-8'))
        ).toEqual(
            trim(`class Sanghak extends MyBuilder(class {
              constructor(innerBuilder = {}) {

                this.firstName = innerBuilder.firstName;
                this.lastName = innerBuilder.lastName;
                this.email = innerBuilder.email;
                this.money = innerBuilder.money;
              }
            }) {}`)
        );
    });
});
