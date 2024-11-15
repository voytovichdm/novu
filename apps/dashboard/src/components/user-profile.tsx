import { UserButton } from '@clerk/clerk-react';
import { ROUTES } from '@/utils/routes';
import { useNewDashboardOptIn } from '@/hooks/use-new-dashboard-opt-in';
import { RiSignpostFill } from 'react-icons/ri';

export function UserProfile() {
  const { optOut } = useNewDashboardOptIn();

  return (
    <UserButton afterSignOutUrl={window.location.hostname + '/auth/signin'}>
      <UserButton.MenuItems>
        <UserButton.Action
          label="Go back to the legacy Dashboard"
          labelIcon={<RiSignpostFill size="16" color="var(--nv-colors-typography-text-main)" />}
          onClick={optOut}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
