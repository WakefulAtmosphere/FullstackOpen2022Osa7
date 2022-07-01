const mockUser = {
  username: 'test',
  password: 'test',
};
const mockBlog1 = {
  title: 'blogtitle',
  author: 'blogauthor',
  url: 'blogurl',
};
const mockBlog2 = {
  title: 'betterblogtitle',
  author: 'betterblogauthor',
  url: 'betterblogurl',
};
describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    cy.request('POST', 'http://localhost:3003/api/users/', mockUser);
    cy.visit('http://localhost:3000');
  });

  it('Login form is shown', () => {
    cy.contains('login');
  });

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username').type(mockUser.username);
      cy.get('#password').type(mockUser.password);
      cy.get('#login-button').click();

      cy.contains('logged in');
    });

    it('fails with wrong credentials', () => {
      cy.get('#username').type(mockUser.username);
      cy.get('#password').type(`${mockUser.password}1`);
      cy.get('html').should('not.contain', 'logged in');
    });
  });
  describe('When logged in', () => {
    beforeEach(() => {
      cy.get('#username').type(mockUser.username);
      cy.get('#password').type(mockUser.password);
      cy.get('#login-button').click();
    });

    it('A blog can be created', () => {
      cy.get('html').contains('add new blog').click();
      cy.get('#title-input').type(mockBlog1.title);
      cy.get('#author-input').type(mockBlog1.author);
      cy.get('#url-input').type(mockBlog1.url);
      cy.get('#blog-submit').click();
      cy.contains(`${mockBlog1.title} - ${mockBlog1.author}`);
    });
    describe('Once a blog exists', () => {
      beforeEach(() => {
        cy.get('html').contains('add new blog').click();
        cy.get('#title-input').type(mockBlog1.title);
        cy.get('#author-input').type(mockBlog1.author);
        cy.get('#url-input').type(mockBlog1.url);
        cy.get('#blog-submit').click();
      });
      it('it can be liked', () => {
        cy.get('html').contains('view').click();
        cy.get('html').contains('like').click();
        cy.contains('likes: 1');
        cy.get('html').contains('like').click();
        cy.contains('likes: 2');
      });
      it('or removed', () => {
        cy.get('html').contains('view').click();
        cy.get('html').contains('remove').click();
        cy.get('html').should('not.contain', `${mockBlog1.title} - ${mockBlog1.author}`);
      });
      it('blogs are displayed sorted by like count', () => {
        cy.get('#title-input').type(mockBlog2.title);
        cy.get('#author-input').type(mockBlog2.author);
        cy.get('#url-input').type(mockBlog2.url);
        cy.get('#blog-submit').click();

        cy.get('html').contains('view').eq(0).click();
        cy.get('html').contains('view').click();

        cy.get('.blog').eq(0).as('blog1');
        cy.get('.blog').eq(1).as('blog2');
        cy.get('@blog1').contains('like').click();
        cy.get('.blog').eq(0).should('contain', 'blogtitle');
        cy.get('@blog2').contains('like').click();
        cy.get('@blog2').contains('like').click();
        cy.get('.blog').eq(0).should('contain', 'betterblogtitle');
      });
    });
  });
});
