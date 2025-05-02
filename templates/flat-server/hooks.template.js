/**
 * Template for hook files
 * @param {object} component - Component information
 * @param {string} component.name - Component name in PascalCase (e.g., "SampleUser")
 * @param {string} component.kebabName - Component name in kebab-case (e.g., "sample-user")
 * @param {number} index - Index for multi-file generation (0-based)
 * @returns {string} Generated file content
 */
module.exports = function (component, index) {
  const { name } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const pascalName = `${name}`;
  const pascalNameSuffix = `${name}${suffix}`;
  return `

'use client'

 import { useState, useEffect } from 'react';

 type ${pascalName}Props = {
  dataString: string;
  dataNumber: number;
  errorStatus: boolean;
  loadingStatus: boolean;
  dataObject: object;
  dataArray: Array<T>;
  dataStrict: 'strict1' | 'strict2' | 'strict3';
}

  export const use${pascalName}${suffix} = ({ dataString, dataNumber, errorStatus, loadingStatus, dataObject, dataArray, dataStrict }: ${pascalName}Props) => {

    const [data, setData] = useState(null);
    
    useEffect(() => {
      setData(/* result */);
    }, []);

    const handleData = () => {
      setData(/* result */);
    }
    
    return { data${pascalNameSuffix}, isLoading${pascalNameSuffix}, error${pascalNameSuffix}, handleData${pascalNameSuffix} }
  }
`;
};
