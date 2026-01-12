import { GuardrailsClient } from '@aayushgid/guardrailz-sdk';

const client = new GuardrailsClient({
  baseUrl: 'http://localhost:3000',
  apiKey: 'grd_live_Wcqb_Jlvzzt3MDkKMKHgwKa72XCHzGiP',
});

client
  .validate({
    text: 'Hello SDK test',
    profileName: 'default',
    validationType: 'input',
  })
  .then(console.log)
  .catch(console.error);
