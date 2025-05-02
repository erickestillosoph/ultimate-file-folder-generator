/**
 * Template for fragment files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name } = component;
  const pascalName = `${name}`;
  return `
fragment ${pascalName}Fragment on ${pascalName} {
  id
  name
  created_at
  data
}
`;
};
