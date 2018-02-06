import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for ehr-access-app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be ehr-access-app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('ehr-access-app');
    })
  });

  it('navbar-brand should be ehr-access-network@0.0.1',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('ehr-access-network@0.0.1');
  });

  
    it('Access component should be loadable',() => {
      page.navigateTo('/Access');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Access');
    });

    it('Access table should have 6 columns',() => {
      page.navigateTo('/Access');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });

  

});
