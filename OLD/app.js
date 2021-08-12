var vm = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data() {
    return {
      info: [],
      ip: '',
      time: new Date().toLocaleTimeString(),
    };
  },
  /*
  GET du fichier 'result.json'
  */
  methods: {
    vaxios: function () {
      axios
        .get("result.json")
        .then((response) => (this.info = response.data));
    },
  },
  /*
  Retourne l'adresse IP local du client
  */
  mounted() {
    axios
      .get("ip.php")
      .then((response) => (this.ip = response.data));
  },
  computed: {
    /* 
     Retourne le navigateur utilisé par le client et sa version
    */
    vNavigator: function () {
      navigator.sayswho = (function () {
        var ua = navigator.userAgent, tem,
          M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
          tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
          return 'IE ' + (tem[1] || '');
        }
        if (M[1] === 'Chrome') {
          tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
          if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return M.join(' ');
      })();
      return navigator.sayswho;
    },

    /*
      Retourne l'OS utilisé par le client
    */
    vOS: function () {
      function getOS() {
        var userAgent = window.navigator.userAgent,
          platform = window.navigator.platform,
          macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
          windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
          iosPlatforms = ['iPhone', 'iPad', 'iPod'],
          os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
          os = 'Mac OS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
          os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
          os = 'Windows';
        } else if (/Android/.test(userAgent)) {
          os = 'Android';
        } else if (!os && /Linux/.test(platform)) {
          os = 'Linux';
        }
        return os;
      }
      return getOS();
    },
  },
})

vm.vaxios()
/*
 Relance toutes les minutes l'appelle au fichier 'result.json'
 */
this.interval = setInterval(() => {
  vm.vaxios()
}, 60000); // 1 minutes