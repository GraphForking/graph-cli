import immutable from 'immutable'

import tsCodegen from './typescript'

module.exports = class DataSourceTemplateCodeGenerator {
  constructor(template) {
    this.template = template
  }

  generateModuleImports() {
    return [
      tsCodegen.moduleImports(
        ['Address', 'DataSourceTemplate', 'DataSourceContext'],
        '@graphprotocol/graph-ts',
      ),
    ]
  }

  generateTypes() {
    return immutable.List([this._generateTemplateType()])
  }

  _generateTemplateType() {
    const name = this.template.get('name')

    const klass = tsCodegen.klass(name, { export: true, extends: 'DataSourceTemplate' })
    klass.addMethod(this._generateCreateMethod())
    klass.addMethod(this._generateCreateWithContextMethod())
    return klass
  }

  _generateCreateMethod() {
    const name = this.template.get('name')
    const kind = this.template.get('kind')

    switch (kind) {
      case 'ethereum/contract':
        return tsCodegen.staticMethod(
          'create',
          [tsCodegen.param('address', tsCodegen.namedType('Address'))],
          tsCodegen.namedType('void'),
          `
          DataSourceTemplate.create('${name}', [address.toHex()])
          `,
        )

      default:
        throw new Error(
          `Data sources with kind != 'ethereum/contract' are not supported yet`,
        )
    }
  }

  _generateCreateWithContextMethod() {
    const name = this.template.get('name')
    const kind = this.template.get('kind')

    switch (kind) {
      case 'ethereum/contract':
        return tsCodegen.staticMethod(
          'createWithContext',
          [
            tsCodegen.param('address', tsCodegen.namedType('Address')),
            tsCodegen.param('context', tsCodegen.namedType('DataSourceContext')),
          ],
          tsCodegen.namedType('void'),
          `
          DataSourceTemplate.createWithContext('${name}', [address.toHex()], context)
          `,
        )

      default:
        throw new Error(
          `Data sources with kind != 'ethereum/contract' are not supported yet`,
        )
    }
  }
}