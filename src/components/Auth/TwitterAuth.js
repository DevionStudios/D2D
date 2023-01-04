// import { Client, auth } from "twitter-api-sdk";

// export const getValidatedUser = async ({ provider, code, redirectUri }) => {
//   return validateWithTwitter({ code, redirectUri });
// };

// const validateWithTwitter = async ({ code, redirectUri }) => {
//   const authClient = new auth.OAuth2User({
//     client_id: "dnRaQzRicVVFeEhvYkZqWlVVNnU6MTpjaQ",
//     client_secret: "lUS7wq04Zja7BjiX6mBhnWkSoNC80ZxYf9aALc75dtaypitcmj",
//     callback: redirectUri,
//     scopes: ["tweet.read", "users.read", "offline.access"],
//   });
//   const client = new Client(authClient);

//   authClient.generateAuthURL({
//     state: "twitter-state",
//     code_challenge: "challenge",
//     code_challenge_method: "plain",
//   });
//   await authClient.requestAccessToken(code);

//   const { data } = await client.users.findMyUser();

//   return data;
// };

// export const identifyWithOAuth = async (_, { input }, { country }) => {
//   const { name, email } = await getValidatedUser(input);

//   //   return authorizeUser({ timeZone: input.timeZone, email, name, country });
// };

// import { identificationQueryResult } from "constants/api";

// import { assertQueryParams } from "auth/helpers/assertQueryParams";
// import {
//   TWITTER_STATE,
//   getOAuthProviderRedirectUri,
// } from "auth/helpers/OAuthProviderUrl";
// import { useHandleIdentificationFailure } from "auth/hooks/useHandleIdentificationFailure";
// import { OAuthProvider } from "auth/OAuthProvider";
// import { useEffect } from "react";
// import { Spinner } from "ui/Spinner";
// import { HStack, VStack } from "ui/Stack";
// import { Text } from "ui/Text";

// export const identifyWithOAuthQuery = `
// query identifyWithOAuth($input: IdentifyWithOAuthInput!) {
//   identifyWithOAuth(input: $input) {
//     ${identificationQueryResult}
//   }
// }
// `;

// export const OAuthPage = () => {
//   let identify;

//   let mutate, error;

//   useHandleIdentificationFailure(error);

//   useEffect(() => {
//     processOAuthParams();
//   }, [processOAuthParams]);

//   return (
//     <VStack
//       gap={24}
//       alignItems="center"
//       justifyContent="center"
//       fullWidth
//       fullHeight
//     >
//       <HStack alignItems="center" gap={12}>
//         <Spinner />
//         <Text color="supporting" size={24}>
//           Please wait
//         </Text>
//       </HStack>
//     </VStack>
//   );
// };
