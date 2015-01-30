
describe('Testing RoleParser service', function () {
    var roleParser, userMockData;
    beforeEach(module('MockData'));
    beforeEach(module('valintaperusteet'));
    
    beforeEach(inject(function (UserMockData, RoleParser) {
        roleParser = RoleParser;
        userMockData = UserMockData;
    }));

    describe('contains oid', function () {

        it('should return true for APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001', function () {
            expect(roleParser.containsOid(userMockData.valintaperusteetOphAdmin)).toBeTruthy();
        });

        it('should return true for APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.34573782876', function () {
            expect(roleParser.containsOid(userMockData.valintaperusteetCrudOrg)).toBeTruthy();
        });

        it('should return false for APP_VALINTOJENTOTEUTTAMINENKK', function () {
            expect(roleParser.containsOid(userMockData.valintojentoteuttaminenKK)).toBeFalsy();
        });
    });

    describe('getOrganizationOid', function () {
        it('should return 1.2.246.562.10.00000000001 for APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001', function () {
            expect(roleParser.getOrganizationOid(userMockData.valintaperusteetOphAdmin)).toBe("1.2.246.562.10.00000000001");
        });

        it('should return 1.2.246.562.10.34573782876 for APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.34573782876', function () {
            expect(roleParser.getOrganizationOid(userMockData.valintaperusteetCrudOrg)).toBe("1.2.246.562.10.34573782876");
        });

        it('should return undefined for APP_VALINTAPERUSTEETKK', function () {
            expect(roleParser.getOrganizationOid(userMockData.valintojentoteuttaminenKK)).toBe(undefined);
        });
    });


});
