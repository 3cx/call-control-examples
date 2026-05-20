import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import CustomIvr from './custom-ivr';
import OutboundCampaign from './outbound-campaign';
import { getStatusFunc } from '../shared';
import { ConnectFormProps } from '../types';
import { APP_TYPE_CUSTOM_IVR, APP_TYPE_DIALER, APP_TYPE_OUTBOUND_CAMPAIGN } from '../constants';
import DialerApp from './dialer';

export default function PrivateRoute({ appType }: ConnectFormProps) {
  const { data } = useQuery({
    queryFn: getStatusFunc(appType),
    queryKey: ['status', appType]
  });

  function renderFunction(appType: ConnectFormProps['appType']) {
    switch (appType) {
      case APP_TYPE_CUSTOM_IVR:
        return <CustomIvr />;
      case APP_TYPE_OUTBOUND_CAMPAIGN:
        return <OutboundCampaign appType={APP_TYPE_OUTBOUND_CAMPAIGN} />;
      case APP_TYPE_DIALER:
        return <DialerApp />;
    }
  }

  return (
    <>
      {data?.connected === true ? (
        renderFunction(appType)
      ) : (
        <Navigate replace to={`/${appType}/connect`} />
      )}
    </>
  );
}
