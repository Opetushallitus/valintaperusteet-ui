
describe('Testing RoleParser service', function () {
    var palveluResource, palvelut, user;
    beforeEach(module('MockData', 'User'));
    
    beforeEach(inject(function (palveluResourceMock, palvelut, user) {
        palvelut = palvelut;
        palveluResource = palveluResourceMock;
        user = user;
    }));
    
    it('should return palvelut from getOrganizations', function () {
        expect(user.parseOrganizations(palveluResource)).toBe(palvelut);
    });
    
});