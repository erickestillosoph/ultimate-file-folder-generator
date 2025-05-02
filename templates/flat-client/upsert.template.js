/**
 * Template for query hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {string} component.queryTableName
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

module.exports = function (component, index) {
  const { name, queryTableName } = component;
  return `mutation Upsert${queryTableName}(
  $object: ${queryTableName}InsertInput!
  $onConflict: ${queryTableName}OnConflict
) {
  insert${queryTableName}(object: $object, onConflict: $onConflict) {
    ...${queryTableName}
  }
}
`;
};
