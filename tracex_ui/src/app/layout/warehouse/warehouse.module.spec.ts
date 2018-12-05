import { WarehouseModule } from './warehouse.module';

describe('ProductModule', () => {
    let warehouseModule: WarehouseModule;

    beforeEach(() => {
        warehouseModule = new WarehouseModule();
    });

    it('should create an instance', () => {
        expect(WarehouseModule).toBeTruthy();
    });
});
