import { useQuery } from "@tanstack/react-query";
import { getStatusFunc } from "../utils";
import { useEffect, useState } from "react";
import React from "react";
import { Connect } from "./screens/Connect";
import { useCti } from "../hooks/useCti";
import { CallScreen } from "./screens/CallScreent";

enum Screens {
  Connect,
  Dialer,
}

export default function App() {
  const [screen, setScreen] = useState<Screens>(Screens.Connect);
  const { data } = useQuery({
    queryFn: getStatusFunc(),
    queryKey: ["status", "dialer"],
    refetchInterval: 10000,
  });

  const { cti, phoneNumber, engagementId, incomingContactName } = useCti(
    (incomingNumber) => {
      console.log(incomingNumber);
    }
  );

  useEffect(() => {
    if (data?.connected === true) {
      setScreen(Screens.Dialer);
      cti.userLoggedIn();
    } else {
      setScreen(Screens.Connect);
      cti.userLoggedOut();
    }
  }, [data]);

  return (
    <React.Fragment>
      {screen === Screens.Dialer ? (
        <CallScreen
          cti={cti}
          phoneNumber={phoneNumber}
          engagementId={engagementId}
        />
      ) : (
        <Connect />
      )}
    </React.Fragment>
  );
}
