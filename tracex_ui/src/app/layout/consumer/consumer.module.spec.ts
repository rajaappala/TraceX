import { ConsumerModule } from './consumer.module';

describe('ProductModule', () => {
    let consumerModule: ConsumerModule;

    beforeEach(() => {
        consumerModule = new ConsumerModule();
    });

    it('should create an instance', () => {
        expect(ConsumerModule).toBeTruthy();
    });
});
