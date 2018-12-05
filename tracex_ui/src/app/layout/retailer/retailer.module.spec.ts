import { RetailerModule } from './retailer.module';

describe('RetailerModule', () => {
    let retailerModule: RetailerModule;

    beforeEach(() => {
        retailerModule = new RetailerModule();
    });

    it('should create an instance', () => {
        expect(RetailerModule).toBeTruthy();
    });
});
