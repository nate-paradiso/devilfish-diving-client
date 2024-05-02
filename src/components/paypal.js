import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Renders errors or successful transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}
const serverUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
console.log(serverUrl);

export const PayPal = () => {
  const [clientId, setClientId] = useState("");
  const [message, setMessage] = useState("");
  console.log(clientId);
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/paypal/client-id`);
        const data = await response.json();
        setClientId(data.clientId);
      } catch (error) {
        console.error(error);
        setMessage("Error fetching PayPal client ID.");
      }
    };

    fetchClientId();
  }, []);

  const initialOptions = {
    intent: "capture",
    "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT,
    "enable-funding": "venmo,card",
    "disable-funding": "paylater",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {" "}
      <div className="App">
        <PayPalButtons
          style={{
            shape: "rect",
            layout: "vertical",
          }}
          createOrder={async () => {
            try {
              const response = await fetch(`${serverUrl}/api/orders`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },

                // use the "body" param to optionally pass additional order information
                // like product ids and quantities
                body: JSON.stringify({
                  cart: [
                    {
                      id: "Dive Trip",
                      quantity: "1",
                    },
                  ],
                }),
              });

              const orderData = await response.json();
              // console.log(orderData);

              if (orderData.id) {
                return orderData.id;
              } else {
                const errorDetail = orderData?.details?.[0];
                const errorMessage = errorDetail
                  ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                  : JSON.stringify(orderData);

                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error(error);
              setMessage(`Could not initiate PayPal Checkout...${error}`);
            }
          }}
          onApprove={async (data, actions) => {
            try {
              const response = await fetch(`${serverUrl}/api/orders/${data.orderID}/capture`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              const orderData = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              const errorDetail = orderData?.details?.[0];

              if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                return actions.restart();
              } else if (errorDetail) {
                // (2) Other non-recoverable errors -> Show a failure message
                throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
              } else {
                // (3) Successful transaction -> Show confirmation or thank you message
                // Or go to another URL:  actions.redirect('thank_you.html');
                setMessage("Payment Successful. Thank you!");
                console.log("Capture result", orderData, JSON.stringify(orderData, null, 2));
              }
            } catch (error) {
              console.error(error);
              setMessage(`Sorry, your transaction could not be processed...${error}`);
            }
          }}
        />
        <Message content={message} />
      </div>
    </PayPalScriptProvider>
  );
};
