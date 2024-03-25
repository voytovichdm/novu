import { MouseEventHandler } from 'react';
import { FC } from 'react';
import { Button, IconLockPerson } from '@novu/design-system';
import { useAuthContext } from '../../../components/providers/AuthProvider';
import { css } from '../../../styled-system/css';
import { styled } from '../../../styled-system/jsx';
import { title } from '../../../styled-system/recipes';
import { InputPlain } from '../components';
import { SettingsPageContainer } from '../SettingsPageContainer';
import { UserProfilePasswordSidebar } from './UserProfilePasswordSidebar';
import { UserProfilePasswordSidebarEnum } from './UserProfilePasswordSidebarEnum';
import { useUserProfileSearchParams } from './useUserProfileSearchParams';
import { useUserProfileSetPassword } from './useUserProfileSetPassword';

const Title = styled('h2', title);

const inputStyles = css({ minWidth: '18.75rem' });

export const UserProfilePage: FC = () => {
  const { currentUser } = useAuthContext();

  const { sidebarType, updateSidebarParam, token } = useUserProfileSearchParams();

  const closeSidebar = () => {
    updateSidebarParam(null);
  };

  const { handleSendLinkEmail, countdownTimerSeconds, email } = useUserProfileSetPassword();

  const handleSetPasswordClick: MouseEventHandler<HTMLButtonElement> = async () => {
    handleSendLinkEmail();
    updateSidebarParam(UserProfilePasswordSidebarEnum.SET_PASSWORD);
  };

  return (
    <SettingsPageContainer title="User profile">
      <Title mb="100" variant="section">
        Profile security
      </Title>
      <div className={css({ maxWidth: '37.5rem' })}>
        <InputPlain
          className={inputStyles}
          type="text"
          label="Email address"
          value={currentUser?.email ?? ''}
          autoCorrect="none"
          aria-autocomplete="none"
          autoComplete="none"
          readOnly
        />
        <div className={css({ display: 'flex', justifyContent: 'space-between' })}>
          <InputPlain
            className={inputStyles}
            type={currentUser?.hasPassword ? 'password' : 'text'}
            label="Password"
            value={currentUser?.hasPassword ? '•••••••••••••••' : 'Set a password to enhance security'}
            autoCorrect="none"
            aria-autocomplete="none"
            autoComplete="none"
            readOnly
          />
          <Button variant="outline" className={css({ color: '' })}>
            <IconLockPerson className={css({ color: 'button.text.outline !important' })} />
            {currentUser?.hasPassword ? 'Update password' : 'Set password'}
          </Button>
        </div>
      </div>
      <UserProfilePasswordSidebar
        isOpened={!!sidebarType}
        onClose={closeSidebar}
        countdownTimerSeconds={countdownTimerSeconds}
        handleSendLinkEmail={handleSendLinkEmail}
        email={email}
        token={token ?? undefined}
      />
    </SettingsPageContainer>
  );
};
