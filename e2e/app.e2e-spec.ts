import { StarWarsPage } from './app.po';

describe('star-wars App', () => {
  let page: StarWarsPage;

  beforeEach(() => {
    page = new StarWarsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
