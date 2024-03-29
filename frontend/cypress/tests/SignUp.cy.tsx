import SignUp from '../../src/components/SignUp/SignUp';
import UserService from '../../src/services/user.service';
import AlertService from '../../src/services/alert.service';
import { AlertType } from '../../src/components/Utils/TopAlert';

describe('<SignUp />', () => {
  describe('sign Up', () => {
    it('the form contains the right form elements', () => {
      cy.mount(<SignUp />);

      cy.get('#signUpModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );
      cy.get('input[name="email"]').should('exist').and('be.visible');
      cy.get('input[name="password"]').should('exist').and('be.visible');
      cy.get('input[name="confirmPassword"]').should('exist').and('be.visible');
      cy.get('button[type="submit"]').should('have.text', 'Sign Up');
    });

    it('Simulate an email error', () => {
      cy.mount(<SignUp />);

      cy.get('#signUpModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').type('aaaa');
      cy.get('input[name="password"]').type('password');
      cy.get('input[name="confirmPassword"]').type('password');
      cy.get('button[type="submit"]').click();

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

      cy.get('#signUpModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('psw');
      cy.get('input[name="confirmPassword"]').type('psw');
      cy.get('button[type="submit"]').click();

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

      cy.get('#signUpModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').type('aaaa@aaaa.com');
      cy.get('input[name="password"]').type('password');
      cy.get('input[name="confirmPassword"]').type('psw');
      cy.get('button[type="submit"]').click();

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
      cy.stub(UserService.getInstance(), 'signUp').returns(user);
      cy.stub(AlertService.getInstance(), 'showAlert').as('showAlert');

      cy.get('#signUpModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[name="confirmPassword"]').type(user.password);

      cy.get('button[type="submit"]').click();

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
      cy.stub(UserService.getInstance(), 'signUp').throws(expectedError);
      cy.stub(AlertService.getInstance(), 'showAlert').as('showAlert');

      cy.get('#signUpModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[name="confirmPassword"]').type(user.password);

      cy.get('button[type="submit"]').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        expectedError.message,
        AlertType.error
      );
    });
  });

  const setSignIn = () => {
    cy.get('#signInModeButton').click();
  };

  describe('sign In', () => {
    it('the form contains the right form elements', () => {
      cy.mount(<SignUp />);

      setSignIn();
      cy.get('#signInModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').should('exist').and('be.visible');
      cy.get('input[name="password"]').should('exist').and('be.visible');
      cy.get('input[name="confirmPassword"]').should('not.exist');
      cy.get('button[type="submit"]').should('have.text', 'Sign In');
    });

    it('Simulate an email error', () => {
      cy.mount(<SignUp />);
      setSignIn();

      cy.get('input[name="email"]').type('aaaa');
      cy.get('input[name="password"]').type('password');
      cy.get('button[type="submit"]').click();

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
      cy.get('button[type="submit"]').click();

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
      cy.stub(UserService.getInstance(), 'signIn').returns(user);
      cy.stub(AlertService.getInstance(), 'showAlert').as('showAlert');

      cy.get('#signInModeButton').should(
        'have.class',
        'MuiButton-containedPrimary'
      );

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);

      cy.get('button[type="submit"]').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        'The user authenticated successfully',
        AlertType.success
      );
    });

    it('Simulate a failed signIn', () => {
      cy.mount(<SignUp />);
      setSignIn();

      const user = { id: 1, email: 'aaaa@aaaa.com', password: 'password' };
      const expectedError = new Error();
      cy.stub(UserService.getInstance(), 'signIn').throws(expectedError);
      cy.stub(AlertService.getInstance(), 'showAlert').as('showAlert');

      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);

      cy.get('button[type="submit"]').click();

      cy.get('@showAlert').should(
        'have.been.calledWithMatch',
        expectedError.message,
        AlertType.error
      );
    });
  });
});
