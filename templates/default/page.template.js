/**
 * Template for the main page.tsx file
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function(component, index) {
  const { name, kebabName } = component;
  
  return `import React from 'react';
import { ${name}Page } from './pages/${kebabName}-page';

/**
 * Main component for ${name}
 */
export default function Page() {
  return (
    <div>
      <${name}Page />
    </div>
  );
}
`;
};