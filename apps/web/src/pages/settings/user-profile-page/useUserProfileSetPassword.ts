import { showNotification } from '@mantine/notifications';
import { IResponseError, PasswordResetFlowEnum } from '@novu/shared';
import { api, useAuthContext } from '@novu/shared-web';
import { useMutation } from '@tanstack/react-query';
import { useCountdownTimer } from '../../../hooks';

const COUNTDOWN_TIMER_START_SECONDS = 60;

export const useUserProfileSetPassword = () => {
  const { currentUser } = useAuthContext();
  const { timeRemaining: countdownTimerSeconds, resetTimer } = useCountdownTimer({
    // start at 0 in the event the user opens the page directly to the set password flow via URL
    startTimeSeconds: 0,
  });

  const { isLoading, mutateAsync, isError, error } = useMutation<
    { success: boolean },
    IResponseError,
    {
      email: string;
    }
  >((data) => api.post(`/v1/auth/reset/request`, data, { src: PasswordResetFlowEnum.USER_PROFILE }));

  const handleSendLinkEmail = async () => {
    // don't allow to reset the timer if it is running
    if (countdownTimerSeconds > 0) {
      return;
    }

    resetTimer(COUNTDOWN_TIMER_START_SECONDS);

    // this should never happen, but helps with type checking, and better to be defensive
    if (!currentUser?.email) {
      showNotification({ color: 'red', message: 'You must have a valid email tied to your logged-in user.' });

      return;
    }

    /*
     *try {
     *  await mutateAsync({ email: currentUser.email });
     *} catch (e: unknown) {
     *  showNotification({
     *    color: 'red',
     *    message: `There was an error sending your email. Please refresh and try again. Error: ${e.message}`,
     *  });
     *}
     */
  };

  return {
    email: currentUser?.email ?? '',
    handleSendLinkEmail,
    countdownTimerSeconds,
  };
};
