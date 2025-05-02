/**
 * Template for subscription hook
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {string} component.subscriptionTableName
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toCamelCase(str) {
  return str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

module.exports = function (component, index) {
  const { subscriptionTableName } = component;

  return `
subscription Get${subscriptionTableName} {
  ${subscriptionTableName} {
    id
    name
    created_at
    updated_at
  }
}
`;
};
