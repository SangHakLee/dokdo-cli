#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

/**
 * 첫 문자를 대문자로 변환하는 함수
 * @param {string} str - 변환할 문자열
 * @returns {string} - 첫 문자가 대문자인 문자열
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * JSON 스키마를 기반으로 클래스를 생성하는 함수
 * @param {string} schemaPath - JSON 스키마 파일 경로
 * @param {string} className - 생성할 클래스 이름
 * @param {string} dokdoClassName - 부모 클래스 이름
 * @param {string} builderName - 빌더 객체 이름
 * @param {string} outputPath - 출력 파일 경로
 * @param {string} style - 스타일(js 또는 java)
 */
function createClassFromSchema(schemaPath, className, dokdoClassName, builderName, outputPath, style) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    let baseName = path.basename(schemaPath, path.extname(schemaPath));

    // 스타일에 따라 클래스 이름 변환
    if (style === 'java') {
        baseName = capitalizeFirstLetter(baseName);
    }
    if (className) {
        className = (style === 'java') ? capitalizeFirstLetter(className) : className;
    } else {
        className = baseName;
    }

    const properties = schema.properties;
    let classBody = `class ${className} extends ${dokdoClassName}(class {
  constructor(${builderName} = {}) {
  `;

    for (const property in properties) {
        classBody += `
    this.${property} = ${builderName}.${property};`;
    }

    classBody += `
  }
}) {}`;

    if (!outputPath) {
        outputPath = path.join(path.dirname(schemaPath), `${className}.js`);
    }

    fs.writeFileSync(outputPath, classBody, 'utf-8');
    console.log(`Class ${className} generated at ${outputPath}`);
}

program
    .option('-c, --className <className>', 'class name for the generated class')
    .option('-d, --dokdoClassName <dokdoClassName>', 'parent class name', 'Builder')
    .option('-b, --builderName <builderName>', 'builder object name', 'builder')
    .option('-o, --output <output>', 'output file path')
    .option('-s, --style <style>', 'naming style (js or java)', 'js')
    .arguments('<schema>')
    .action((schema, options) => {
        const opts = program.opts();
        createClassFromSchema(schema, opts.className, opts.dokdoClassName, opts.builderName, opts.output, opts.style);
    });

program.parse(process.argv);
