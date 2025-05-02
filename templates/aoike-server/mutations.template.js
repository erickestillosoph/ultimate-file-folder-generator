/**
 * Default FSD template for mutations
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase
 * @param {string} component.kebabName - Component name in kebab-case
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function(component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  
  return `// Feature-Sliced Design template for ${name}
// This is a default template for the mutations type
`;
};