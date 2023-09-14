
const getCookie = ((name) => {
  var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
});
const baseUrl = "https://soldey.onrender.com";
const baseAPIurl = baseUrl + "/api/v1/";
