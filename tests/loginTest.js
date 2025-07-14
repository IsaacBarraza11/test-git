const fs = require('fs');
const yaml = require('js-yaml');
const { Builder } = require('selenium-webdriver');
const { expect } = require('chai');
const LoginPage = require('./objects/object.js');
const { addFeature, addSeverity } = require('allure-mocha/runtime');
const { MochaAllure } = require('allure-mocha');

// Cargar el YAML
const config = yaml.load(fs.readFileSync('./tests/objects/capabilities.yaml', 'utf8'));

const USERNAME = process.env.BROWSERSTACK_USERNAME || 'isaacbarraza_2O0N9C7Q';
const ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY || 'oVZijprYgj3jyvxtWgsk';

config.browsers.forEach((caps) => {
  // Agregar credenciales al capabilities
  caps['browserstack.user'] = USERNAME;
  caps['browserstack.key'] = ACCESS_KEY;

  describe(`Login Test en ${caps.browserName} (${caps.os} ${caps.osVersion})`, function () {
    this.timeout(40000);
    let driver;
    let loginPage;

    before(async function () {
      console.log(`🚀 Iniciando pruebas en ${caps.browserName}`);

      driver = await new Builder()
        .usingServer(`https://${USERNAME}:${ACCESS_KEY}@hub-cloud.browserstack.com/wd/hub`)
        .withCapabilities(caps)
        .build();

      await driver.get('https://practicetestautomation.com/practice-test-login/');
      loginPage = new LoginPage(driver);
    });

    after(async function () {
      if (driver) {
        await driver.quit();
      }
    });

    it('[regression] Debe iniciar sesión correctamente', async function () {
      await loginPage.userName('student');
      await loginPage.password('Password123');
      await loginPage.submitButton();

      let result = await loginPage.assertResult();
      expect(result).to.include('Logged In Successfully');

      await loginPage.logout();
      let resultLogout = await loginPage.assertLogout();
      expect(resultLogout).to.include('Test Login | Practice Test Automation');
    });

    it('[smoke] Debe iniciar sesión correctamente', async function () {
      await loginPage.userName('student');
      await loginPage.password('Password');
      await loginPage.submitButton();

      let result = await loginPage.assertResult();
      expect(result).to.include('Logged In Successfully');

      await loginPage.logout();
      let resultLogout = await loginPage.assertLogout();
      expect(resultLogout).to.include('Test Login | Practice Test Automation');
    });
  });
});
