/**
 * Template for page component files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function(component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  
  return `import React from 'react';
import { ${name}UI } from '../ui/${kebabName}-ui-page';

/**
 * Page component for ${name} functionality
 */
export const ${name}Page${suffix} = () => {
  // Any page-specific logic here
  
  return (
    <div className="page-container">
      <h1>${name} Page</h1>
      <${name}UI />
    </div>
  );
};

export default ${name}Page${suffix};
`;
};