/**
 * Template for mutation hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {string} component.pascalName
 * @param {string} component.mutationType
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toConstantCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase();
}
module.exports = function (component, index) {
  const { name, mutationType } = component;
  const pascalName = `${name}`;

  const getTypeMutation = () => {
    let templateContent;
    switch (mutationType) {
      case "upsert":
        templateContent = `mutation Upsert${pascalName}(
            $object: ${pascalName}InsertInput!
            $onConflict: ${pascalName}OnConflict
          ) {
            insert${pascalName}One(object: $object, onConflict: $onConflict) {
              ...${pascalName}
            }
          }`;
        break;
      case "mutation":
        templateContent = `
          mutation insert${pascalName}(
            $object: [${pascalName}InsertInput!]!
          ) {
            insert${pascalName}(objects: $object) {
              returning {
                startTime
                endTime
                city
                prefecture
              }
            }
          }
          `;
        break;
      default:
        templateContent = `mutation Upsert${pascalName}(
            $object: ${pascalName}InsertInput!
            $onConflict: ${pascalName}OnConflict
          ) {
            insert${pascalName}One(object: $object, onConflict: $onConflict) {
              ...${pascalName}
            }
          }`;
        break;
    }
    return templateContent;
  };

  return getTypeMutation();
};
