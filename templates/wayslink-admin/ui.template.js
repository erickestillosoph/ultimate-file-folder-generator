/**
 * Template for UI component files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase
 * @param {string} component.kebabName - Component name in kebab-case
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toCamelCase(str) {
  return str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function toConstantCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase();
}

module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const dashedSuffix = index > 0 ? `-${index + 1}` : "";
  const hookName = `use${name}${suffix}`;
  const pascalName = `${name}`;
  const hookReturns = `${name}${suffix}`;
  const uiName = `${name}${suffix}`;
  return `
'use client'

import React from 'react';
import { ${hookName} } from '../hooks/use-hook-${kebabName}${dashedSuffix}';

type ${pascalName}Props = {
  children: React.ReactNode;
  dataString: string;
  dataNumber: number;
  error: string;
  isLoading: boolean;
  dataObject: object;
  dataArray: Array<T>;
  dataNull: null;
  dataStrict: 'strict1' | 'strict2' | 'strict3';
}

export const ${uiName} = ({ dataString, dataNumber, error, isLoading, dataObject, dataArray, dataNull, dataStrict }: ${pascalName}Props) => {
  const { data${hookReturns}, isLoading${hookReturns}, error${hookReturns}, handleData${hookReturns} } = ${hookName}();

  if (isLoading${hookReturns}) return <div>Loading...</div>;
  if (error${hookReturns}) return <div>Error: {error${hookReturns}.message}</div>;
  
  return (
    <div className="${kebabName}-ui-container">
      <div className="content">
        {dataObject && (
          <pre>{JSON.stringify(dataObject, null, 2)}</pre>
        )}
      </div>
        <div className="content">
        {dataArray && (
          <pre>{JSON.stringify(dataArray, null, 2)}</pre>
        )}
      </div>
      {dataObject.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
      {dataArray.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
`;
};
