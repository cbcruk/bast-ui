// Teaches @custom-elements-manifest/analyzer to read FAST's `Class.define({
// name, attributes })` convention, which it doesn't recognize out of the box.
// For each `.define()` call it stamps the matching class declaration with its
// tagName, marks it a custom element, and records the declared attributes.

/** @param {string} mode @param {string | undefined} converter */
function attributeType(mode, converter) {
  if (converter && /number/i.test(converter)) {
    return 'number'
  }
  if (mode === 'boolean') {
    return 'boolean'
  }

  return 'string'
}

function readStringLiteral(ts, node) {
  return node && ts.isStringLiteral(node) ? node.text : undefined
}

/** Extract `{ property, attribute, mode, converter }` entries from the array literal. */
function readAttributes(ts, arrayNode) {
  if (!arrayNode || !ts.isArrayLiteralExpression(arrayNode)) {
    return []
  }

  const attributes = []
  for (const element of arrayNode.elements) {
    if (!ts.isObjectLiteralExpression(element)) {
      continue
    }

    const fields = {}
    for (const prop of element.properties) {
      if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
        continue
      }
      const key = prop.name.text
      if (ts.isStringLiteral(prop.initializer)) {
        fields[key] = prop.initializer.text
      } else if (ts.isIdentifier(prop.initializer)) {
        fields[key] = prop.initializer.text
      }
    }

    if (fields.attribute) {
      attributes.push({
        name: fields.attribute,
        fieldName: fields.property,
        type: { text: attributeType(fields.mode ?? '', fields.converter) },
      })
    }
  }

  return attributes
}

const fastDefinePlugin = {
  name: 'bast-ui-fast-define',
  analyzePhase({ ts, node, moduleDoc }) {
    if (
      !ts.isCallExpression(node) ||
      !ts.isPropertyAccessExpression(node.expression) ||
      node.expression.name.text !== 'define' ||
      !ts.isIdentifier(node.expression.expression)
    ) {
      return
    }

    const className = node.expression.expression.text
    const config = node.arguments[0]
    if (!config || !ts.isObjectLiteralExpression(config)) {
      return
    }

    let tagName
    let attributesNode
    for (const prop of config.properties) {
      if (!ts.isPropertyAssignment(prop) || !ts.isIdentifier(prop.name)) {
        continue
      }
      if (prop.name.text === 'name') {
        tagName = readStringLiteral(ts, prop.initializer)
      } else if (prop.name.text === 'attributes') {
        attributesNode = prop.initializer
      }
    }

    if (!tagName) {
      return
    }

    const declaration = moduleDoc.declarations?.find(
      (entry) => entry.name === className && entry.kind === 'class',
    )
    if (!declaration) {
      return
    }

    declaration.customElement = true
    declaration.tagName = tagName

    const attributes = readAttributes(ts, attributesNode)
    if (attributes.length > 0) {
      declaration.attributes = attributes
    }
  },
}

export default {
  globs: ['src/**/*.ts'],
  exclude: ['src/**/*.test.ts'],
  outdir: '.',
  plugins: [fastDefinePlugin],
}
