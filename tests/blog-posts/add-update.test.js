import { expect } from 'chai';
import { BlogPosts } from '@service/blog-posts';
import { StatusCode } from '@constant/http-response-codes';

describe('Add update blog posts', function () {
  const blogPosts = new BlogPosts();

  let blogPost;

  const newPosts = [
    {
      title: 'New Title 2',
      body: 'New blog details 2',
      userId: 2,
    },
    {
      title: 'New Title 3',
      body: 'New blog details 3',
      userId: 3,
    },
    {
      title: 'New Title 4',
      body: 'New blog details 4',
      userId: 4,
    },
  ];

  before('Get a blog post to use for searching and updates', async function () {
    await blogPosts.getAllPosts().then((response) => {
      expect(response.status).to.equal(StatusCode.Ok);
      blogPost = response.data[0];
    });
  });

  describe('Create blog post', function () {
    it('should add a new blog post', async function () {
      const newPost = {
        title: 'New Title',
        body: 'New blog details',
        userId: 1,
      };

      await blogPosts.addPost(newPost).then((response) => {
        expect(response.status).to.equal(StatusCode.Created);
        expect(response.data).to.have.property('id');
      });
    });
  });

  describe('Update blog posts', function () {
    it('Should update an existing blog post', async function () {
      const postUpdate = {
        id: blogPost.id,
        title: 'this is the updated title',
      };

      await blogPosts.updatePost(postUpdate).then((response) => {
        expect(response.status).to.equal(StatusCode.Ok);
        expect(response.data).to.include(postUpdate);
      });
    });

    it('Should return an internal server error when updating a post that does not exist', async function () {
      const postUpdate = {
        id: 'error',
        title: 'this should not update',
      };

      await blogPosts.updatePost(postUpdate).then((response) => {
        expect(response.status).to.equal(StatusCode.InternalServerError);
      });
    });
  });

  describe.only('Create and remove multiple blog posts one after another', function () {
    newPosts.forEach((newPost) => {
      it(`should add a new blog post then delete it: ${newPost.title}`, async function () {
        await blogPosts.addPost(newPost).then((response) => {
          expect(response.status).to.equal(StatusCode.Created);
          expect(response.data).to.have.property('id');
        });
        await blogPosts.getPost(newPost.userId).then((response) => {
          expect(response.status).to.equal(StatusCode.Ok);
        });
        await blogPosts.deletePost(blogPost.id).then((response) => {
          expect(response.status).to.equal(StatusCode.Ok);
        });
      });
    });
  });
});
