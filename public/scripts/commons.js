
const getCookie = ((name) => {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
});
const baseUrl = "http://localho.st:8000";
const baseAPIurl = baseUrl + "/api/v1/";
