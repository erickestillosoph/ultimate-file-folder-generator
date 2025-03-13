/**
 * Template for the main page.tsx file
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name } = component;
  const typeName = `${name}Type`;
  return `
'use client'

import React from 'react'

type ${typeName} = {
  children: React.ReactNode
}
export default function ${name}Page${index}({children}: ${typeName}) {
  return (
    <div className='page'>
      {children}
    </div>
 )
}
`;
};
