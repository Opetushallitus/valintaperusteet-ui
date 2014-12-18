
describe('Testing RoleParser service', function () {
    var palvelut, user, roleParser, userMockData;
    beforeEach(module('MockData', 'user'));
    
    beforeEach(inject(function (User, UserMockData, RoleParser) {
        palvelut = palvelut;
        user = User;
        roleParser = RoleParser;
        userMockData = UserMockData;
    }));

    describe('matchesAppRole APP_VALINTAPERUSTEET', function () {

        it('should return true for APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001', function () {
            expect(roleParser.matchesAppRole(userMockData.valintaperusteetAppRole, userMockData.valintaperusteetOphAdmin)).toBeTruthy();
        });

        it('should return false for APP_VALINTOJENTOTEUTTAMINEN', function () {
            expect(roleParser.matchesAppRole(userMockData.valintaperusteetAppRole, userMockData.valintojentoteuttaminenKK)).toBeFalsy();
        });

        it('should return false for APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.34573782876', function () {
            expect(roleParser.matchesAppRole(userMockData.valintaperusteetAppRole, userMockData.valintaperusteetCrudOrg)).toBeFalsy();
        });

        it('should return false for APP_VALINTAPERUSTEETKK_READ_UPDATE_1.2.246.562.10.34573782876', function () {
            expect(roleParser.matchesAppRole(userMockData.valintaperusteetAppRole, userMockData.valintaperusteetUpdateOrg)).toBeFalsy();
        });

        it('should return false for APP_VALINTAPERUSTEETKK', function () {
            expect(roleParser.matchesAppRole(userMockData.valintaperusteetAppRole, "APP_VALINTAPERUSTEETKK")).toBeFalsy();
        });

    });

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

    describe('getMyAppRoles', function () {
         //it('should return only matching ')
    });
    
    describe('getRoleOrganizationOid', function () {
        it('should return 1.2.246.562.10.00000000001 for APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.00000000001', function () {
            expect(roleParser.getRoleOrganizationOid(userMockData.valintaperusteetOphAdmin)).toBe("1.2.246.562.10.00000000001");
        });

        it('should return 1.2.246.562.10.34573782876 for APP_VALINTAPERUSTEETKK_CRUD_1.2.246.562.10.34573782876', function () {
            expect(roleParser.getRoleOrganizationOid(userMockData.valintaperusteetCrudOrg)).toBe("1.2.246.562.10.34573782876");
        });

        it('should return undefined for APP_VALINTAPERUSTEETKK', function () {
            expect(roleParser.getRoleOrganizationOid(userMockData.valintojentoteuttaminenKK)).toBe(undefined);
        });
    });

    
});