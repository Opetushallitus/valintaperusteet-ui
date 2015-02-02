
describe('Testing RoleParser service', function () {
    var roleParser, userMockData, _;
    beforeEach(module('MockData'));
    beforeEach(module('valintaperusteet'));

    beforeEach(inject(function (UserMockData, RoleParser, _) {
        roleParser = RoleParser;
        userMockData = UserMockData;
    }));

    describe('getRoleRightLevel', function () {
        it('should return CRUD for role that has CRUD-rights', function () {
            expect(roleParser.getRoleRightLevel("APP_TARJONTA_CRUD_1.2.246.562.10.69981965515")).toEqual('CRUD');
        });

        it('should return READ_UPDATE for role that has READ_UPDATE-rights', function () {
            expect(roleParser.getRoleRightLevel("APP_VALINTAPERUSTEET_READ_UPDATE_1.2.246.562.10.64582714578")).toEqual('READ_UPDATE');
        });

        it('should return READ for role that has READ-rights', function () {
            expect(roleParser.getRoleRightLevel ("APP_VALINTAPERUSTEET_READ_1.2.246.562.10.69981965515")).toEqual('READ');
        });

        it('should return undefined for role that has no rights marked', function () {
            expect(roleParser.getRoleRightLevel("APP_VALINTAPERUSTEET")).toEqual(undefined);
        });
    });

    describe('getOrganizationRights', function () {
        it('should return a list of organizations and highest level of rights for those organizations', function () {

            expect(roleParser.getParsedRoles({myroles: ["APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE"]}, ['APP_VALINTAPERUSTEET'])).toEqual(
                [{app: 'APP_VALINTAPERUSTEET', accessRights: 'READ_UPDATE', organizationRights: []}]
            );

            expect(roleParser.getParsedRoles({myroles: ['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEET_CRUD']}, ['APP_VALINTAPERUSTEET'])).toEqual(
                [{app: 'APP_VALINTAPERUSTEET', accessRights: 'CRUD', organizationRights: []}]
            );

            expect(roleParser.getParsedRoles({myroles: ['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEET_READ', 'APP_VALINTAPERUSTEET_READ_UPDATE']}, ['APP_VALINTAPERUSTEET'])).toEqual(
                [{app: 'APP_VALINTAPERUSTEET', accessRights: 'READ_UPDATE', organizationRights: []}]
            );

            expect(roleParser.getParsedRoles({myroles: ['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEET_READ', 'APP_VALINTAPERUSTEET_READ_1.2.3.4.5','APP_VALINTAPERUSTEET_READ_UPDATE', ]}, ['APP_VALINTAPERUSTEET'])).toEqual(
                [{app: 'APP_VALINTAPERUSTEET', accessRights: 'READ_UPDATE', organizationRights: [{oid: '1.2.3.4.5', accessRights: 'READ'}]}]
            );

            expect(roleParser.getParsedRoles({myroles: ['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEET_CRUD', 'APP_VALINTAPERUSTEET_CRUD_1.2.3.4.5','APP_VALINTAPERUSTEET_READ_UPDATE', ]}, ['APP_VALINTAPERUSTEET'])).toEqual(
                [{app: 'APP_VALINTAPERUSTEET', accessRights: 'CRUD', organizationRights: [{oid: '1.2.3.4.5', accessRights: 'CRUD'}]}]
            );

            expect(roleParser.getParsedRoles({myroles: ['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEET_CRUD', 'APP_VALINTAPERUSTEET_READ_UPDATE_1.2.3.4.5','APP_VALINTAPERUSTEET_READ_UPDATE', ]}, ['APP_VALINTAPERUSTEET'])).toEqual(
                [{app: 'APP_VALINTAPERUSTEET', accessRights: 'CRUD', organizationRights: [{oid: '1.2.3.4.5', accessRights: 'READ_UPDATE'}]}]
            );

        });

    });

    describe('getAppRights', function () {
        it('should return highest rightslevel for app', function () {
            expect(roleParser.getAppRights(['APP_VALINTAPERUSTEET', 'APP_VALINTAPERUSTEET_CRUD'],['APP_VALINTAPERUSTEET'])).toEqual('CRUD');
            expect(roleParser.getAppRights(["APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ_UPDATE"], ['APP_VALINTAPERUSTEET'])).toEqual('READ_UPDATE');
            expect(roleParser.getAppRights(["APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ"], ['APP_VALINTAPERUSTEET'])).toEqual('READ');
            expect(roleParser.getAppRights(["APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_UPDATE"], ['APP_VALINTAPERUSTEET'])).toEqual('READ_UPDATE');
            expect(roleParser.getAppRights(["APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", 'APP_VALINTAPERUSTEET_CRUD'], ['APP_VALINTAPERUSTEET'])).toEqual('CRUD');
            expect(roleParser.getAppRights(["APP_VALINTAPERUSTEET", "APP_VALINTAPERUSTEET_READ", "APP_VALINTAPERUSTEET_READ_UPDATE", 'APP_VALINTAPERUSTEET_CRUD'], ['APP_VALINTAPERUSTEET'])).toEqual('CRUD');
        });
    });

    describe('isHigherAccessLevel', function () {
        it('should return true if comparator === comparable', function () {
            expect(roleParser.isHigherAccessLevel('CRUD', 'CRUD')).toBeTruthy();
            expect(roleParser.isHigherAccessLevel('READ', 'READ')).toBeTruthy();
            expect(roleParser.isHigherAccessLevel('READ_UPDATE', 'READ_UPDATE')).toBeTruthy();
        });

        it('should return false for CRUD and any comparator value', function () {
            expect(roleParser.isHigherAccessLevel('CRUD', 'READ_UPDATE')).toBeFalsy();
            expect(roleParser.isHigherAccessLevel('CRUD', 'READ')).toBeFalsy();
        });

        it('should return true if comparated is READ_UPDATE and comparator is READ_UPDATE', function () {
            expect(roleParser.isHigherAccessLevel('READ_UPDATE', 'CRUD')).toBeTruthy();
        });

        it('should return false if comparated is READ_UPDATE and comparator is READ_UPDATE or READ', function () {
            expect(roleParser.isHigherAccessLevel('READ_UPDATE', 'READ')).toBeFalsy();
        });

        it('should return true if comparated is READ and any comparator value', function () {
            expect(roleParser.isHigherAccessLevel('READ', 'READ_UPDATE')).toBeTruthy();
            expect(roleParser.isHigherAccessLevel('READ', 'CRUD')).toBeTruthy();
        });

    });

    describe('containsOid', function () {

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
