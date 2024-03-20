import { Select, Tooltip } from '@novu/design-system';
import { useState } from 'react';
import { css } from '../../../../styled-system/css';
import { arrowStyles, navSelectStyles, tooltipStyles } from '../../NavSelect.styles';
import { useOrganizationSelect } from '../useOrganizationSelect';

interface INavOrganizationSelectRendererProps {
  loadingAddOrganization: boolean;
  loadingSwitch: boolean;
  addOrganizationItem: (newOrganization: string) => undefined;
  value: string;
  switchOrgCallback: (organizationId: string | string[] | null) => Promise<void>;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  data: {
    label: string;
    value: string;
  }[];
}

export const OrganizationSelectRenderer: React.FC<INavOrganizationSelectRendererProps> = ({
  loadingAddOrganization,
  loadingSwitch,
  addOrganizationItem,
  value,
  switchOrgCallback,
  setSearch,
  data,
}) => {
  const [canShowTooltip, setCanShowTooltip] = useState<boolean>(false);

  return (
    <Tooltip
      label="Type a name to add organization"
      sx={{ visibility: canShowTooltip ? 'visible' : 'hidden' }}
      position="left"
      classNames={{
        tooltip: tooltipStyles,
        arrow: arrowStyles,
      }}
      withinPortal
    >
      <Select
        data-test-id="organization-switch"
        className={navSelectStyles}
        creatable
        searchable
        loading={loadingAddOrganization || loadingSwitch}
        getCreateLabel={(newOrganization) => <div>+ Add "{newOrganization}"</div>}
        onCreate={addOrganizationItem}
        value={value}
        onChange={switchOrgCallback}
        allowDeselect={false}
        onSearchChange={setSearch}
        onDropdownOpen={() => {
          setCanShowTooltip(true);
        }}
        onDropdownClose={() => {
          setCanShowTooltip(false);
        }}
        data={data}
        icon={
          <img
            // TODO: use actual organization photo
            src="https://assets.super.so/1e9f5a51-c4c6-4fca-b6e8-25fa0186f139/uploads/favicon/d82d95bb-0983-4980-8b3f-dda6ecb0c22c.png"
            className={css({
              w: '200',
              h: '200',
              // TODO: use design system values when available
              borderRadius: '8px',
            })}
          />
        }
      />
    </Tooltip>
  );
};

export const OrganizationSelect = () => {
  return <OrganizationSelectRenderer {...useOrganizationSelect()} />;
};
