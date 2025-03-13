/**
 * Default FSD template for pages
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase
 * @param {string} component.kebabName - Component name in kebab-case
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const pascalName = `${name}${suffix}`;
  return `
  'use client'
  
  import React from 'react';

  type Args = {
    children: React.ReactNode
  }

  export default function ${pascalName}Container ({children}: Args) {
    
    return (
      <div className='page-container'>
        {children}
      </div>
    )
  }
`;
};
