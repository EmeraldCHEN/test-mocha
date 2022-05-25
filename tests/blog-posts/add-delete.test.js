import { expect } from 'chai';
import { BlogPosts } from '@service/blog-posts';
import { StatusCode } from '@constant/http-response-codes';

describe('Add and delete blog posts', function () {
  const blogPosts = new BlogPosts();
  const newPosts = [
    {
      title: 'New Title 1',
      body: 'New blog details 1',
      userId: 1,
    },
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

  describe('Create and remove multiple blog posts one after another', function () {
    newPosts.forEach((newPost) => {
      it(`should add a new blog post then delete it: ${newPost.title}`, async function () {
        await blogPosts.addPost(newPost).then((response) => {
          expect(response.status).to.equal(StatusCode.Created);
          expect(response.data).to.have.property('id');
        });
        await blogPosts.getPost(newPost.userId).then((response) => {
          expect(response.status).to.equal(StatusCode.Ok);
        });
        await blogPosts.deletePost(newPost.id).then((response) => {
          expect(response.status).to.equal(StatusCode.Ok);
        });
      });
    });
  });
});
