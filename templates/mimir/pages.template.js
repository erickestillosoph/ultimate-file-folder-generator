/**
 * Template for page component files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const typeName = `${name}Type`;

  return `
'use client'

import React from 'react';
import { ${name} } from '../ui/${kebabName}-ui-page${suffix}';

type ${typeName} = {
  children: React.ReactNode;
  dataString: string;
  dataNumber: number;
  errorStatus: boolean;
  loadingStatus: boolean;
  dataObject: object;
  dataArray: Array<T>;
  dataStrict: 'strict1' | 'strict2' | 'strict3';
}
  
export default function ${name}Page${index}({ dataString, dataNumber, isError, loadingStatus, errorStatus, dataObject, dataArray, dataNull, dataStrict }: ${typeName}) {
    return (
      <div className='page'>
        {children}
      </div>
    )
}
`;
};
