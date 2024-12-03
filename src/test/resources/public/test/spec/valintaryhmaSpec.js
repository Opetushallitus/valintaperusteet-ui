describe('Valintaryhmän kopiointi', function () {
  var page = valintaryhmaPage()

  before(function (done) {
    addTestHook(
      valintaryhmatFixtures([
        {
          nimi: 'Tekniikka, päivätoteutus, yhteistyössä',
          kohdejoukko: 'haunkohdejoukko_12',
          hakuoid: null,
          hakuvuosi: null,
          oid: '1421223668659-3190521886537508608',
          organisaatiot: [],
        },
      ])
    )()
    page.openPage(done)
  })

  afterEach(function () {
    if (this.currentTest.state == 'failed') {
      takeScreenshot()
    }
  })

  describe('Avaamisen jälkeen', function () {
    it('Näkyy linkki kopiointiin', function () {
      expect(page.kopioiRyhma().length).to.equal(1)
    })
  })

  describe('Kopioitaessa ryhmä', function () {
    before(seqDone(click(page.kopioiRyhma), wait.forAngular()))
    describe('Alkutilassa', function () {
      wait.forAngular()
      it('Aukeaa modaalinen ikkuna', function () {
        expect(page.kopiointiOtsikko().length).to.equal(1)
      })
      it('Kopioi nappi disabloitu', function () {
        expect(page.kopioiButton.isEnabled()).to.equal(false)
      })
    })
    describe('Syötettäessä nimi ja kohdevalintaryhmä', function () {
      before(
        seqDone(
          input(page.ryhmanUusinimi, 'Uusi nimi'),
          function () {
            page.juuriRyhma().click()
            //jostain syystä pitää clikkaa jqueryllä kahdesti
            page.juuriRyhma().click()
          },
          wait.forAngular()
        )
      )
      it('Kopioi nappi enabloitu', function () {
        expect(page.kopioiButton.isEnabled()).to.equal(true)
      })
      describe('Painettaessa kopioi nappia, kun palvelin palauttaa virheen', function () {
        before(seqDone(page.kopioiButton.click, wait.forAngular()))
        it('Näkyy virheilmoitus', function () {
          assertText(
            page.virheIlmoitus,
            'Valintaryhmän kopiointi epäonnnistui. Virhe: 500 - Server error'
          )
        })
        it('Kopioi nappi yhä enabloitu', function () {
          expect(page.kopioiButton.isEnabled()).to.equal(true)
        })
      })
    })
  })
})
