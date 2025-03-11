/**
 * Template for query hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */

function toConstantCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toUpperCase();
}

function toCamelCase(str) {
  return str
    .replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

module.exports = function (component, index) {
  const { name, kebabName } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const API_ENDPOINT = toConstantCase(kebabName);
  const camelCaseName = toCamelCase(name);
  const pascalName = `${name}`;
  return `
'use client'

import axios from 'axios';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ${API_ENDPOINT} } from '@/config';

type Args = {
  children: React.ReactNode
}

type ${pascalName}Props = {
  dataString: string;
  dataNumber: number;
  isError: boolean;
  isLoading: boolean;
  dataObject: object;
  dataArray: Array<T>;
  dataNull: null;
  dataStrict: 'strict1' | 'strict2' | 'strict3';
}

export const use${name}Query${suffix} = ({ dataString, dataNumber, isError, isLoading, dataObject, dataArray, dataNull, dataStrict }: ${pascalName}Props) => {
 const result = useQuery({
   queryKey: ['${kebabName}'],
   queryFn: axios.get(${API_ENDPOINT}.GET),
});

  return { ${camelCaseName}:result }
}
  
`;
};
