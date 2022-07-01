import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import BlogForm from './BlogForm';

const mockBlog = {
  title: 'just switch to elm lol',
  author: 'elmfan1',
  url: 'https://youtu.be/dQw4w9WgXcQ',
  likes: 0,
  user: { username: 'elmfan2', id: '' },
};

const mockUser = { username: 'elmfan2', token: '' };

describe('The blog component...', () => {
  test('renders title', () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
      mockBlog.title,
    );
  });
  test('renders author', () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
      mockBlog.author,
    );
  });
  test('doesn\'t render url', () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const div = container.querySelector('.blog');
    expect(div).not.toHaveTextContent(
      mockBlog.url,
    );
  });
  test('doesn\'t render likes', () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const div = container.querySelector('.blog');
    expect(div).not.toHaveTextContent(
      mockBlog.likes,
    );
  });
  test('doesn\'t render user', () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const div = container.querySelector('.blog');
    expect(div).not.toHaveTextContent(
      mockBlog.user,
    );
  });
});

describe('after button is pressed...', () => {
  test('renders url', async () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);
    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
      mockBlog.url,
    );
  });
  test('renders likes', async () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);
    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
      mockBlog.likes,
    );
  });
  test('renders user', async () => {
    const { container } = render(<Blog blog={mockBlog} user={mockUser} />);
    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);
    const div = container.querySelector('.blog');
    expect(div).toHaveTextContent(
      mockBlog.user.username,
    );
  });
});

describe('the like button works as expected', () => {
  test('the like function is called the correct amount of times', async () => {
    const mockHandler = jest.fn();
    render(<Blog blog={mockBlog} user={mockUser} addLike={mockHandler} />);
    const user = userEvent.setup();
    const button1 = screen.getByText('view');
    await user.click(button1);
    const button2 = screen.getByText('like');
    await user.click(button2);
    await user.click(button2);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

describe('the blog form works correctly', () => {
  test('the callback function is called with correct info', async () => {
    const user = userEvent.setup();
    const mockHandler = jest.fn();

    const { container } = render(<BlogForm submitBlog={mockHandler} />);

    const titleInput = container.querySelector('#title-input');
    const authorInput = container.querySelector('#author-input');
    const urlInput = container.querySelector('#url-input');

    const usedMockBlog = {
      title: mockBlog.title,
      author: mockBlog.author,
      url: mockBlog.url,
    };

    await user.type(titleInput, mockBlog.title);
    await user.type(authorInput, mockBlog.author);
    await user.type(urlInput, mockBlog.url);

    const submitButton = screen.getByText('submit');
    await user.click(submitButton);
    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0]).toEqual(usedMockBlog);
  });
});
