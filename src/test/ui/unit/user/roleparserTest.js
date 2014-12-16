
describe('Testing RoleParser service', function () {
    var palveluResource, palvelut, user;
    beforeEach(module('MockData', 'user'));
    
    beforeEach(inject(function (palveluResourceMock, palvelut, User) {
        palvelut = palvelut;
        palveluResource = palveluResourceMock;
        user = User;
    }));
    

    
});