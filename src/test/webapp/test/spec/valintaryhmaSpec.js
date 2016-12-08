describe('Valintaryhmän kopiointi', function() {
    var page = valintaryhmaPage();

    before(function(done) {
        addTestHook(
            valintaryhmatFixtures(
                [
                    {
                        nimi: "Tekniikka, päivätoteutus, yhteistyössä",
                        kohdejoukko: "haunkohdejoukko_12",
                        hakuoid: null,
                        hakuvuosi: null,
                        oid: "1421223668659-3190521886537508608",
                        organisaatiot: []
                    }
                ]
            )
        )();
        page.openPage(done);
    });

    afterEach(function() {
        if (this.currentTest.state == 'failed') {
            takeScreenshot()
        }
    });

    describe('Avaamisen jälkeen', function() {
        it('Näkyy linkki kopiointiin', function() {
            expect(page.kopioiRyhma().length).to.equal(1)
        })
    })
});
