import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NftCreate } from './nft-create';

describe('NftCreate', () => {
  let component: NftCreate;
  let fixture: ComponentFixture<NftCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NftCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NftCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
