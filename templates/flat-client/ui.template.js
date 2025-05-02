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
  const { name } = component;
  const suffix = index > 0 ? `${index + 1}` : "";
  const pascalName = `${name}${suffix}`;
  const typeName = `${name}Type`;
  return `
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { BaseSyntheticEvent } from 'react';
import { Control } from 'react-hook-form';
import { ${pascalName} } from '@shared/api';
import { ${pascalName}Schema } from '@shared/lib';
import { useAppTheme } from '@shared/ui';

type ${typeName} = {
  control: Control<${pascalName}Schema>;
  handleSubmit: (e?: BaseSyntheticEvent) => void;
  loading: boolean;
  initialValues: ${pascalName};
  isValid: boolean;
};

export const ${pascalName}Page = ({
  handleSubmit,
  control,
  loading,
  initialValues,
  isValid,
}: ${typeName}) => {
  const { theme } = useAppTheme();

  return (
    <form onSubmit={handleSubmit} style={{ height: '100%', marginTop: '20px' }}>
      <VStack display="grid" alignContent="space-between" height="full">
        <VStack alignItems="flex-start" spacing="16px">        
        <Button
          isDisabled={loading || !isValid}
          color={theme.colors.white}
          backgroundColor={theme.colors.primary}
          w="full"
          position="relative"
          zIndex="1"
          rounded="full"
          px="3"
          py="4"
          onClick={handleSubmit}
        >
          <span>登録する</span>
        </Button>
      </VStack>
    </form>
  );
};
`;
};
