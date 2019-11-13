# valintaperusteet-ui

Lokaali ajaminen: [ValintaperusteetUiJettyForLocalDev](src/test/java/fi/vm/sade/valintaperusteet/ValintaperusteetUiJettyForLocalDev.java)

Jos haluat käyttää testiympäristön taustapalveluita, mutta osaa omalta koneeltasi, se onnistuu
tähän malliin:
```
-Dfront.baseUrl=https://virkailija.untuvaopintopolku.fi
-Dfront.valintaperusteet-service.baseUrl=http://localhost:8081
```
