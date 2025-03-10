/**
 * Template for UI component files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase
 * @param {string} component.kebabName - Component name in kebab-case
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";

  return `import React from 'react';
import { useHook${name} } from '../hooks/use-hook-${kebabName}';

/**
 * UI component for ${name} functionality
 */
export const ${name}UI${suffix} = () => {
  const { data, loading, error } = useHook${name}();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="${kebabName}-ui-container">
      <h2>${name} UI Component</h2>
      {/* Render your UI elements here */}
      <div className="content">
        {data && (
          <pre>{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
    </div>
  );
};

export default ${name}UI${suffix};
`;
};
