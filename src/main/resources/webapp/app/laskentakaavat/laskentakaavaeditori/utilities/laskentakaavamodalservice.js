angular
  .module("valintaperusteet")

  .service("LaskentakaavaModalService", [
    "_",
    function (_) {
      var api = this;

      // Selection is used to determine which modal template is shown
      this.selection = {
        asetukset: true,
        tallennusKaavana: false,
        kaare: false,
      };

      // Switch selection
      this.toggleModalSelection = function (selection) {
        _.forIn(api.selection, function (value, key) {
          api.selection[key] = key === selection ? true : false;
        });
      };

      // Reset selection
      this.resetModalSelection = function () {
        _.forIn(api.selection, function (value, key) {
          api.selection[key] = key === "asetukset" ? true : false;
        });
      };
    },
  ]);
