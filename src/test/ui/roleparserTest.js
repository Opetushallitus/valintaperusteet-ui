
xdescribe('Testing RoleParser service', function () {
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

    describe('getMyAppRoles', function () {
         it('should return only roles matching the given appRole exactly', function () {
            expect(roleParser.getMyAppRoles(userMockData.kkCrud, userMockData.valintaperusteetAppRole)).toEqual([
                "APP_VALINTAPERUSTEET",
                "APP_VALINTAPERUSTEET_CRUD",
                "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.64582714578",
                "APP_VALINTAPERUSTEET",
                "APP_VALINTAPERUSTEET_CRUD",
                "APP_VALINTAPERUSTEET_CRUD_1.2.246.562.10.69981965515"
            ]);

             expect(roleParser.getMyAppRoles(userMockData.kkCrud, userMockData.valintojentoteuttaminenKK)).toEqual([
                     "APP_VALINTOJENTOTEUTTAMINENKK",
                     "APP_VALINTOJENTOTEUTTAMINENKK_CRUD",
                     "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.64582714578",
                     "APP_VALINTOJENTOTEUTTAMINENKK",
                     "APP_VALINTOJENTOTEUTTAMINENKK_CRUD",
                     "APP_VALINTOJENTOTEUTTAMINENKK_CRUD_1.2.246.562.10.69981965515"
             ]);

             expect(roleParser.getMyAppRoles(userMockData.kkCrud, "EIOLEOLEMASSA")).toEqual([]);
         });
    });
    
    describe('getOrganizationsByApprole', function () {
        it('should return all organization oids for the given appRole', function () {
            expect(roleParser.getOrganizationsByAppRole(userMockData.kkCrud, userMockData.valintaperusteetAppRole)).toEqual([
                "1.2.246.562.10.64582714578", "1.2.246.562.10.69981965515"
            ]);
        });
    });

    
});
