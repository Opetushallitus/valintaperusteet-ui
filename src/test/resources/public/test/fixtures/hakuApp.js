function lisakysymyksetFixtures(lisakysymykset) {
  return function () {
    var httpBackend = testFrame().httpBackend
    //httpBackend.when('POST', /.*\/haku-app\/applications\/list?.*/).passThrough();
    // -app\/application-system-form-editor\/theme-question\/list\/
    httpBackend
      .when(
        'GET',
        /.*\/haku-app\/application-system-form-editor\/theme-question\/list\/.*/
      )
      .respond(lisakysymykset)
  }
}
