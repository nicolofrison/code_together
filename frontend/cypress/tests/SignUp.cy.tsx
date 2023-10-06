import React from 'react';
import SignUp from '../../src/components/SignUp/SignUp';
import userService from '../../src/services/user.service';
import alertService from '../../src/services/alert.service';
import { AlertType } from '../../src/components/Utils/TopAlert';
import errorHandlerModule from '../../src/utils/errorHandler';

describe('<SignUp />', () => {
  describe('sign Up', () => {
    it('the form contains the right form elements', () => {
      cy.mount(<SignUp />);

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component
      cy.get('input[name="email"]').should('exist').and('be.visible');
      cy.get('input[name="password"]').should('exist').and('be.visible');
      cy.get('input[name="confirmPassword"]').should('exist').and('be.visible');
      cy.get('button').should('have.text', 'Sign Up');
    });

    it('Simulate an email error', () => {
      cy.mount(<SignUp />);

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('password');
      cy.get('input[name="confirmPassword"]').type('password');
      cy.get('button').click();

      cy.get('input[name="email"]').clear().type('aaa');

      const emailInputParent = cy.get('input[name="email"]').parent('div');

      emailInputParent.should('have.class', 'Mui-error');
      emailInputParent.prev('label').should('have.class', 'Mui-error');
      emailInputParent
        .siblings('p')
        .should('have.class', 'Mui-error')
        .and('have.text', 'The email is invalid');

      cy.get('input[name="password"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
      cy.get('input[name="confirmPassword"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
    });

    it('Simulate a password error', () => {
      cy.mount(<SignUp />);

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('psw');
      cy.get('input[name="confirmPassword"]').type('psw');
      cy.get('button').click();

      const passwordInputParent = cy
        .get('input[name="password"]')
        .parent('div');

      passwordInputParent.should('have.class', 'Mui-error');
      passwordInputParent.prev('label').should('have.class', 'Mui-error');
      passwordInputParent
        .siblings('p')
        .should('have.class', 'Mui-error')
        .and(
          'have.text',
          "The password doesn't match the pattern: at least 8 charactes length"
        );

      cy.get('input[name="email"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
      cy.get('input[name="confirmPassword"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
    });

    it('Simulate a confirm password error', () => {
      cy.mount(<SignUp />);

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('password');
      cy.get('input[name="confirmPassword"]').type('psw');
      cy.get('button').click();

      const confirmPasswordInputParent = cy
        .get('input[name="confirmPassword"]')
        .parent('div');

      confirmPasswordInputParent.should('have.class', 'Mui-error');
      confirmPasswordInputParent
        .prev('label')
        .should('have.class', 'Mui-error');
      confirmPasswordInputParent
        .siblings('p')
        .should('have.class', 'Mui-error')
        .and('have.text', 'The passwords do not match');

      cy.get('input[name="email"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
      cy.get('input[name="password"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
    });

    it('Simulate a successful signUp', () => {
      cy.mount(<SignUp />);

      const user = { id: 1, email: 'aaaa@aaaa.com', password: 'password' };
      cy.stub(userService, 'signUp').returns(user);
      cy.stub(alertService, 'showAlert').as('showAlert');

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[name="confirmPassword"]').type(user.password);

      cy.get('button').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        'The user signed up successfully',
        AlertType.success
      );
    });

    it('Simulate a failed signUp', () => {
      cy.mount(<SignUp />);

      const user = { id: 1, email: 'aaaa@aaaa.com', password: 'password' };
      const expectedError = new Error();
      cy.stub(userService, 'signUp').throws(expectedError);
      cy.stub(alertService, 'showAlert').as('showAlert');

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[name="confirmPassword"]').type(user.password);

      cy.get('button').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        expectedError.message,
        AlertType.error
      );
    });
  });

  const setSignIn = () => {
    cy.get('[name="mode"][value="0"]').check();
  };

  describe('sign In', () => {
    it('the form contains the right form elements', () => {
      cy.mount(<SignUp />);

      setSignIn();
      cy.get('[name="mode"][value="1"]').should(
        'not.have.class',
        'Mui-checked'
      ); // 1 is for signUp, check in signUp component
      cy.get('input[name="email"]').should('exist').and('be.visible');
      cy.get('input[name="password"]').should('exist').and('be.visible');
      cy.get('input[name="confirmPassword"]').should('not.exist');
      cy.get('button').should('have.text', 'Sign In');
    });

    it('Simulate an email error', () => {
      cy.mount(<SignUp />);
      setSignIn();

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('password');
      cy.get('button').click();

      cy.get('input[name="email"]').clear().type('aaa');

      const emailInputParent = cy.get('input[name="email"]').parent('div');

      emailInputParent.should('have.class', 'Mui-error');
      emailInputParent.prev('label').should('have.class', 'Mui-error');
      emailInputParent
        .siblings('p')
        .should('have.class', 'Mui-error')
        .and('have.text', 'The email is invalid');

      cy.get('input[name="password"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
    });

    it('Simulate a password error', () => {
      cy.mount(<SignUp />);
      setSignIn();

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('psw');
      cy.get('button').click();

      const passwordInputParent = cy
        .get('input[name="password"]')
        .parent('div');

      passwordInputParent.should('have.class', 'Mui-error');
      passwordInputParent.prev('label').should('have.class', 'Mui-error');
      passwordInputParent
        .siblings('p')
        .should('have.class', 'Mui-error')
        .and(
          'have.text',
          "The password doesn't match the pattern: at least 8 charactes length"
        );

      cy.get('input[name="email"]')
        .parent('div')
        .should('not.have.class', 'Mui-error');
    });

    it('Simulate a successful signIn', () => {
      cy.mount(<SignUp />);
      setSignIn();

      const user = { id: 1, email: 'aaaa@aaaa.com', password: 'password' };
      cy.stub(userService, 'signIn').returns(user);
      cy.stub(alertService, 'showAlert').as('showAlert');

      cy.get('[name="mode"]').should('have.value', 1); // 1 is for signUp, check in signUp component

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);

      cy.get('button').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        'The user authenticated successfully',
        AlertType.success
      );
    });

    it('Simulate a failed signUp', () => {
      cy.mount(<SignUp />);
      setSignIn();

      const user = { id: 1, email: 'aaaa@aaaa.com', password: 'password' };
      const expectedError = new Error();
      cy.stub(userService, 'signIn').throws(expectedError);
      cy.stub(alertService, 'showAlert').as('showAlert');

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);

      cy.get('button').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        expectedError.message,
        AlertType.error
      );
    });
  });
});
