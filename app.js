document.getElementById('index').innerHTML = (`
<div id="app">
<v-app>
  <v-main>

    <v-app-bar color="primary" dark>
      <v-icon large class="mx-4">mdi-home-automation</v-icon>
      <v-toolbar-title class="d-none d-sm-flex">Home Ping</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-icon class="ml-6 mr-2 d-none d-md-flex">mdi-file-clock-outline</v-icon>
      <span>Page actualisée à {{ time }} </span>

      <section class="d-none d-md-flex">
        <v-icon class="ml-6 mr-2">mdi-account-circle-outline</v-icon>
        <span> {{ ip }}, {{ vOS }}, {{ vNavigator }}</span>
      </section>
    </v-app-bar>

    <v-container fluid>
      <v-row class="ma-6">
        <v-col cols="12" sm="12" md="6">
          <v-card>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Hôte</th>
                    <th class="text-left hidden-sm-and-down">Adresse IP</th>
                    <th class="text-left">Satut</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in info" :key="index">
                    <td>
                      {{ item.name }}
                    </td>
                    <td class="hidden-sm-and-down">
                      {{ item.ip }}
                    </td>
                    <td>
                      <div v-if="item.up == 'true'">
                        <v-icon small class="mx-1" color="success">mdi-circle</v-icon>
                        En ligne
                      </div>
                      <div v-else>
                        <v-icon small class="mx-1" color="error">mdi-circle</v-icon>
                        Non joignable
                      </div>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

  </v-main>
</v-app>
</div>
`)

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