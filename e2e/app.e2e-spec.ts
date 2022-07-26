import { MlPlakPage } from './app.po';

describe('ml-plak App', () => {
  let page: MlPlakPage;

  beforeEach(() => {
    page = new MlPlakPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
