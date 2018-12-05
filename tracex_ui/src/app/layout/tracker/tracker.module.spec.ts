import { TrackerModule } from './tracker.module';

describe('ProductModule', () => {
    let trackerModule: TrackerModule;

    beforeEach(() => {
        trackerModule = new TrackerModule();
    });

    it('should create an instance', () => {
        expect(TrackerModule).toBeTruthy();
    });
});
