import styled from '@emotion/styled';
import { ScrollArea } from '@mantine/core';
import { colors, shadows } from '@novu/design-system';
import { HandlebarHelpers } from '@novu/shared';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getWorkflowVariables } from '../../../../api/notification-templates';

type AutoSuggestionsDropdownProps = {
  autoSuggestionsCoordinates: {
    top: number;
    left: number;
  };
  onSuggestionsSelect: (value: string) => void;
  variableQuery: string;
};

export function AutoSuggestionsDropdown({
  autoSuggestionsCoordinates,
  onSuggestionsSelect,
  variableQuery,
}: AutoSuggestionsDropdownProps) {
  const { data: variables } = useQuery(['getVariables'], () => getWorkflowVariables(), {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  const variablesList = useMemo(() => {
    const systemVars = Object.keys(variables)
      .map((key) => {
        const subVariables = variables[key];

        return Object.keys(subVariables)
          .map((name) => {
            const type = subVariables[name];
            if (typeof type === 'object') {
              return Object.keys(type).map((subName) => {
                return {
                  label: `${key === 'translations' ? 'i18n ' : ''}${name}.${subName}`,

                  detail: type[subName],
                  insertText: `${key === 'translations' ? 'i18n ' : ''}${name}.${subName}`,
                };
              });
            }

            return {
              label: `${key === 'translations' ? 'i18n ' : ''}${name}`,
              detail: type,
              insertText: `${key === 'translations' ? 'i18n ' : ''}${name}`,
            };
          })
          .flat();
      })
      .flat();

    const allVars = [
      ...Object.keys(HandlebarHelpers).map((name) => ({
        label: name,
        detail: HandlebarHelpers[name].description,
        insertText: name,
      })),
      ...systemVars,
    ];

    if (variableQuery) {
      return allVars.filter((variable) => variable.label.toLowerCase().includes(variableQuery.toLowerCase()));
    } else {
      return allVars;
    }
  }, [variableQuery, variables]);

  if (variablesList.length === 0) {
    return null;
  }

  return (
    <Container
      top={autoSuggestionsCoordinates.top}
      left={autoSuggestionsCoordinates.left}
      onClick={(e) => e.stopPropagation()}
    >
      <ScrollArea w="100%" h="250px" offsetScrollbars>
        {variablesList.map((variable) => (
          <VariableRow
            key={variable.label}
            onClick={(e) => {
              e.stopPropagation();
              onSuggestionsSelect(variable.insertText);
            }}
          >
            {variable.label}
          </VariableRow>
        ))}
      </ScrollArea>
    </Container>
  );
}

const Container = styled.div<{ top: number; left: number }>`
  padding: 5px;
  border-radius: 7px;
  background: ${colors.B20};

  box-shadow: ${shadows.dark};
  position: absolute;
  max-height: 370px;
  width: 475px;
  top: ${({ top }) => top + 20}px;
  left: ${({ left }) => left}px;
  z-index: 3;
  overflow: hidden;
`;

const VariableRow = styled.div`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: #b18cff;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    background: ${colors.B30};
  }
`;