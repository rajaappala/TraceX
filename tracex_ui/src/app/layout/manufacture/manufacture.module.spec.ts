import { ManufactureModule } from './manufacture.module';

describe('ManufactureModule', () => {
    let manufactureModule: ManufactureModule;

    beforeEach(() => {
        manufactureModule = new ManufactureModule();
    });

    it('should create an instance', () => {
        expect(ManufactureModule).toBeTruthy();
    });
});
