// @flow
import * as MODALS from 'constants/modal_types';
import * as ICONS from 'constants/icons';
import React, { useRef } from 'react';
import { parseURI } from 'lbry-redux';
import Button from 'component/button';
import useHover from 'effects/use-hover';
import useIsMobile from 'effects/use-is-mobile';

type SubscriptionArgs = {
  channelName: string,
  uri: string,
};

type Props = {
  permanentUrl: ?string,
  isSubscribed: boolean,
  subscriptions: Array<string>,
  doChannelSubscribe: ({ channelName: string, uri: string }) => void,
  doChannelUnsubscribe: SubscriptionArgs => void,
  doOpenModal: (id: string) => void,
  showSnackBarOnSubscribe: boolean,
  doToast: ({ message: string }) => void,
  shrinkOnMobile: boolean,
};

export default function SubscribeButton(props: Props) {
  const {
    permanentUrl,
    doChannelSubscribe,
    doChannelUnsubscribe,
    doOpenModal,
    subscriptions,
    isSubscribed,
    showSnackBarOnSubscribe,
    doToast,
    shrinkOnMobile = false,
  } = props;

  const buttonRef = useRef();
  const isMobile = useIsMobile();
  let isHovering = useHover(buttonRef);
  isHovering = isMobile ? true : isHovering;

  const { channelName } = parseURI(permanentUrl);
  const claimName = '@' + channelName;

  const subscriptionHandler = isSubscribed ? doChannelUnsubscribe : doChannelSubscribe;
  const subscriptionLabel = isSubscribed ? __('Following') : __('Follow');
  const unfollowOverride = isSubscribed && isHovering && __('Unfollow');

  const label = isMobile && shrinkOnMobile ? '' : unfollowOverride || subscriptionLabel;
  const titlePrefix = isSubscribed ? __('Unfollow') : __('Follow');

  return permanentUrl ? (
    <Button
      ref={buttonRef}
      iconColor="red"
      largestLabel={isMobile && shrinkOnMobile ? '' : subscriptionLabel}
      icon={unfollowOverride ? ICONS.UNSUBSCRIBE : ICONS.SUBSCRIBE}
      button={'alt'}
      requiresAuth={IS_WEB}
      label={label}
      title={`${titlePrefix} ${__('this channel')}`}
      onClick={e => {
        e.stopPropagation();

        if (!subscriptions.length) {
          doOpenModal(MODALS.FIRST_SUBSCRIPTION);
        }

        subscriptionHandler({
          channelName: claimName,
          uri: permanentUrl,
        });

        if (showSnackBarOnSubscribe) {
          doToast({ message: `${__('Now following ')} ${claimName}!` });
        }
      }}
    />
  ) : null;
}
