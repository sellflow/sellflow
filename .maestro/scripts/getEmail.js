const res = http.get(
  "https://api.guerrillamail.com/ajax.php?f=get_email_address",
);
const data = json(res.body);

const email = data.email_addr;
const guerillaSid = data.sid_token;

output.email = {
  testEmail: email,
  guerillaSid: guerillaSid,
};
