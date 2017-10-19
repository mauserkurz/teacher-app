import { inject, TestBed } from "@angular/core/testing";
import { MockStore } from "./mock.store";

describe('MockStore', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockStore
      ]
    });
  });

  it('should create fake store', inject([MockStore], (store: MockStore) => {
    expect(store).toBeTruthy();
  }));

  it('should work instead original dispatch method', inject([MockStore], (store: MockStore) => {
    store.dispatch({ type: 'FAKE_ACTION' });
  }));

  it('should work instead original select method', inject([MockStore], (store: MockStore) => {
    store.select(state => state);
  }));
});