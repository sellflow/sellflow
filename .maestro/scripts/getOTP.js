function busyWait(ms) {
  var start = new Date().getTime();
  var now = start;
  while (now - start < ms) {
    now = new Date().getTime();
  }
}
const sid = guerillaSid;

busyWait(120000);
const res = http.get(
  "https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=" +
    sid,
);

const data = json(res.body);
const otp = data.list[0].mail_subject.substring(0, 6);
output.otp = otp;
